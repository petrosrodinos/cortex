import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AGENT_CRON_QUEUE } from '@/core/queues/queues.constants';
import {
  agentRepeatableJobId,
  computeNextRunAt,
  legacyAgentRepeatableJobId,
} from './utils/cron.utils';
import type { AgentCronTickJobData } from '@/core/queues/processors/agents-cron.processor';

@Injectable()
export class AgentsSchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AgentsSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(AGENT_CRON_QUEUE)
    private readonly queue: Queue<AgentCronTickJobData>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.syncAllEnabledAgents();
    } catch (error) {
      this.logger.error(
        'Failed to sync agent cron jobs on bootstrap',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  async syncAllEnabledAgents(): Promise<void> {
    const agents = await this.prisma.scheduledAgent.findMany({
      where: { is_enabled: true },
      select: { uuid: true, cron_expression: true },
    });

    for (const agent of agents) {
      await this.registerAgent(agent.uuid, agent.cron_expression);
    }
  }

  async registerAgent(uuid: string, cronExpression: string): Promise<void> {
    await this.unregisterAgent(uuid);

    await this.queue.add(
      'tick',
      { agentUuid: uuid },
      {
        repeat: { pattern: cronExpression.trim() },
        jobId: agentRepeatableJobId(uuid),
      },
    );

    const nextRunAt = computeNextRunAt(cronExpression);
    await this.prisma.scheduledAgent.update({
      where: { uuid },
      data: { next_run_at: nextRunAt },
    });
  }

  async unregisterAgent(uuid: string): Promise<void> {
    const jobIds = new Set([
      agentRepeatableJobId(uuid),
      legacyAgentRepeatableJobId(uuid),
    ]);
    const repeatableJobs = await this.queue.getRepeatableJobs();

    await Promise.all(
      repeatableJobs
        .filter(
          (job) =>
            (job.id && jobIds.has(job.id)) || job.key.includes(uuid),
        )
        .map((job) => this.queue.removeRepeatableByKey(job.key)),
    );
  }

  async refreshAgentSchedule(
    uuid: string,
    cronExpression: string,
    isEnabled: boolean,
  ): Promise<void> {
    if (!isEnabled) {
      await this.unregisterAgent(uuid);
      await this.prisma.scheduledAgent.update({
        where: { uuid },
        data: { next_run_at: null },
      });
      return;
    }

    await this.registerAgent(uuid, cronExpression);
  }
}
