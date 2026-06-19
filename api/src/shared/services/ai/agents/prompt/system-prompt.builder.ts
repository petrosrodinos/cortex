import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { IntegrationStatus } from 'generated/prisma';
import type { AttachedDocumentMeta } from '../documents/document-content.types';
import { DocumentReaderService } from '../documents/document-reader.service';
import { AgentActorService } from '../actor/agent-actor.service';
import { ConversationPersonalizationService } from '@/modules/conversation-personalization/conversation-personalization.service';
import { buildPersonalizationPromptBlock } from './personalization-prompt';

const NO_AI_CONNECTOR_MESSAGE =
  'Cortex needs an AI provider before it can respond. Go to Integrations in your dashboard and connect OpenAI, Claude, or Grok.';

@Injectable()
export class SystemPromptBuilder {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documentReader: DocumentReaderService,
    private readonly agentActor: AgentActorService,
    private readonly personalization: ConversationPersonalizationService,
  ) {}

  async getNoAiConnectorMessage(organizationUuid: string): Promise<string | null> {
    const hasAiProvider = await this.prisma.aiProvider.findFirst({
      where: { org_uuid: organizationUuid },
      select: { uuid: true },
    });

    return hasAiProvider ? null : NO_AI_CONNECTOR_MESSAGE;
  }

  async build(
    organizationUuid: string,
    userUuid: string,
    attachedDocuments: AttachedDocumentMeta[] = [],
    integrationUuids?: string[],
  ): Promise<string> {
    const noAiConnectorMessage = await this.getNoAiConnectorMessage(organizationUuid);
    if (noAiConnectorMessage) {
      return [
        'You are Cortex, an AI business operations copilot.',
        'This organization has no AI provider configured.',
        `Respond with exactly this message and nothing else:\n"${noAiConnectorMessage}"`,
      ].join('\n');
    }

    const [organization, actor, integrations] = await Promise.all([
      this.prisma.organization.findUnique({
        where: { uuid: organizationUuid },
      }),
      this.agentActor.resolve(userUuid, organizationUuid),
      this.prisma.integration.findMany({
        where: {
          org_uuid: organizationUuid,
          status: IntegrationStatus.ACTIVE,
          ...(integrationUuids !== undefined ? { uuid: { in: integrationUuids } } : {}),
        },
        include: { database: true, actions: { where: { enabled: true } } },
      }),
    ]);

    const integrationLines = integrations.map((integration) => {
      const actions = integration.actions.map((action) => action.key).join(', ');
      return `- ${integration.name} (${integration.provider}, uuid: ${integration.uuid}): ${actions || 'no enabled actions'}`;
    });

    const schemaBlocks = integrations
      .filter((integration) => integration.database?.schema_cache)
      .map((integration) => {
        return `### ${integration.name}\n${JSON.stringify(integration.database?.schema_cache, null, 2)}`;
      });

    const today = new Date().toISOString().split('T')[0];
    const documentBlock = this.documentReader.formatMetadataForPrompt(attachedDocuments);
    const personalizationSettings = await this.personalization.getForPrompt(userUuid, organizationUuid);
    const personalizationBlock = buildPersonalizationPromptBlock(personalizationSettings);

    return [
      `You are Cortex, an AI business operations copilot for ${organization?.name ?? 'the organization'}.`,
      `Today's date: ${today}.`,
      'Authenticated user:',
      `- member_uuid: ${actor.memberUuid}`,
      `- email: ${actor.email}`,
      `- role: ${actor.roleName}`,
      'Use available tools to retrieve data and take actions. Never invent credentials or integration secrets.',
      'When destructive actions require approval, wait for explicit user approval before proceeding.',
      'When the user attaches documents, call document__list first, then use the matching document__read_* tool to read each file before answering questions about it.',
      'Document read tools: document__read_pdf, document__read_word, document__read_excel, document__read_csv, document__read_text, document__read_image.',
      'Use code_interpreter only for Python data analysis, calculations, or chart generation on structured data already in the conversation.',
      'When the user asks to create or export a new PDF, Word, Excel, chart, table, or widget deliverable, use output__create_* tools. For Word documents use output__create_word. For PDF documents use output__create_pdf. For Excel spreadsheets use output__create_excel.',
      'For interactive widgets: first fetch real data with integration, database, or document tools (or reuse data already in the conversation). Then call output__create_widget with title, data, html, css, and js that implement every control and behavior the user described — sliders, projections, filters, tables, metric cards, etc. Never ship placeholder data or a minimal stub. The chat UI renders the widget automatically; keep the text reply brief.',
      'For follow-up export requests like "make it an excel", "make that a PDF", or "send the list above", use the most recent relevant data already present in the conversation. Do not ask the user to repeat data that is visible in the conversation history.',
      'When the user asks to create, draw, generate, or design an image, illustration, photo, portrait, or graphic, call output__create_image once with a detailed prompt. Do not say you cannot create images. Do not embed image URLs or markdown images in your reply — the UI renders the generated file automatically.',
      'Organization tools: organization__get_account for org profile, organization__list_members and organization__get_member for team directory lookups.',
      'To send email, use a connected email integration tool such as smtp__send_email, sendgrid__send_email, resend__send_email, or gmail__send_message.',
      'Use the to field for any recipient email address. If multiple email integrations are connected and the user did not specify one, choose the most appropriate active integration from Connected integrations.',
      'When emailing a generated file, pass attachment_document_uuids from prior output tool results or generatedDocuments metadata in the conversation. Never claim an email was sent unless an email integration send tool completed successfully.',
      '',
      'Connected integrations:',
      integrationLines.length > 0 ? integrationLines.join('\n') : '- None',
      '',
      documentBlock ? `Attached documents (use document__read_* tools to load content):\n${documentBlock}` : '',
      schemaBlocks.length > 0 ? 'Database schemas:\n' + schemaBlocks.join('\n\n') : '',
      personalizationBlock ?? '',
    ]
      .filter(Boolean)
      .join('\n');
  }
}
