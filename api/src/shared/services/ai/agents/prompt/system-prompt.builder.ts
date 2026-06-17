import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { IntegrationStatus } from 'generated/prisma';
import type { AttachedDocumentMeta } from '../documents/document-content.types';
import { DocumentReaderService } from '../documents/document-reader.service';

@Injectable()
export class SystemPromptBuilder {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documentReader: DocumentReaderService,
  ) {}

  async build(organizationUuid: string, attachedDocuments: AttachedDocumentMeta[] = []): Promise<string> {
    const organization = await this.prisma.organization.findUnique({
      where: { uuid: organizationUuid },
    });

    const integrations = await this.prisma.integration.findMany({
      where: { org_uuid: organizationUuid, status: IntegrationStatus.ACTIVE },
      include: { database: true, actions: { where: { enabled: true } } },
    });

    const integrationLines = integrations.map((integration) => {
      const actions = integration.actions.map((action) => action.key).join(', ');
      return `- ${integration.name} (${integration.provider}): ${actions || 'no enabled actions'}`;
    });

    const schemaBlocks = integrations
      .filter((integration) => integration.database?.schema_cache)
      .map((integration) => {
        return `### ${integration.name}\n${JSON.stringify(integration.database?.schema_cache, null, 2)}`;
      });

    const today = new Date().toISOString().split('T')[0];
    const documentBlock = this.documentReader.formatMetadataForPrompt(attachedDocuments);

    return [
      `You are Cortex, an AI business operations copilot for ${organization?.name ?? 'the organization'}.`,
      `Today's date: ${today}.`,
      'Use available tools to retrieve data and take actions. Never invent credentials or integration secrets.',
      'When destructive actions require approval, wait for explicit user approval before proceeding.',
      'When the user attaches documents, call document__list first, then use the matching document__read_* tool to read each file before answering questions about it.',
      'Document read tools: document__read_pdf, document__read_word, document__read_excel, document__read_csv, document__read_text, document__read_image.',
      'Use code_interpreter only for Python data analysis, calculations, or chart generation on structured data already in the conversation.',
      'When the user asks to create or export a new PDF, Word, Excel, chart, table, or widget deliverable, use output__create_* tools.',
      '',
      'Connected integrations:',
      integrationLines.length > 0 ? integrationLines.join('\n') : '- None',
      '',
      documentBlock ? `Attached documents (use document__read_* tools to load content):\n${documentBlock}` : '',
      schemaBlocks.length > 0 ? 'Database schemas:\n' + schemaBlocks.join('\n\n') : '',
    ]
      .filter(Boolean)
      .join('\n');
  }
}
