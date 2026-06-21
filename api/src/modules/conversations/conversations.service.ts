import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { ConversationMemoryService } from '@/shared/services/ai/memory/conversation-memory.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { collectDocumentUuids } from './utils/conversation-document.utils';

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

    return this.prisma.conversation.update({
      where: { uuid: conversation.uuid },
      data: { title: dto.title.trim() },
    });
  }

  async delete(userUuid: string, organizationUuid: string, conversationUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    const conversation = await this.getConversation(userUuid, organizationUuid, conversationUuid);
    const documents = await this.getConversationDocuments(conversation.uuid, userUuid);

    await Promise.all(documents.map((document) => this.gcs.deleteImage({ filename: document.path })));
    if (documents.length > 0) {
      await this.prisma.document.deleteMany({ where: { uuid: { in: documents.map((document) => document.uuid) } } });
    }

    await this.memory.invalidate(organizationUuid, conversation.uuid);
    await this.prisma.conversation.delete({ where: { uuid: conversation.uuid } });
    return { deleted: true };
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
