import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { generateText } from 'ai';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AgentExecutionStatus, MessageRole } from 'generated/prisma';
import { ConversationMemoryService } from '@/shared/services/ai/memory/conversation-memory.service';
import { AiProviderFactoryService } from '@/shared/services/ai/providers/ai-provider-factory.service';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { AGENT_RUN_QUEUE } from '@/core/queues/queues.constants';
import type { AgentRunJobData } from '@/core/queues/processors/agent.processor';
import { SendMessageDto } from './dto/send-message.dto';
import { CapabilitiesToolsService } from '@/shared/services/ai/agents/capabilities/capabilities-tools.service';
import { collectDocumentUuids } from './utils/conversation-document.utils';

const DEFAULT_CONVERSATION_TITLE = 'New conversation';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationsService,
    private readonly memory: ConversationMemoryService,
    private readonly providerFactory: AiProviderFactoryService,
    private readonly gcs: GcsService,
    @InjectQueue(AGENT_RUN_QUEUE)
    private readonly agentQueue: Queue<AgentRunJobData>,
    private readonly capabilities: CapabilitiesToolsService,
  ) {}

  async findAll(
    userUuid: string,
    organizationUuid: string,
    conversationUuid: string,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    await this.getConversation(userUuid, organizationUuid, conversationUuid);

    const messages = await this.prisma.message.findMany({
      where: { conversation_uuid: conversationUuid },
      orderBy: { created_at: 'asc' },
    });

    return Promise.all(
      messages.map((message) => this.withViewableAttachmentUrls(message)),
    );
  }

  private async withViewableAttachmentUrls(message: {
    metadata: unknown;
    [key: string]: unknown;
  }) {
    const metadata = message.metadata as {
      attachments?: Array<{
        uuid: string;
        filename: string;
        url?: string;
        mimetype?: string;
        path?: string;
      }>;
    } | null;

    if (!metadata?.attachments?.length) {
      return message;
    }

    const attachments = await Promise.all(
      metadata.attachments.map(async (attachment) => {
        const document = await this.prisma.document.findUnique({
          where: { uuid: attachment.uuid },
          select: { path: true, mimetype: true, filename: true },
        });

        if (!document?.path) {
          return {
            uuid: attachment.uuid,
            filename: attachment.filename,
            mimetype: attachment.mimetype,
          };
        }

        const url = await this.gcs.getSignedUrlForObjectPath(
          document.path,
          60,
          {
            contentType: document.mimetype,
          },
        );

        return {
          uuid: attachment.uuid,
          filename: document.filename,
          mimetype: document.mimetype,
          url,
        };
      }),
    );

    return {
      ...message,
      metadata: {
        ...metadata,
        attachments,
      },
    };
  }

  async sendMessage(
    userUuid: string,
    organizationUuid: string,
    conversationUuid: string,
    dto: SendMessageDto,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    const conversation = await this.getConversation(
      userUuid,
      organizationUuid,
      conversationUuid,
    );
    const attachments = await this.resolveMessageAttachments(
      userUuid,
      dto.documentUuids ?? [],
    );
    const toolkitSlugs = this.resolveToolkitSlugs(dto);
    const toolScope = await this.capabilities.resolveAgentToolScope(
      organizationUuid,
      dto.integrationUuids,
      toolkitSlugs,
    );

    const userMessage = await this.prisma.message.create({
      data: {
        conversation_uuid: conversation.uuid,
        role: MessageRole.USER,
        content: dto.content,
        ...(attachments ? { metadata: { attachments } } : {}),
      },
    });

    await this.memory.invalidate(organizationUuid, conversation.uuid);
    this.memory.scheduleHydrateCacheFromDb(organizationUuid, conversation.uuid);

    const execution = await this.prisma.agentExecution.create({
      data: {
        message_uuid: userMessage.uuid,
        conversation_uuid: conversation.uuid,
        org_uuid: organizationUuid,
        user_uuid: userUuid,
        status: AgentExecutionStatus.PENDING,
        input: {
          content: dto.content,
          documentUuids: dto.documentUuids ?? [],
          integrationUuids: toolScope.integrationUuids,
          toolkitSlugs: toolScope.toolkitSlugs,
        },
      },
    });

    await this.agentQueue.add(
      'run',
      {
        organizationUuid,
        userUuid,
        conversationId: conversation.uuid,
        userMessage: dto.content,
        executionUuid: execution.uuid,
        documentUuids: dto.documentUuids ?? [],
        integrationUuids: toolScope.integrationUuids,
        toolkitSlugs: toolScope.toolkitSlugs,
      },
      {
        jobId: `run-${execution.uuid}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    );

    await this.prisma.conversation.update({
      where: { uuid: conversation.uuid },
      data: { updated_at: new Date() },
    });

    const messageCount = await this.prisma.message.count({
      where: { conversation_uuid: conversation.uuid },
    });

    if (
      messageCount === 1 &&
      (!conversation.title || conversation.title === DEFAULT_CONVERSATION_TITLE)
    ) {
      setImmediate(() => {
        void this.generateAndSetTitle(
          organizationUuid,
          conversation.uuid,
          dto.content,
        );
      });
    }

    return {
      executionId: execution.uuid,
      messageId: userMessage.uuid,
    };
  }

  private async generateAndSetTitle(
    organizationUuid: string,
    conversationUuid: string,
    userMessage: string,
  ) {
    try {
      const title = await this.generateTitleFromMessage(
        organizationUuid,
        userMessage,
      );
      await this.prisma.conversation.update({
        where: { uuid: conversationUuid },
        data: { title },
      });
    } catch {}
  }

  private async generateTitleFromMessage(
    organizationUuid: string,
    message: string,
  ): Promise<string> {
    const fallback = message.trim().slice(0, 60) || DEFAULT_CONVERSATION_TITLE;

    try {
      const resolved =
        await this.providerFactory.resolveProvider(organizationUuid);
      const { text } = await generateText({
        model: resolved.model,
        system:
          'Generate a short, descriptive chat title from the user message. Return only the title (max 6 words). No quotes or punctuation at the end.',
        prompt: message.slice(0, 500),
        maxOutputTokens: 24,
        temperature: 0.3,
      });

      const cleaned = text
        .trim()
        .replace(/^["']|["']$/g, '')
        .replace(/\.$/, '')
        .slice(0, 80);

      return cleaned || fallback;
    } catch {
      return fallback;
    }
  }

  private async resolveMessageAttachments(
    userUuid: string,
    documentUuids: string[],
  ) {
    if (documentUuids.length === 0) {
      return null;
    }

    const documents = await this.prisma.document.findMany({
      where: { uuid: { in: documentUuids }, user_uuid: userUuid },
      select: { uuid: true, filename: true, mimetype: true, path: true },
    });

    if (documents.length !== documentUuids.length) {
      const found = new Set(documents.map((document) => document.uuid));
      const missing = documentUuids.filter((uuid) => !found.has(uuid));
      throw new NotFoundException(`Documents not found: ${missing.join(', ')}`);
    }

    return documents.map(({ uuid, filename, mimetype, path }) => ({
      uuid,
      filename,
      mimetype,
      path,
    }));
  }

  private resolveToolkitSlugs(dto: SendMessageDto): string[] | undefined {
    const values = dto.toolkitSlugs ?? dto.toolkit_slugs;
    if (!values?.length) {
      return undefined;
    }

    return [...new Set(values.map((slug) => slug.trim()).filter(Boolean))];
  }

  private async getConversation(
    userUuid: string,
    organizationUuid: string,
    conversationUuid: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        uuid: conversationUuid,
        org_uuid: organizationUuid,
        user_uuid: userUuid,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async deleteAsSuperAdmin(
    organizationUuid: string,
    conversationUuid: string,
    messageUuid: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        uuid: conversationUuid,
        org_uuid: organizationUuid,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const message = await this.prisma.message.findFirst({
      where: {
        uuid: messageUuid,
        conversation_uuid: conversationUuid,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const messageDocumentUuids = await this.collectMessageDocumentUuids(
      conversationUuid,
      messageUuid,
    );

    await this.prisma.message.delete({ where: { uuid: messageUuid } });

    await this.deleteOrphanedDocuments(
      conversationUuid,
      conversation.user_uuid,
      messageDocumentUuids,
    );

    await this.memory.invalidate(organizationUuid, conversationUuid);
    this.memory.scheduleHydrateCacheFromDb(organizationUuid, conversationUuid);

    return { deleted: true };
  }

  private async collectMessageDocumentUuids(
    conversationUuid: string,
    messageUuid: string,
  ) {
    const documentUuids = new Set<string>();
    const [message, executions] = await Promise.all([
      this.prisma.message.findUnique({
        where: { uuid: messageUuid },
        select: { metadata: true },
      }),
      this.prisma.agentExecution.findMany({
        where: { conversation_uuid: conversationUuid, message_uuid: messageUuid },
        select: {
          input: true,
          tool_calls: {
            select: { output: true },
          },
        },
      }),
    ]);

    collectDocumentUuids(message?.metadata, documentUuids);

    for (const execution of executions) {
      collectDocumentUuids(execution.input, documentUuids);
      for (const toolCall of execution.tool_calls) {
        collectDocumentUuids(toolCall.output, documentUuids);
      }
    }

    return documentUuids;
  }

  private async collectConversationDocumentUuids(conversationUuid: string) {
    const documentUuids = new Set<string>();
    const [messages, executions] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversation_uuid: conversationUuid },
        select: { metadata: true },
      }),
      this.prisma.agentExecution.findMany({
        where: { conversation_uuid: conversationUuid },
        select: {
          input: true,
          tool_calls: {
            select: { output: true },
          },
        },
      }),
    ]);

    for (const item of messages) {
      collectDocumentUuids(item.metadata, documentUuids);
    }

    for (const execution of executions) {
      collectDocumentUuids(execution.input, documentUuids);
      for (const toolCall of execution.tool_calls) {
        collectDocumentUuids(toolCall.output, documentUuids);
      }
    }

    return documentUuids;
  }

  private async deleteOrphanedDocuments(
    conversationUuid: string,
    userUuid: string,
    candidateDocumentUuids: Set<string>,
  ) {
    if (candidateDocumentUuids.size === 0) {
      return;
    }

    const stillReferenced = await this.collectConversationDocumentUuids(conversationUuid);
    const orphanedUuids = [...candidateDocumentUuids].filter(
      (documentUuid) => !stillReferenced.has(documentUuid),
    );

    if (orphanedUuids.length === 0) {
      return;
    }

    const documents = await this.prisma.document.findMany({
      where: {
        uuid: { in: orphanedUuids },
        user_uuid: userUuid,
      },
      select: { uuid: true, path: true },
    });

    if (documents.length === 0) {
      return;
    }

    await Promise.all(
      documents.map((document) =>
        this.gcs.deleteImage({ filename: document.path }),
      ),
    );
    await this.prisma.document.deleteMany({
      where: { uuid: { in: documents.map((document) => document.uuid) } },
    });
  }
}
