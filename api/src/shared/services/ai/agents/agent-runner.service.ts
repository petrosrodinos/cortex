import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AgentExecutionStatus, MessageRole, OrganizationMemberStatus } from 'generated/prisma';
import type { ModelMessage } from 'ai';
import { AiProviderFactoryService } from '../providers/ai-provider-factory.service';
import { ConversationMemoryService } from '../memory/conversation-memory.service';
import { IntegrationToolsFactory } from './integration-tools.factory';
import { SystemPromptBuilder } from './system-prompt.builder';
import { detectOutputType } from './output-detector';
import { WsEventsService } from '@/core/websockets/ws-events.service';
import { ToolDispatcherService } from './tool-dispatcher.service';

export interface AgentRunResult {
  content: string;
  files: string[];
  outputType: string;
  awaitingApproval?: boolean;
  approvalRequests?: unknown[];
}

@Injectable()
export class AgentRunnerService {
  private readonly logger = new Logger(AgentRunnerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerFactory: AiProviderFactoryService,
    private readonly memory: ConversationMemoryService,
    private readonly toolsFactory: IntegrationToolsFactory,
    private readonly systemPromptBuilder: SystemPromptBuilder,
    private readonly wsEvents: WsEventsService,
    private readonly toolDispatcher: ToolDispatcherService,
  ) {}

  async run(
    organizationUuid: string,
    userUuid: string,
    conversationId: string,
    userMessage: string,
    executionUuid: string,
    options?: { resumeApprovals?: Array<{ approvalId: string; approved: boolean }> },
  ): Promise<AgentRunResult> {
    await this.prisma.agentExecution.update({
      where: { uuid: executionUuid },
      data: { status: AgentExecutionStatus.RUNNING, started_at: new Date() },
    });

    try {
      const permissions = await this.loadUserPermissions(userUuid, organizationUuid);
      const resolved = await this.providerFactory.resolveProvider(organizationUuid);
      const messages = await this.memory.getMessages(organizationUuid, conversationId);

      const tools = await this.toolsFactory.buildTools(
        organizationUuid,
        userUuid,
        executionUuid,
        permissions,
        (event, payload) => {
          const room = this.wsEvents.executionRoom(organizationUuid, executionUuid);
          if (event === 'start') {
            this.wsEvents.emitToRoom(room, 'tool:start', payload);
          } else {
            this.wsEvents.emitToRoom(room, 'tool:complete', payload);
          }
        },
      );

      const instructions = await this.systemPromptBuilder.build(organizationUuid);
      const agent = this.providerFactory.createAgent(resolved, tools, instructions, {
        onStepFinish: async (step: any) => {
          const usage = step?.usage;
          if (usage) {
            await this.toolDispatcher.recordStepUsage(executionUuid, 'agent-step', usage, resolved.modelId);
          }
        },
      });

      const result = await agent.generate({
        messages,
        onStepFinish: async (step) => {
          const usage = step?.usage;
          if (usage) {
            await this.toolDispatcher.recordStepUsage(executionUuid, 'agent-step', usage, resolved.modelId);
          }
        },
      });

      const approvalRequests = this.extractApprovalRequests(result);
      if (approvalRequests.length > 0 && !options?.resumeApprovals) {
        const usage = await this.toolDispatcher.syncExecutionUsageTotals(executionUuid);

        await this.prisma.agentExecution.update({
          where: { uuid: executionUuid },
          data: {
            status: AgentExecutionStatus.AWAITING_APPROVAL,
            input: { approvalRequests, messages } as object,
            tokens_used: usage.tokensUsed,
            cost_usd: usage.costUsd,
          },
        });

        this.wsEvents.emitToRoom(this.wsEvents.executionRoom(organizationUuid, executionUuid), 'agent:approval_required', {
          toolName: approvalRequests[0]?.toolName,
          input: approvalRequests[0]?.input,
          executionId: executionUuid,
          approvalRequests,
        });

        return {
          content: '',
          files: [],
          outputType: 'TEXT',
          awaitingApproval: true,
          approvalRequests,
        };
      }

      const content = result.text ?? '';
      const toolResults = (result.steps ?? []).flatMap((step: any) => step.toolResults ?? []);
      const detection = detectOutputType(userMessage, content, toolResults);

      await this.memory.appendMessages(organizationUuid, conversationId, [{ role: 'assistant', content }]);
      await this.memory.persistNewMessages(conversationId, [
        {
          role: MessageRole.ASSISTANT,
          content,
          metadata: { outputType: detection.outputType, files: detection.files },
        },
      ]);

      const usage = await this.toolDispatcher.syncExecutionUsageTotals(executionUuid);

      await this.prisma.agentExecution.update({
        where: { uuid: executionUuid },
        data: {
          status: AgentExecutionStatus.COMPLETED,
          completed_at: new Date(),
          tokens_used: usage.tokensUsed,
          cost_usd: usage.costUsd,
          output: {
            content,
            files: detection.files,
            outputType: detection.outputType,
          },
        },
      });

      this.wsEvents.emitToRoom(this.wsEvents.executionRoom(organizationUuid, executionUuid), 'agent:complete', {
        content,
        files: detection.files,
        executionId: executionUuid,
        outputType: detection.outputType,
        tokensUsed: usage.tokensUsed,
        costUsd: usage.costUsd,
      });

      return {
        content,
        files: detection.files,
        outputType: detection.outputType,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Agent execution failed';
      this.logger.error(message, error instanceof Error ? error.stack : undefined);

      const usage = await this.toolDispatcher.syncExecutionUsageTotals(executionUuid).catch(() => ({
        tokensUsed: 0,
        costUsd: 0,
      }));

      await this.prisma.agentExecution.update({
        where: { uuid: executionUuid },
        data: {
          status: AgentExecutionStatus.FAILED,
          completed_at: new Date(),
          error: message,
          tokens_used: usage.tokensUsed,
          cost_usd: usage.costUsd,
        },
      });

      this.wsEvents.emitToRoom(this.wsEvents.executionRoom(organizationUuid, executionUuid), 'agent:error', {
        error: message,
        executionId: executionUuid,
      });

      throw error;
    }
  }

  private async loadUserPermissions(userUuid: string, organizationUuid: string) {
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        user_uuid: userUuid,
        status: OrganizationMemberStatus.ACTIVE,
        organization: { uuid: organizationUuid },
      },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });

    return membership?.role.permissions.map((entry) => entry.permission.key) ?? [];
  }

  private extractApprovalRequests(result: any) {
    const requests: Array<{ toolName?: string; input?: unknown; approvalId?: string }> = [];

    for (const step of result?.steps ?? []) {
      for (const part of step?.content ?? []) {
        if (part?.type === 'tool-approval-request') {
          requests.push({
            approvalId: part.approvalId,
            toolName: part.toolCall?.toolName,
            input: part.toolCall?.input,
          });
        }
      }
    }

    return requests;
  }
}
