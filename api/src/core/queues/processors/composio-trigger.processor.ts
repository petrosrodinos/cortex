import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  AgentExecutionStatus,
  MessageRole,
  OrganizationMemberStatus,
} from 'generated/prisma';
import {
  AGENT_RUN_QUEUE,
  COMPOSIO_TRIGGER_QUEUE,
} from '../queues.constants';
import type { AgentRunJobData } from './agent.processor';

export interface ComposioTriggerJobData {
  triggerUuid?: string | null;
  composioTriggerId?: string | null;
  webhookId?: string | null;
  payload: unknown;
}

@Processor(COMPOSIO_TRIGGER_QUEUE)
export class ComposioTriggerProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(AGENT_RUN_QUEUE)
    private readonly agentQueue: Queue<AgentRunJobData>,
  ) {
    super();
  }

  async process(job: Job<ComposioTriggerJobData>) {
    const trigger = await this.resolveTrigger(job.data);

    if (!trigger?.is_enabled) {
      return { skipped: true, reason: 'trigger_not_enabled' };
    }

    const userUuid =
      trigger.accountUserUuid ??
      (await this.resolveFallbackUserUuid(trigger.org_uuid));

    if (!userUuid) {
      return { skipped: true, reason: 'no_active_user' };
    }

    const title = `Composio trigger: ${trigger.trigger_slug}`;
    const userMessage = this.buildUserMessage(trigger.trigger_slug, job.data.payload);

    const conversation = await this.prisma.conversation.create({
      data: {
        org_uuid: trigger.org_uuid,
        user_uuid: userUuid,
        title,
      },
    });

    const message = await this.prisma.message.create({
      data: {
        conversation_uuid: conversation.uuid,
        role: MessageRole.USER,
        content: userMessage,
        metadata: {
          composio_trigger_uuid: trigger.uuid,
          composio_trigger_id: trigger.composio_trigger_id,
          composio_webhook_id: job.data.webhookId,
          composio_payload: job.data.payload as any,
        },
      },
    });

    const execution = await this.prisma.agentExecution.create({
      data: {
        message_uuid: message.uuid,
        conversation_uuid: conversation.uuid,
        org_uuid: trigger.org_uuid,
        user_uuid: userUuid,
        status: AgentExecutionStatus.PENDING,
        input: {
          source: 'composio_trigger',
          triggerUuid: trigger.uuid,
          triggerSlug: trigger.trigger_slug,
          toolkitSlugs: [trigger.toolkit.slug],
          payload: job.data.payload as any,
        },
      },
    });

    await this.agentQueue.add(
      'run',
      {
        organizationUuid: trigger.org_uuid,
        userUuid,
        conversationId: conversation.uuid,
        userMessage,
        executionUuid: execution.uuid,
        toolkitSlugs: [trigger.toolkit.slug],
      },
      {
        jobId: `run-${execution.uuid}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    );

    return {
      accepted: true,
      trigger_uuid: trigger.uuid,
      execution_uuid: execution.uuid,
      conversation_uuid: conversation.uuid,
    };
  }

  private async resolveTrigger(data: ComposioTriggerJobData) {
    const where = data.triggerUuid
      ? { uuid: data.triggerUuid }
      : data.composioTriggerId
        ? { composio_trigger_id: data.composioTriggerId }
        : null;

    if (!where) {
      return null;
    }

    const trigger = await this.prisma.composioTrigger.findUnique({
      where,
      include: {
        toolkit: { select: { slug: true } },
      },
    });

    if (!trigger) {
      return null;
    }

    const account = await this.prisma.composioConnectedAccount.findUnique({
      where: { composio_account_id: trigger.connected_account_id },
      select: { user_uuid: true },
    });

    return { ...trigger, accountUserUuid: account?.user_uuid ?? null };
  }

  private async resolveFallbackUserUuid(organizationUuid: string): Promise<string | null> {
    const member = await this.prisma.organizationMember.findFirst({
      where: {
        org_uuid: organizationUuid,
        status: OrganizationMemberStatus.ACTIVE,
      },
      orderBy: { joined_at: 'asc' },
      select: { user_uuid: true },
    });

    return member?.user_uuid ?? null;
  }

  private buildUserMessage(triggerSlug: string, payload: unknown): string {
    return [
      `Composio trigger ${triggerSlug} fired.`,
      'Use the event payload to decide what action to take.',
      JSON.stringify(payload, null, 2).slice(0, 8000),
    ].join('\n\n');
  }
}
