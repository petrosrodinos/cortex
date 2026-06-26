import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AgentExecutionStatus } from 'generated/prisma';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AgentRunnerService } from '@/shared/services/ai/agents/runner/agent-runner.service';
import { AgentProgressEmitterService } from '@/shared/services/ai/agents/progress/agent-progress-emitter.service';
import { AiProviderType, AiResearchMode } from 'generated/prisma';
import { AGENT_RUN_QUEUE } from '../queues.constants';

export interface AgentRunJobData {
  organizationUuid: string;
  userUuid: string;
  conversationId: string;
  userMessage: string;
  executionUuid: string;
  documentUuids?: string[];
  integrationUuids?: string[];
  toolkitSlugs?: string[];
  toolkitConnectionTiers?: Record<string, string>;
  aiProvider?: AiProviderType | null;
  aiModel?: string | null;
  aiResearchMode?: AiResearchMode | null;
  resumeApprovals?: Array<{
    approvalId: string;
    approved: boolean;
    reason?: string;
  }>;
}

@Processor(AGENT_RUN_QUEUE)
export class AgentProcessor extends WorkerHost {
  private readonly logger = new Logger(AgentProcessor.name);

  constructor(
    private readonly agentRunner: AgentRunnerService,
    private readonly prisma: PrismaService,
    private readonly progressEmitter: AgentProgressEmitterService,
  ) {
    super();
  }

  async process(job: Job<AgentRunJobData>) {
    return await this.agentRunner.run(
      job.data.organizationUuid,
      job.data.userUuid,
      job.data.conversationId,
      job.data.userMessage,
      job.data.executionUuid,
      {
        resumeApprovals: job.data.resumeApprovals,
        documentUuids: job.data.documentUuids,
        integrationUuids: job.data.integrationUuids,
        toolkitSlugs: job.data.toolkitSlugs,
        toolkitConnectionTiers: job.data.toolkitConnectionTiers,
        aiProvider: job.data.aiProvider,
        aiModel: job.data.aiModel,
        aiResearchMode: job.data.aiResearchMode,
      },
    );
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<AgentRunJobData> | undefined, error: Error) {
    if (!job?.data?.executionUuid) {
      return;
    }

    const message = error?.message ?? 'Agent execution failed';

    try {
      const updated = await this.prisma.agentExecution.updateMany({
        where: {
          uuid: job.data.executionUuid,
          status: {
            in: [AgentExecutionStatus.PENDING, AgentExecutionStatus.RUNNING],
          },
        },
        data: {
          status: AgentExecutionStatus.FAILED,
          completed_at: new Date(),
          error: message,
        },
      });

      if (updated.count === 0) {
        return;
      }

      this.progressEmitter
        .createScope(
          job.data.organizationUuid,
          job.data.conversationId,
          job.data.executionUuid,
        )
        .emitError(message);
    } catch (markFailedError) {
      this.logger.error(
        `Failed to mark execution ${job.data.executionUuid} as failed`,
        markFailedError instanceof Error ? markFailedError.stack : undefined,
      );
    }
  }
}
