import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConversationKind, Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { ConversationsService } from '@/modules/conversations/conversations.service';
import { ConversationMemoryService } from '@/shared/services/ai/memory/conversation-memory.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentsSchedulerService } from './agents-scheduler.service';
import {
  computeNextRunAt,
  validateCronExpression,
} from './utils/cron.utils';

@Injectable()
export class AgentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationsService,
    private readonly scheduler: AgentsSchedulerService,
    private readonly conversations: ConversationsService,
    private readonly memory: ConversationMemoryService,
  ) {}

  async findAll(userUuid: string, organizationUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    return this.prisma.scheduledAgent.findMany({
      where: { org_uuid: organizationUuid, user_uuid: userUuid },
      orderBy: { updated_at: 'desc' },
    });
  }

  async findOne(
    userUuid: string,
    organizationUuid: string,
    agentUuid: string,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    return this.getAgent(userUuid, organizationUuid, agentUuid);
  }

  async create(
    userUuid: string,
    organizationUuid: string,
    dto: CreateAgentDto,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    const title = dto.title.trim();
    const prompt = dto.prompt.trim();
    const cronExpression = dto.cron_expression.trim();
    const isEnabled = dto.is_enabled ?? true;

    validateCronExpression(cronExpression);
    const nextRunAt = isEnabled ? computeNextRunAt(cronExpression) : null;

    const agent = await this.prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {
          org_uuid: organizationUuid,
          user_uuid: userUuid,
          title,
          kind: ConversationKind.SCHEDULED_AGENT,
        },
      });

      return tx.scheduledAgent.create({
        data: {
          org_uuid: organizationUuid,
          user_uuid: userUuid,
          title,
          prompt,
          cron_expression: cronExpression,
          is_enabled: isEnabled,
          conversation_uuid: conversation.uuid,
          next_run_at: nextRunAt,
        },
      });
    });

    if (isEnabled) {
      await this.scheduler.registerAgent(agent.uuid, cronExpression);
    }

    return agent;
  }

  async update(
    userUuid: string,
    organizationUuid: string,
    agentUuid: string,
    dto: UpdateAgentDto,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    const existing = await this.getAgent(userUuid, organizationUuid, agentUuid);

    const data: Prisma.ScheduledAgentUpdateInput = {};
    let conversationTitle: string | undefined;

    if (dto.title !== undefined) {
      const title = dto.title.trim();
      data.title = title;
      conversationTitle = title;
    }

    if (dto.prompt !== undefined) {
      data.prompt = dto.prompt.trim();
    }

    if (dto.cron_expression !== undefined) {
      validateCronExpression(dto.cron_expression);
      data.cron_expression = dto.cron_expression.trim();
    }

    if (dto.is_enabled !== undefined) {
      data.is_enabled = dto.is_enabled;
    }

    const cronExpression =
      (data.cron_expression as string | undefined) ?? existing.cron_expression;
    const isEnabled =
      dto.is_enabled !== undefined ? dto.is_enabled : existing.is_enabled;

    if (isEnabled) {
      validateCronExpression(cronExpression);
      data.next_run_at = computeNextRunAt(cronExpression);
    } else {
      data.next_run_at = null;
    }

    const agent = await this.prisma.$transaction(async (tx) => {
      if (conversationTitle) {
        await tx.conversation.update({
          where: { uuid: existing.conversation_uuid },
          data: { title: conversationTitle },
        });
      }

      return tx.scheduledAgent.update({
        where: { uuid: existing.uuid },
        data,
      });
    });

    const scheduleChanged =
      dto.cron_expression !== undefined || dto.is_enabled !== undefined;

    if (scheduleChanged) {
      await this.scheduler.refreshAgentSchedule(
        agent.uuid,
        cronExpression,
        isEnabled,
      );
    }

    return agent;
  }

  async remove(
    userUuid: string,
    organizationUuid: string,
    agentUuid: string,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    const agent = await this.getAgent(userUuid, organizationUuid, agentUuid);

    await this.scheduler.unregisterAgent(agent.uuid);
    await this.conversations.purgeConversationDocuments(
      userUuid,
      agent.conversation_uuid,
    );
    await this.memory.invalidate(organizationUuid, agent.conversation_uuid);

    await this.prisma.$transaction([
      this.prisma.scheduledAgent.delete({ where: { uuid: agent.uuid } }),
      this.prisma.conversation.delete({
        where: { uuid: agent.conversation_uuid },
      }),
    ]);

    return { deleted: true };
  }

  private async getAgent(
    userUuid: string,
    organizationUuid: string,
    agentUuid: string,
  ) {
    const agent = await this.prisma.scheduledAgent.findFirst({
      where: {
        uuid: agentUuid,
        org_uuid: organizationUuid,
        user_uuid: userUuid,
      },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }
}
