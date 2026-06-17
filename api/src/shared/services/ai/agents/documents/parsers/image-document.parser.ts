import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AiProviderType } from 'generated/prisma';
import { EncryptionService } from '@/shared/utils/encryption.service';
import type { DocumentParseContext, DocumentParser } from '../document-parser.interface';

@Injectable()
export class ImageDocumentParser implements DocumentParser {
  private readonly logger = new Logger(ImageDocumentParser.name);

  readonly kind = 'image' as const;
  readonly toolName = 'document__read_image';
  readonly contentKind = 'image' as const;
  readonly description =
    'Analyze an attached image using vision. Returns visible text, tables, charts, and entities. Pass the document_uuid from document__list.';

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly encryption: EncryptionService,
  ) {}

  matches(mimetype: string, _filename: string): boolean {
    return mimetype.toLowerCase().startsWith('image/');
  }

  async parse(buffer: Buffer, context: DocumentParseContext): Promise<string> {
    const apiKey = await this.resolveOpenAiApiKey(context.organizationUuid);
    if (!apiKey) {
      return 'Image analysis unavailable: no OpenAI API key configured.';
    }

    const openai = createOpenAI({ apiKey });
    const dataUrl = `data:${context.mimetype};base64,${buffer.toString('base64')}`;

    try {
      const result = await generateText({
        model: openai('gpt-4o'),
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', image: dataUrl },
              {
                type: 'text',
                text: 'Analyze this image for a business operations assistant. Describe visible text, tables, charts, entities, and anything relevant to document Q&A.',
              },
            ],
          },
        ],
      });

      return result.text.trim();
    } catch (error) {
      this.logger.warn(
        `Image analysis failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
      return 'Image analysis failed.';
    }
  }

  private async resolveOpenAiApiKey(organizationUuid: string): Promise<string | null> {
    const record = await this.prisma.aiProvider.findFirst({
      where: { org_uuid: organizationUuid, is_default: true, provider: AiProviderType.OPENAI },
      orderBy: { created_at: 'asc' },
    });

    if (record) {
      return this.encryption.decrypt(record.api_key);
    }

    return this.config.get<string>('OPENAI_API_KEY') ?? null;
  }
}
