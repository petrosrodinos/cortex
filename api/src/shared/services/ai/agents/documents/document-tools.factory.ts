import { Injectable } from '@nestjs/common';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import { DocumentReaderService } from './document-reader.service';
import { DocumentParserRegistry } from './document-parser.registry';

export interface DocumentToolsContext {
  organizationUuid: string;
  documentUuids: string[];
  onToolEvent?: (event: 'start' | 'complete', payload: Record<string, unknown>) => void;
}

@Injectable()
export class DocumentToolsFactory {
  constructor(
    private readonly documentReader: DocumentReaderService,
    private readonly registry: DocumentParserRegistry,
  ) {}

  async buildTools(context: DocumentToolsContext): Promise<ToolSet> {
    if (context.documentUuids.length === 0) {
      return {};
    }

    const tools: ToolSet = {};
    const allowedUuids = new Set(context.documentUuids);
    const metadata = await this.documentReader.getAttachedMetadata(context.documentUuids);

    tools.document__list = tool({
      description:
        'List documents attached to the current chat message. Returns uuid, filename, mimetype, and the recommended read tool for each file.',
      inputSchema: jsonSchema({ type: 'object', properties: {}, additionalProperties: false }),
      execute: async () => {
        context.onToolEvent?.('start', { toolName: 'document__list', input: {} });
        const started = Date.now();
        const result = { documents: metadata };
        context.onToolEvent?.('complete', {
          toolName: 'document__list',
          result,
          durationMs: Date.now() - started,
          success: true,
        });
        return result;
      },
    });

    for (const parser of this.registry.getAll()) {
      tools[parser.toolName] = tool({
        description: parser.description,
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            document_uuid: {
              type: 'string',
              description: 'UUID of the attached document to read (from document__list)',
            },
          },
          required: ['document_uuid'],
        }),
        execute: async (input: { document_uuid: string }) => {
          const { document_uuid: documentUuid } = input;
          context.onToolEvent?.('start', { toolName: parser.toolName, input: { documentUuid } });
          const started = Date.now();

          if (!allowedUuids.has(documentUuid)) {
            const error = { error: 'Document is not attached to this message' };
            context.onToolEvent?.('complete', {
              toolName: parser.toolName,
              result: error,
              durationMs: Date.now() - started,
              success: false,
            });
            return error;
          }

          try {
            const result = await this.documentReader.readDocument(
              documentUuid,
              context.organizationUuid,
              parser.kind,
            );
            context.onToolEvent?.('complete', {
              toolName: parser.toolName,
              result,
              durationMs: Date.now() - started,
              success: true,
            });
            return result;
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to read document';
            const failure = { error: message };
            context.onToolEvent?.('complete', {
              toolName: parser.toolName,
              result: failure,
              durationMs: Date.now() - started,
              success: false,
            });
            return failure;
          }
        },
      });
    }

    return tools;
  }
}
