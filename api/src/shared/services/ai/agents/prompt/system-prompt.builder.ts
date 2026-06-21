import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import type { AttachedDocumentMeta } from '../documents/document-content.types';
import { DocumentReaderService } from '../documents/document-reader.service';
import { ConversationPersonalizationService } from '@/modules/conversation-personalization/conversation-personalization.service';
import { buildPersonalizationPromptBlock } from './blocks/personalization-prompt';
import { buildUserContextPromptBlock } from './blocks/user-context-prompt';

const NO_AI_CONNECTOR_MESSAGE =
  'Cortex needs an AI provider before it can respond. Go to Integrations in your dashboard and connect OpenAI, Claude, or Grok.';

@Injectable()
export class SystemPromptBuilder {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documentReader: DocumentReaderService,
    private readonly personalization: ConversationPersonalizationService,
  ) {}

  async getNoAiConnectorMessage(
    organizationUuid: string,
  ): Promise<string | null> {
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
  ): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
    const documentBlock =
      this.documentReader.formatMetadataForPrompt(attachedDocuments);
    const [personalizationSettings, user] = await Promise.all([
      this.personalization.getForPrompt(userUuid, organizationUuid),
      this.prisma.user.findUnique({
        where: { uuid: userUuid },
        select: { email: true, first_name: true, last_name: true },
      }),
    ]);
    const personalizationBlock = buildPersonalizationPromptBlock(
      personalizationSettings,
    );
    const userContextBlock = buildUserContextPromptBlock(
      user ?? { email: null, first_name: null, last_name: null },
    );

    return [
      'You are Cortex, an AI business operations copilot.',
      `Today's date: ${today}.`,
      userContextBlock ?? '',
      'Use available tools to retrieve data and take actions. For any question about counts, records, amounts, or data from connected systems, always query with the appropriate tool — never guess or estimate. Never invent credentials, integration secrets, data values, or entity IDs. If no tool can answer a question, say so explicitly.',
      'When answering with data from tools, include the key records or values the user may reference in follow-up messages such as email, export, or "send that". Assistant messages may also include a "Tool results from this turn" section with the raw fetched data — reuse that section for follow-ups instead of re-querying unless the user asks for fresh data.',
      'When destructive actions require approval, wait for explicit user approval before proceeding.',
      'When the user asks what is connected, what toolkits are enabled, or what you can do, call capabilities__list_integrations and capabilities__list_toolkits before answering.',
      'For organization profile details not listed above, call organization__get_account.',
      'For Composio SaaS actions, use COMPOSIO_SEARCH_TOOLS to discover tools within enabled toolkits, then execute via Composio meta tools.',
      'When the user attaches documents, call document__list first, then use the matching document__read_* tool to read each file before answering questions about it.',
      'Document read tools: document__read_pdf, document__read_word, document__read_excel, document__read_csv, document__read_text, document__read_image.',
      'Use code_interpreter only for Python data analysis, calculations, or chart generation on structured data already in the conversation.',
      'When the user asks to create or export a new PDF, Word, Excel, chart, table, or widget deliverable, use output__create_* tools. For Word documents use output__create_word. For PDF documents use output__create_pdf. For Excel spreadsheets use output__create_excel.',
      'For interactive widgets: first fetch real data with integration, database, or document tools (or reuse data already in the conversation). Then call output__create_widget with title, data, html, css, and js that implement every control and behavior the user described — sliders, projections, filters, tables, metric cards, etc. Never ship placeholder data or a minimal stub. The chat UI renders the widget automatically; keep the text reply brief.',
      'For follow-up export requests like "make it an excel", "make that a PDF", or "send the list above", use the most recent relevant data already present in the conversation. Do not ask the user to repeat data that is visible in the conversation history.',
      'When the user asks to create, draw, generate, or design an image, illustration, photo, portrait, or graphic, call output__create_image once with a detailed prompt. Do not say you cannot create images. Do not embed image URLs or markdown images in your reply — the UI renders the generated file automatically.',
      'Organization tools: organization__get_account for org profile, organization__list_members and organization__get_member for team directory lookups.',
      'Capabilities tools: capabilities__list_integrations, capabilities__list_toolkits, capabilities__get_database_schema for discovery before querying connected systems.',
      'For connected databases, inspect schema with db__get_schema or capabilities__get_database_schema, then fetch rows with db__query using parameterized SQL against the tables in that schema. Do not use code_interpreter to connect to external databases.',
      'When db__query returns foreign-key UUID columns (category_uuid, subcategory_uuid, account_uuid, user_uuid, etc.), JOIN the related tables from the schema to return human-readable names, titles, or labels instead of raw UUIDs in your answer and in follow-up exports. Omit internal ids and uuid columns from user-facing tables unless the user asks for them.',
      'To send email, use only an email channel listed under "Available tools for this message" in your instructions, or discover channels with capabilities__list_integrations and capabilities__list_toolkits.',
      'Use the recipient field required by the selected email tool for any recipient email address. When the user asks to send to themselves without naming an address, use the current authenticated user email from the session context above. If multiple email channels are available and the user did not specify one, choose from the listed channels only — never assume Gmail or another provider that is not listed.',
      'When emailing a generated file, use generatedDocuments metadata from the conversation or the file URL from the output tool result if the selected email tool supports attachments or links. Never claim an email was sent unless the email tool completed successfully. If no email channel is available, tell the user to connect one in Integrations instead of inventing provider-specific restrictions.',
      documentBlock
        ? `Attached documents (use document__read_* tools to load content):\n${documentBlock}`
        : '',
      personalizationBlock ?? '',
    ]
      .filter(Boolean)
      .join('\n');
  }
}
