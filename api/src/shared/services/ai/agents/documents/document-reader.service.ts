import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import type {
  AttachedDocumentMeta,
  DocumentReadToolResult,
} from './document-content.types';
import type { DocumentParserKind } from './document-parser.interface';
import { DocumentParserRegistry } from './document-parser.registry';

const MAX_DOCUMENT_CHARS = 50_000;

@Injectable()
export class DocumentReaderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gcsService: GcsService,
    private readonly registry: DocumentParserRegistry,
  ) {}

  async getAttachedMetadata(documentUuids: string[]): Promise<AttachedDocumentMeta[]> {
    if (documentUuids.length === 0) {
      return [];
    }

    const documents = await this.loadDocuments(documentUuids);

    return documents.map((document) => {
      const parser = this.registry.resolve(document.mimetype, document.filename);
      return {
        uuid: document.uuid,
        filename: document.filename,
        mimetype: document.mimetype,
        suggestedTool: parser?.toolName ?? 'document__read_text',
      };
    });
  }

  async readDocument(
    documentUuid: string,
    organizationUuid: string,
    expectedKind: DocumentParserKind,
  ): Promise<DocumentReadToolResult> {
    const parser = this.registry.getByKind(expectedKind);
    if (!parser) {
      throw new BadRequestException(`Unknown document parser: ${expectedKind}`);
    }

    const document = await this.loadDocument(documentUuid);
    if (!parser.matches(document.mimetype, document.filename)) {
      const resolved = this.registry.resolve(document.mimetype, document.filename);
      throw new BadRequestException(
        `Document "${document.filename}" (${document.mimetype}) does not match ${parser.toolName}. Use ${resolved?.toolName ?? 'the correct document read tool'} instead.`,
      );
    }

    const downloaded = await this.gcsService.downloadImage({ filename: document.path });
    const text = await parser.parse(downloaded.buffer, {
      organizationUuid,
      mimetype: document.mimetype,
      filename: document.filename,
    });

    const { content, truncated } = this.truncate(text);

    return {
      uuid: document.uuid,
      filename: document.filename,
      mimetype: document.mimetype,
      kind: parser.contentKind,
      content,
      truncated,
    };
  }

  formatMetadataForPrompt(documents: AttachedDocumentMeta[]): string {
    if (documents.length === 0) {
      return '';
    }

    return documents
      .map(
        (document) =>
          `- ${document.filename} (${document.mimetype}) | uuid: ${document.uuid} | tool: ${document.suggestedTool}`,
      )
      .join('\n');
  }

  private async loadDocuments(documentUuids: string[]) {
    const documents = await this.prisma.document.findMany({
      where: { uuid: { in: documentUuids } },
    });

    if (documents.length !== documentUuids.length) {
      const found = new Set(documents.map((document) => document.uuid));
      const missing = documentUuids.filter((uuid) => !found.has(uuid));
      throw new NotFoundException(`Documents not found: ${missing.join(', ')}`);
    }

    return documents;
  }

  private async loadDocument(documentUuid: string) {
    const document = await this.prisma.document.findUnique({
      where: { uuid: documentUuid },
    });

    if (!document) {
      throw new NotFoundException(`Document not found: ${documentUuid}`);
    }

    return document;
  }

  private truncate(text: string): { content: string; truncated: boolean } {
    if (text.length <= MAX_DOCUMENT_CHARS) {
      return { content: text, truncated: false };
    }

    return {
      content: `${text.slice(0, MAX_DOCUMENT_CHARS)}\n\n[Content truncated at ${MAX_DOCUMENT_CHARS} characters]`,
      truncated: true,
    };
  }
}
