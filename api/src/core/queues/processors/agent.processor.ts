import { Processor, WorkerHost } from '@nestjs/bullmq';
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
  integrationUuids?: string[];
  toolkitSlugs?: string[];
  resumeApprovals?: Array<{ approvalId: string; approved: boolean }>;
}

@Processor(AGENT_RUN_QUEUE)
export class AgentProcessor extends WorkerHost {
  constructor(private readonly agentRunner: AgentRunnerService) {
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
      },
    );
  }
}
