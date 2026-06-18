import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AgentExecutionStatus } from 'generated/prisma';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { AGENT_RUN_QUEUE } from '@/core/queues/queues.constants';
import type { AgentRunJobData } from '@/core/queues/processors/agent.processor';

@Injectable()
export class ExecutionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationsService,
    @InjectQueue(AGENT_RUN_QUEUE) private readonly agentQueue: Queue<AgentRunJobData>,
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

  async findOne(userUuid: string, organizationUuid: string, executionUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);
    return this.getExecution(userUuid, organizationUuid, executionUuid);
  }

  async approve(userUuid: string, organizationUuid: string, executionUuid: string) {
    const execution = await this.getExecution(userUuid, organizationUuid, executionUuid);

    if (execution.status !== AgentExecutionStatus.AWAITING_APPROVAL) {
      throw new BadRequestException('Execution is not awaiting approval');
    }

    const input = (execution.input ?? {}) as {
      approvalRequests?: Array<{ approvalId: string }>;
      content?: string;
      documentUuids?: string[];
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
        resumeApprovals: (input.approvalRequests ?? []).map((request) => ({
          approvalId: request.approvalId,
          approved: true,
        })),
      },
      {
        jobId: `resume:${execution.uuid}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    );

    return { approved: true, executionId: execution.uuid };
  }

  async reject(userUuid: string, organizationUuid: string, executionUuid: string) {
    const execution = await this.getExecution(userUuid, organizationUuid, executionUuid);

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
  ): Promise<{
    total_tokens: number;
    total_cost_usd: number;
    total_executions: number;
    daily: Array<{ date: string; tokens: number; cost_usd: number; count: number }>;
  }> {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    const aggregate = await this.prisma.agentExecution.aggregate({
      where: {
        org_uuid: organizationUuid,
        user_uuid: userUuid,
        status: AgentExecutionStatus.COMPLETED,
      },
      _sum: { tokens_used: true, cost_usd: true },
      _count: true,
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentExecutions = await this.prisma.agentExecution.findMany({
      where: {
        org_uuid: organizationUuid,
        user_uuid: userUuid,
        status: AgentExecutionStatus.COMPLETED,
        created_at: { gte: thirtyDaysAgo },
      },
      select: { created_at: true, tokens_used: true, cost_usd: true },
    });

    const dailyMap = new Map<string, { tokens: number; cost_usd: number; count: number }>();

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyMap.set(key, { tokens: 0, cost_usd: 0, count: 0 });
    }

    for (const exec of recentExecutions) {
      const key = exec.created_at.toISOString().slice(0, 10);
      if (dailyMap.has(key)) {
        const entry = dailyMap.get(key)!;
        entry.tokens += exec.tokens_used ?? 0;
        entry.cost_usd += Number(exec.cost_usd ?? 0);
        entry.count += 1;
      }
    }

    const daily = Array.from(dailyMap.entries()).map(([date, val]) => ({
      date,
      tokens: val.tokens,
      cost_usd: val.cost_usd,
      count: val.count,
    }));

    return {
      total_tokens: aggregate._sum.tokens_used ?? 0,
      total_cost_usd: Number(aggregate._sum.cost_usd ?? 0),
      total_executions: aggregate._count,
      daily,
    };
  }

  private async getExecution(userUuid: string, organizationUuid: string, executionUuid: string) {
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
