import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AgentRunnerService } from '@/shared/services/ai/agents/runner/agent-runner.service';
import { AGENT_RUN_QUEUE } from '../queues.constants';

export interface AgentRunJobData {
  organizationUuid: string;
  userUuid: string;
  conversationId: string;
  userMessage: string;
  executionUuid: string;
  documentUuids?: string[];
  resumeApprovals?: Array<{ approvalId: string; approved: boolean }>;
}

@Processor(AGENT_RUN_QUEUE)
export class AgentProcessor extends WorkerHost {
  private readonly logger = new Logger(AgentProcessor.name);

  constructor(private readonly agentRunner: AgentRunnerService) {
    super();
  }

  async process(job: Job<AgentRunJobData>) {
    this.logger.log(`Processing agent job ${job.id} for execution ${job.data.executionUuid}`);

    return await this.agentRunner.run(
      job.data.organizationUuid,
      job.data.userUuid,
      job.data.conversationId,
      job.data.userMessage,
      job.data.executionUuid,
      {
        resumeApprovals: job.data.resumeApprovals,
        documentUuids: job.data.documentUuids,
      },
    );
  }
}
