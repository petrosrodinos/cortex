import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AgentExecutionStatus, MessageRole } from 'generated/prisma';
import { ConversationMemoryService } from '@/shared/services/ai/memory/conversation-memory.service';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { AGENT_RUN_QUEUE } from '@/core/queues/queues.constants';
import type { AgentRunJobData } from '@/core/queues/processors/agent.processor';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationsService,
    private readonly memory: ConversationMemoryService,
    @InjectQueue(AGENT_RUN_QUEUE) private readonly agentQueue: Queue<AgentRunJobData>,
  ) {}

  async findAll(userUuid: string, organizationUuid: string, conversationUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    await this.getConversation(userUuid, organizationUuid, conversationUuid);

    return this.prisma.message.findMany({
      where: { conversation_uuid: conversationUuid },
      orderBy: { created_at: 'asc' },
    });
  }

  async sendMessage(userUuid: string, organizationUuid: string, conversationUuid: string, dto: SendMessageDto) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    const conversation = await this.getConversation(userUuid, organizationUuid, conversationUuid);

    const userMessage = await this.prisma.message.create({
      data: {
        conversation_uuid: conversation.uuid,
        role: MessageRole.USER,
        content: dto.content,
      },
    });

    await this.memory.appendMessages(organizationUuid, conversation.uuid, [{ role: 'user', content: dto.content }]);

    const execution = await this.prisma.agentExecution.create({
      data: {
        message_uuid: userMessage.uuid,
        conversation_uuid: conversation.uuid,
        org_uuid: organizationUuid,
        user_uuid: userUuid,
        status: AgentExecutionStatus.PENDING,
        input: { content: dto.content },
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
      },
      {
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

    return {
      executionId: execution.uuid,
      messageId: userMessage.uuid,
    };
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
