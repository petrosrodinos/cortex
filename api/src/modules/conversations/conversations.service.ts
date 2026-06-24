import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AiResearchMode, ConversationKind, Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { ConversationMemoryService } from '@/shared/services/ai/memory/conversation-memory.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { collectDocumentUuids } from './utils/conversation-document.utils';
import {
  normalizeResearchModeForModel,
  supportsResearchMode,
} from '@/shared/services/ai/providers/model-capabilities';
import { assertInteractiveConversation } from './utils/conversation-kind.utils';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationsService,
    private readonly memory: ConversationMemoryService,
    private readonly gcs: GcsService,
  ) {}

  async findAll(userUuid: string, organizationUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    return this.prisma.conversation.findMany({
      where: { org_uuid: organizationUuid, user_uuid: userUuid },
      orderBy: { updated_at: 'desc' },
      include: {
        messages: {
          orderBy: { created_at: 'desc' },
          take: 1,
        },
      },
    });
  }

  async create(userUuid: string, organizationUuid: string, dto: CreateConversationDto) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    return this.prisma.conversation.create({
      data: {
        org_uuid: organizationUuid,
        user_uuid: userUuid,
        title: dto.title ?? 'New conversation',
      },
    });
  }

  async findOne(userUuid: string, organizationUuid: string, conversationUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    return this.getConversation(userUuid, organizationUuid, conversationUuid);
  }

  async update(
    userUuid: string,
    organizationUuid: string,
    conversationUuid: string,
    dto: UpdateConversationDto,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    const conversation = await this.getConversation(userUuid, organizationUuid, conversationUuid);
    assertInteractiveConversation(conversation.kind);

    const data: Prisma.ConversationUpdateInput = {};
    if (dto.title !== undefined) {
      data.title = dto.title.trim();
    }

    if (dto.ai_provider !== undefined) {
      const connected = await this.prisma.aiProvider.findFirst({
        where: { org_uuid: organizationUuid, provider: dto.ai_provider },
      });
      if (!connected) {
        throw new BadRequestException(
          `${dto.ai_provider} is not connected. Connect it in Integrations.`,
        );
      }
      data.ai_provider = dto.ai_provider;
      data.ai_model = dto.ai_model ?? connected.default_model;
    } else if (dto.ai_model !== undefined) {
      if (!conversation.ai_provider) {
        throw new BadRequestException('Select a provider before choosing a model.');
      }
      data.ai_model = dto.ai_model;
    }

    if (dto.ai_research_mode !== undefined) {
      const providerForMode = (data.ai_provider as typeof conversation.ai_provider) ?? conversation.ai_provider;
      const modelForMode = (data.ai_model as string | undefined) ?? conversation.ai_model;
      if (
        dto.ai_research_mode !== AiResearchMode.DEFAULT &&
        !supportsResearchMode(providerForMode, modelForMode, dto.ai_research_mode)
      ) {
        throw new BadRequestException(
          'The selected model does not support this research mode.',
        );
      }
      data.ai_research_mode = dto.ai_research_mode;
    }

    const resolvedProvider = (data.ai_provider as typeof conversation.ai_provider) ?? conversation.ai_provider;
    const resolvedModel = (data.ai_model as string | undefined) ?? conversation.ai_model;
    if (resolvedProvider && resolvedModel) {
      data.ai_research_mode = normalizeResearchModeForModel(
        resolvedProvider,
        resolvedModel,
        (data.ai_research_mode as AiResearchMode | undefined) ??
          dto.ai_research_mode ??
          conversation.ai_research_mode,
      );
    }

    return this.prisma.conversation.update({
      where: { uuid: conversation.uuid },
      data,
    });
  }

  async delete(userUuid: string, organizationUuid: string, conversationUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    const conversation = await this.getConversation(userUuid, organizationUuid, conversationUuid);
    assertInteractiveConversation(conversation.kind);
    await this.purgeConversationDocuments(userUuid, conversation.uuid);
    await this.memory.invalidate(organizationUuid, conversation.uuid);
    await this.prisma.conversation.delete({ where: { uuid: conversation.uuid } });
    return { deleted: true };
  }

  async purgeConversationDocuments(userUuid: string, conversationUuid: string) {
    const documents = await this.getConversationDocuments(conversationUuid, userUuid);

    await Promise.all(documents.map((document) => this.gcs.deleteImage({ filename: document.path })));
    if (documents.length > 0) {
      await this.prisma.document.deleteMany({
        where: { uuid: { in: documents.map((document) => document.uuid) } },
      });
    }
  }

  private async getConversationDocuments(conversationUuid: string, userUuid: string) {
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

    const documentUuids = new Set<string>();

    for (const message of messages) {
      collectDocumentUuids(message.metadata, documentUuids);
    }

    for (const execution of executions) {
      collectDocumentUuids(execution.input, documentUuids);
      for (const toolCall of execution.tool_calls) {
        collectDocumentUuids(toolCall.output, documentUuids);
      }
    }

    if (documentUuids.size === 0) {
      return [];
    }

    return this.prisma.document.findMany({
      where: {
        uuid: { in: [...documentUuids] },
        user_uuid: userUuid,
      },
      select: { uuid: true, path: true },
    });
  }

  private async getConversation(userUuid: string, organizationUuid: string, conversationUuid: string) {
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
}
