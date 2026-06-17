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
    };

    await this.prisma.agentExecution.update({
      where: { uuid: execution.uuid },
      data: { status: AgentExecutionStatus.PENDING },
    });

    await this.agentQueue.add('resume', {
      organizationUuid,
      userUuid,
      conversationId: execution.conversation_uuid,
      userMessage: input.content ?? '',
      executionUuid: execution.uuid,
      resumeApprovals: (input.approvalRequests ?? []).map((request) => ({
        approvalId: request.approvalId,
        approved: true,
      })),
    });

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
