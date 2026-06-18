import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AgentExecutionStatus, MessageRole, OrganizationMemberStatus } from 'generated/prisma';
import type { ModelMessage } from 'ai';
import { AiProviderFactoryService } from '../../providers/ai-provider-factory.service';
import { ConversationMemoryService } from '../../memory/conversation-memory.service';
import { IntegrationToolsFactory } from '../tools/integration-tools.factory';
import { SystemPromptBuilder } from '../prompt/system-prompt.builder';
import { detectOutputType } from '../prompt/output-detector';
import { WsEventsService } from '@/core/websockets/ws-events.service';
import { ToolDispatcherService } from '../tools/tool-dispatcher.service';
import { SandboxCodeService } from '../sandbox/sandbox-code.service';
import { DocumentReaderService } from '../documents/document-reader.service';

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
    private readonly sandboxCode: SandboxCodeService,
    private readonly documentReader: DocumentReaderService,
  ) {}

  async run(
    organizationUuid: string,
    userUuid: string,
    conversationId: string,
    userMessage: string,
    executionUuid: string,
    options?: {
      resumeApprovals?: Array<{ approvalId: string; approved: boolean }>;
      documentUuids?: string[];
    },
  ): Promise<AgentRunResult> {
    const existingExecution = await this.prisma.agentExecution.findUnique({
      where: { uuid: executionUuid },
    });

    if (existingExecution?.status === AgentExecutionStatus.COMPLETED && existingExecution.output) {
      const output = existingExecution.output as {
        content?: string;
        files?: string[];
        outputType?: string;
      };

      return {
        content: output.content ?? '',
        files: output.files ?? [],
        outputType: output.outputType ?? 'TEXT',
      };
    }

    await this.prisma.agentExecution.update({
      where: { uuid: executionUuid },
      data: { status: AgentExecutionStatus.RUNNING, started_at: new Date() },
    });

    try {
      const permissions = await this.loadUserPermissions(userUuid, organizationUuid);
      const resolved = await this.providerFactory.resolveProvider(organizationUuid);
      const messages = await this.memory.getMessages(organizationUuid, conversationId);

      const documentUuids = options?.documentUuids ?? [];
      const attachedDocuments =
        documentUuids.length > 0
          ? await this.documentReader.getAttachedMetadata(documentUuids)
          : [];

      const agentMessages = this.buildAgentMessages(messages, attachedDocuments);

      const tools = await this.toolsFactory.buildTools(
        organizationUuid,
        userUuid,
        executionUuid,
        permissions,
        {
          documentUuids,
          onToolEvent: (event, payload) => {
            const room = this.wsEvents.executionRoom(organizationUuid, executionUuid);
            if (event === 'start') {
              this.wsEvents.emitToRoom(room, 'tool:start', payload);
            } else {
              this.wsEvents.emitToRoom(room, 'tool:complete', payload);
            }
          },
        },
      );

      const instructions = await this.systemPromptBuilder.build(organizationUuid, attachedDocuments);
      const agent = this.providerFactory.createAgent(resolved, tools, instructions, {
        onStepFinish: async (step: any) => {
          const usage = step?.usage;
          if (usage) {
            await this.toolDispatcher.recordStepUsage(executionUuid, 'agent-step', usage, resolved.modelId);
          }
        },
      });

      const result = await agent.generate({
        messages: agentMessages,
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
            input: { approvalRequests, messages: agentMessages, documentUuids } as object,
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

      const toolResults = (result.steps ?? []).flatMap((step: any) => step.toolResults ?? []);
      const content = this.sanitizeAssistantContent(result.text ?? '', toolResults);
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
    } finally {
      await this.sandboxCode.closeSession(executionUuid);
    }
  }

  private buildAgentMessages(
    messages: ModelMessage[],
    attachedDocuments: Awaited<ReturnType<DocumentReaderService['getAttachedMetadata']>>,
  ): ModelMessage[] {
    if (attachedDocuments.length === 0) {
      return messages;
    }

    const documentContext = this.documentReader.formatMetadataForPrompt(attachedDocuments);
    return [
      ...messages,
      {
        role: 'user',
        content:
          `The user attached files to this message. Use document__list and the matching document__read_* tool to load their content before answering.\n\n${documentContext}`,
      },
    ];
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

  private sanitizeAssistantContent(content: string, toolResults: unknown[]): string {
    const imageUrls = new Set<string>();

    for (const result of toolResults) {
      if (!result || typeof result !== 'object') {
        continue;
      }

      const record = result as Record<string, unknown>;
      const payload =
        record.output && typeof record.output === 'object'
          ? (record.output as Record<string, unknown>)
          : record;

      if (typeof payload.file_url === 'string') {
        imageUrls.add(payload.file_url);
      }
    }

    if (imageUrls.size === 0) {
      return content.trim();
    }

    let sanitized = content;
    for (const url of imageUrls) {
      const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      sanitized = sanitized.replace(new RegExp(`!\\[[^\\]]*\\]\\(${escaped}\\)`, 'g'), '');
      sanitized = sanitized.replace(new RegExp(escaped, 'g'), '');
    }

    return sanitized.replace(/\n{3,}/g, '\n\n').trim();
  }
}

