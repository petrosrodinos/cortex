import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AgentExecutionStatus } from 'generated/prisma';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { AGENT_RUN_QUEUE } from '@/core/queues/queues.constants';
import type { AgentRunJobData } from '@/core/queues/processors/agent.processor';
import type { UsageQueryType } from './dto/usage-query.schema';

type UsageScope = {
  canViewOrgUsage: boolean;
  userUuidFilter?: string;
};

@Injectable()
export class ExecutionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationsService,
    @InjectQueue(AGENT_RUN_QUEUE)
    private readonly agentQueue: Queue<AgentRunJobData>,
  ) {}

  async findAll(userUuid: string, organizationUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    return this.prisma.agentExecution.findMany({
      where: { org_uuid: organizationUuid, user_uuid: userUuid },
      orderBy: { created_at: 'desc' },
      include: { tool_calls: true },
      take: 50,
    });
  }

  async findOne(
    userUuid: string,
    organizationUuid: string,
    executionUuid: string,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    return this.getExecution(userUuid, organizationUuid, executionUuid);
  }

  async approve(
    userUuid: string,
    organizationUuid: string,
    executionUuid: string,
  ) {
    const execution = await this.getExecution(
      userUuid,
      organizationUuid,
      executionUuid,
    );

    if (execution.status !== AgentExecutionStatus.AWAITING_APPROVAL) {
      throw new BadRequestException('Execution is not awaiting approval');
    }

    const input = (execution.input ?? {}) as {
      approvalRequests?: Array<{ approvalId: string }>;
      content?: string;
      documentUuids?: string[];
      integrationUuids?: string[];
      toolkitSlugs?: string[];
    };

    await this.prisma.agentExecution.update({
      where: { uuid: execution.uuid },
      data: { status: AgentExecutionStatus.PENDING },
    });

    await this.agentQueue.add(
      'resume',
      {
        organizationUuid,
        userUuid,
        conversationId: execution.conversation_uuid,
        userMessage: input.content ?? '',
        executionUuid: execution.uuid,
        documentUuids: input.documentUuids ?? [],
        integrationUuids: input.integrationUuids,
        toolkitSlugs: input.toolkitSlugs,
        resumeApprovals: (input.approvalRequests ?? []).map((request) => ({
          approvalId: request.approvalId,
          approved: true,
        })),
      },
      {
        jobId: `resume-${execution.uuid}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    );

    return { approved: true, executionId: execution.uuid };
  }

  async reject(
    userUuid: string,
    organizationUuid: string,
    executionUuid: string,
  ) {
    const execution = await this.getExecution(
      userUuid,
      organizationUuid,
      executionUuid,
    );

    if (execution.status !== AgentExecutionStatus.AWAITING_APPROVAL) {
      throw new BadRequestException('Execution is not awaiting approval');
    }

    await this.prisma.agentExecution.update({
      where: { uuid: execution.uuid },
      data: {
        status: AgentExecutionStatus.FAILED,
        completed_at: new Date(),
        error: 'Tool execution rejected by user',
        output: { content: 'The requested action was rejected.' },
      },
    });

    return { rejected: true, executionId: execution.uuid };
  }

  async getUsage(
    userUuid: string,
    organizationUuid: string,
    query: UsageQueryType,
  ) {
    const scope = await this.resolveUsageScope(
      userUuid,
      organizationUuid,
      query.member_uuid,
    );
    const where = this.buildUsageWhere(organizationUuid, scope, query);

    const aggregate = await this.prisma.agentExecution.aggregate({
      where,
      _sum: { tokens_used: true, cost_usd: true },
      _count: true,
    });

    const { rangeStart, rangeEnd } = this.resolveDateRange(query);
    const dailyExecutions = await this.prisma.agentExecution.findMany({
      where: {
        ...where,
        created_at: {
          gte: rangeStart,
          lte: rangeEnd,
        },
      },
      select: { created_at: true, tokens_used: true, cost_usd: true },
    });

    const dailyMap = this.createDailyMap(rangeStart, rangeEnd);

    for (const execution of dailyExecutions) {
      const key = execution.created_at.toISOString().slice(0, 10);
      if (dailyMap.has(key)) {
        const entry = dailyMap.get(key)!;
        entry.tokens += execution.tokens_used ?? 0;
        entry.cost_usd += Number(execution.cost_usd ?? 0);
        entry.count += 1;
      }
    }

    const daily = Array.from(dailyMap.entries()).map(([date, value]) => ({
      date,
      tokens: value.tokens,
      cost_usd: value.cost_usd,
      count: value.count,
    }));

    return {
      total_tokens: aggregate._sum.tokens_used ?? 0,
      total_cost_usd: Number(aggregate._sum.cost_usd ?? 0),
      total_executions: aggregate._count,
      daily,
    };
  }

  async getUsageRecords(
    userUuid: string,
    organizationUuid: string,
    query: UsageQueryType,
  ) {
    const scope = await this.resolveUsageScope(
      userUuid,
      organizationUuid,
      query.member_uuid,
    );
    const where = this.buildUsageWhere(organizationUuid, scope, query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.prisma.agentExecution.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: { select: { uuid: true, email: true } },
          conversation: { select: { uuid: true, title: true } },
          tool_calls: {
            select: {
              uuid: true,
              tool_name: true,
              tokens_used: true,
              cost_usd: true,
              status: true,
              duration_ms: true,
              created_at: true,
            },
          },
        },
      }),
      this.prisma.agentExecution.count({ where }),
    ]);

    const memberUuids = await this.prisma.organizationMember.findMany({
      where: {
        org_uuid: organizationUuid,
        user_uuid: { in: records.map((record) => record.user_uuid) },
      },
      select: { uuid: true, user_uuid: true },
    });

    const memberUuidByUserUuid = new Map(
      memberUuids.map((member) => [member.user_uuid, member.uuid]),
    );

    const data = records.map((record) => ({
      uuid: record.uuid,
      status: record.status,
      tokens_used: record.tokens_used,
      cost_usd: Number(record.cost_usd ?? 0),
      created_at: record.created_at,
      completed_at: record.completed_at,
      conversation_uuid: record.conversation_uuid,
      conversation_title: record.conversation.title,
      user_uuid: record.user_uuid,
      member_uuid: memberUuidByUserUuid.get(record.user_uuid) ?? null,
      user_email: record.user.email,
      tool_calls_count: record.tool_calls.length,
      tool_calls: record.tool_calls.map((toolCall) => ({
        uuid: toolCall.uuid,
        tool_name: toolCall.tool_name,
        tokens_used: toolCall.tokens_used,
        cost_usd: Number(toolCall.cost_usd ?? 0),
        status: toolCall.status,
        duration_ms: toolCall.duration_ms,
        created_at: toolCall.created_at,
      })),
    }));

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
        has_next: page < Math.ceil(total / limit),
        has_prev: page > 1,
      },
    };
  }

  private async resolveUsageScope(
    userUuid: string,
    organizationUuid: string,
    memberUuid?: string,
  ): Promise<UsageScope> {
    const membership = await this.organizations.requireActiveMember(
      userUuid,
      organizationUuid,
    );
    const canViewOrgUsage = this.organizations.hasPermission(
      membership,
      'ai:usage:read',
    );

    if (!memberUuid) {
      return {
        canViewOrgUsage,
        userUuidFilter: canViewOrgUsage ? undefined : userUuid,
      };
    }

    const member = await this.prisma.organizationMember.findFirst({
      where: {
        uuid: memberUuid,
        org_uuid: organizationUuid,
      },
    });

    if (!member) {
      throw new BadRequestException('Member not found');
    }

    if (!canViewOrgUsage && member.user_uuid !== userUuid) {
      throw new ForbiddenException('You can only view your own usage');
    }

    return {
      canViewOrgUsage,
      userUuidFilter: member.user_uuid,
    };
  }

  private buildUsageWhere(
    organizationUuid: string,
    scope: UsageScope,
    query: UsageQueryType,
  ): Prisma.AgentExecutionWhereInput {
    const where: Prisma.AgentExecutionWhereInput = {
      org_uuid: organizationUuid,
      status: AgentExecutionStatus.COMPLETED,
    };

    if (scope.userUuidFilter) {
      where.user_uuid = scope.userUuidFilter;
    }

    if (query.date_from || query.date_to) {
      where.created_at = {};

      if (query.date_from) {
        where.created_at.gte = this.startOfDay(query.date_from);
      }

      if (query.date_to) {
        where.created_at.lte = this.endOfDay(query.date_to);
      }
    }

    return where;
  }

  private resolveDateRange(query: UsageQueryType) {
    const today = new Date();
    const defaultStart = new Date(today);
    defaultStart.setDate(defaultStart.getDate() - 29);

    const rangeStart = query.date_from
      ? this.startOfDay(query.date_from)
      : this.startOfDay(defaultStart);
    const rangeEnd = query.date_to
      ? this.endOfDay(query.date_to)
      : this.endOfDay(today);

    return { rangeStart, rangeEnd };
  }

  private createDailyMap(rangeStart: Date, rangeEnd: Date) {
    const dailyMap = new Map<
      string,
      { tokens: number; cost_usd: number; count: number }
    >();
    const cursor = new Date(rangeStart);

    while (cursor <= rangeEnd) {
      dailyMap.set(cursor.toISOString().slice(0, 10), {
        tokens: 0,
        cost_usd: 0,
        count: 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return dailyMap;
  }

  private startOfDay(value: string | Date) {
    const date =
      typeof value === 'string'
        ? new Date(`${value}T00:00:00.000Z`)
        : new Date(value);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  private endOfDay(value: string | Date) {
    const date =
      typeof value === 'string'
        ? new Date(`${value}T00:00:00.000Z`)
        : new Date(value);
    date.setUTCHours(23, 59, 59, 999);
    return date;
  }

  private async getExecution(
    userUuid: string,
    organizationUuid: string,
    executionUuid: string,
  ) {
    const execution = await this.prisma.agentExecution.findFirst({
      where: {
        uuid: executionUuid,
        org_uuid: organizationUuid,
        user_uuid: userUuid,
      },
      include: { tool_calls: true, message: true },
    });

    if (!execution) {
      throw new NotFoundException('Execution not found');
    }

    return execution;
  }
}
