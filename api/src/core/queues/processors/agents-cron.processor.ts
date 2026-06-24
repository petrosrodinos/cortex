import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ConversationMemoryService } from '@/shared/services/ai/memory/conversation-memory.service';
import {
  AgentExecutionStatus,
  MessageRole,
} from 'generated/prisma';
import {
  AGENT_CRON_QUEUE,
  AGENT_RUN_QUEUE,
} from '../queues.constants';
import type { AgentRunJobData } from './agent.processor';
import { computeNextRunAt } from '@/modules/agents/utils/cron.utils';

export interface AgentCronTickJobData {
  agentUuid: string;
}

@Processor(AGENT_CRON_QUEUE)
export class AgentsCronProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memory: ConversationMemoryService,
    @InjectQueue(AGENT_RUN_QUEUE)
    private readonly agentQueue: Queue<AgentRunJobData>,
  ) {
    super();
  }

  async process(job: Job<AgentCronTickJobData>) {
    const agentUuid =
      job.data.agentUuid ??
      (job.data as { scheduledAgentUuid?: string }).scheduledAgentUuid;

    if (!agentUuid) {
      return { skipped: true, reason: 'missing_agent_uuid' };
    }

    const agent = await this.prisma.scheduledAgent.findUnique({
      where: { uuid: agentUuid },
      include: {
        conversation: {
          select: {
            uuid: true,
            ai_provider: true,
            ai_model: true,
            ai_research_mode: true,
          },
        },
      },
    });

    if (!agent?.is_enabled) {
      return { skipped: true, reason: 'agent_not_enabled' };
    }

    const now = new Date();
    const userMessage = await this.prisma.message.create({
      data: {
        conversation_uuid: agent.conversation_uuid,
        role: MessageRole.USER,
        content: agent.prompt,
        metadata: {
          source: 'agent',
          agent_uuid: agent.uuid,
        },
      },
    });

    await this.memory.invalidate(agent.org_uuid, agent.conversation_uuid);
    this.memory.scheduleHydrateCacheFromDb(agent.org_uuid, agent.conversation_uuid);

    const execution = await this.prisma.agentExecution.create({
      data: {
        message_uuid: userMessage.uuid,
        conversation_uuid: agent.conversation_uuid,
        org_uuid: agent.org_uuid,
        user_uuid: agent.user_uuid,
        status: AgentExecutionStatus.PENDING,
        input: {
          source: 'agent',
          agentUuid: agent.uuid,
          content: agent.prompt,
          aiProvider: agent.conversation.ai_provider ?? undefined,
          aiModel: agent.conversation.ai_model ?? undefined,
          aiResearchMode: agent.conversation.ai_research_mode ?? undefined,
        },
      },
    });

    await this.agentQueue.add(
      'run',
      {
        organizationUuid: agent.org_uuid,
        userUuid: agent.user_uuid,
        conversationId: agent.conversation_uuid,
        userMessage: agent.prompt,
        executionUuid: execution.uuid,
        aiProvider: agent.conversation.ai_provider,
        aiModel: agent.conversation.ai_model,
        aiResearchMode: agent.conversation.ai_research_mode,
      },
      {
        jobId: `run-${execution.uuid}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    );

    const nextRunAt = computeNextRunAt(agent.cron_expression, now);

    await this.prisma.$transaction([
      this.prisma.scheduledAgent.update({
        where: { uuid: agent.uuid },
        data: {
          last_run_at: now,
          next_run_at: nextRunAt,
        },
      }),
      this.prisma.conversation.update({
        where: { uuid: agent.conversation_uuid },
        data: { updated_at: now },
      }),
    ]);

    return {
      accepted: true,
      agent_uuid: agent.uuid,
      execution_uuid: execution.uuid,
      conversation_uuid: agent.conversation_uuid,
    };
  }
}
