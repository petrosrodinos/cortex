import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AgentExecutionStatus, MessageRole, OrganizationMemberStatus } from 'generated/prisma';
import type { ModelMessage } from 'ai';
import { AiProviderFactoryService } from '../../providers/ai-provider-factory.service';
import { ConversationMemoryService } from '../../memory/conversation-memory.service';
import { IntegrationToolsFactory } from '../tools/integration-tools.factory';
import { SystemPromptBuilder } from '../prompt/system-prompt.builder';
import { detectOutputType } from '../prompt/output-detector';
import { isExportFollowUpRequest } from '../outputs/tools/output-tools.factory';
import { extractGeneratedDocuments, isEmailSendRequest } from '../prompt/email-send.utils';
import { WsEventsService } from '@/core/websockets/ws-events.service';
import { ToolDispatcherService } from '../tools/tool-dispatcher.service';
import { SandboxCodeService } from '../sandbox/sandbox-code.service';
import { DocumentReaderService } from '../documents/document-reader.service';

interface SavedExecutionInput {
  content?: string;
  documentUuids?: string[];
  integrationUuids?: string[];
  approvalRequests?: Array<{ approvalId: string; toolName?: string; input?: unknown }>;
  agentMessages?: ModelMessage[];
  responseMessages?: ModelMessage[];
}

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
      integrationUuids?: string[];
    },
  ): Promise<AgentRunResult> {
    const existingExecution = await this.prisma.agentExecution.findUnique({
      where: { uuid: executionUuid },
    });
    const savedInput = (existingExecution?.input ?? {}) as SavedExecutionInput;

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

    if (
      existingExecution?.status === AgentExecutionStatus.AWAITING_APPROVAL &&
      !options?.resumeApprovals?.length
    ) {
      return {
        content: '',
        files: [],
        outputType: 'TEXT',
        awaitingApproval: true,
        approvalRequests: savedInput.approvalRequests ?? [],
      };
    }

    await this.prisma.agentExecution.update({
      where: { uuid: executionUuid },
      data: { status: AgentExecutionStatus.RUNNING, started_at: new Date() },
    });

    try {
      const noAiConnectorMessage = await this.systemPromptBuilder.getNoAiConnectorMessage(organizationUuid);
      if (noAiConnectorMessage) {
        return this.completeWithDirectResponse(
          organizationUuid,
          conversationId,
          executionUuid,
          noAiConnectorMessage,
        );
      }

      const permissions = await this.loadUserPermissions(userUuid, organizationUuid);
      const resolved = await this.providerFactory.resolveProvider(organizationUuid);
      const messages = await this.memory.getMessages(organizationUuid, conversationId);

      const documentUuids = options?.documentUuids ?? savedInput.documentUuids ?? [];
      const integrationUuids = options?.integrationUuids ?? savedInput.integrationUuids;
      const attachedDocuments =
        documentUuids.length > 0
          ? await this.documentReader.getAttachedMetadata(documentUuids)
          : [];

      const agentMessages =
        options?.resumeApprovals?.length && savedInput.agentMessages?.length
          ? savedInput.agentMessages
          : this.buildAgentMessages(messages, attachedDocuments);
      const messagesForAgent = this.buildMessagesForAgent(agentMessages, savedInput, options?.resumeApprovals);

      const tools = await this.toolsFactory.buildTools(
        organizationUuid,
        userUuid,
        executionUuid,
        permissions,
        {
          documentUuids,
          integrationUuids,
          userMessage,
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

      const instructions = await this.buildInstructions(
        organizationUuid,
        userUuid,
        attachedDocuments,
        integrationUuids,
        userMessage,
        messagesForAgent,
      );
      const agent = this.providerFactory.createAgent(resolved, tools, instructions);

      const result = await agent.generate({
        messages: messagesForAgent,
        onStepFinish: async (step) => {
          const usage = step?.usage;
          if (usage) {
            await this.toolDispatcher.recordStepUsage(executionUuid, 'agent-step', usage, resolved.modelId);
          }
        },
      });

      const approvalRequests = this.extractApprovalRequests(result);
      if (approvalRequests.length > 0 && !options?.resumeApprovals?.length) {
        const usage = await this.toolDispatcher.syncExecutionUsageTotals(executionUuid);

        await this.prisma.agentExecution.update({
          where: { uuid: executionUuid },
          data: {
            status: AgentExecutionStatus.AWAITING_APPROVAL,
            input: {
              content: savedInput.content ?? userMessage,
              approvalRequests,
              agentMessages,
              responseMessages: result.response.messages,
              documentUuids,
              integrationUuids,
            } as object,
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
      const generatedDocuments = extractGeneratedDocuments(toolResults);
      const content = this.sanitizeAssistantContent(result.text ?? '', toolResults);
      const detection = detectOutputType(userMessage, content, toolResults);
      const usage = await this.toolDispatcher.syncExecutionUsageTotals(executionUuid);

      const completionUpdate = await this.prisma.agentExecution.updateMany({
        where: {
          uuid: executionUuid,
          status: { not: AgentExecutionStatus.COMPLETED },
        },
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

      if (completionUpdate.count === 0) {
        const completedExecution = await this.prisma.agentExecution.findUnique({
          where: { uuid: executionUuid },
        });
        const output = (completedExecution?.output ?? {}) as {
          content?: string;
          files?: string[];
          outputType?: string;
        };

        return {
          content: output.content ?? content,
          files: output.files ?? detection.files,
          outputType: output.outputType ?? detection.outputType,
        };
      }

      await this.memory.persistNewMessages(conversationId, [
        {
          role: MessageRole.ASSISTANT,
          content,
          metadata: {
            outputType: detection.outputType,
            ...(detection.files.length > 0 ? { files: detection.files } : {}),
            ...(generatedDocuments.length > 0 ? { generatedDocuments } : {}),
          },
        },
      ]);
      this.memory.scheduleHydrateCacheFromDb(organizationUuid, conversationId);

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
      try {
        await this.sandboxCode.closeSession(executionUuid);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to close sandbox session';
        this.logger.warn(`Sandbox cleanup failed for ${executionUuid}: ${message}`);
      }
    }
  }

  private async completeWithDirectResponse(
    organizationUuid: string,
    conversationId: string,
    executionUuid: string,
    content: string,
  ): Promise<AgentRunResult> {
    const usage = await this.toolDispatcher.syncExecutionUsageTotals(executionUuid).catch(() => ({
      tokensUsed: 0,
      costUsd: 0,
    }));

    await this.prisma.agentExecution.updateMany({
      where: {
        uuid: executionUuid,
        status: { not: AgentExecutionStatus.COMPLETED },
      },
      data: {
        status: AgentExecutionStatus.COMPLETED,
        completed_at: new Date(),
        tokens_used: usage.tokensUsed,
        cost_usd: usage.costUsd,
        output: {
          content,
          files: [],
          outputType: 'TEXT',
        },
      },
    });

    await this.memory.persistNewMessages(conversationId, [
      {
        role: MessageRole.ASSISTANT,
        content,
        metadata: { outputType: 'TEXT' },
      },
    ]);
    this.memory.scheduleHydrateCacheFromDb(organizationUuid, conversationId);

    this.wsEvents.emitToRoom(this.wsEvents.executionRoom(organizationUuid, executionUuid), 'agent:complete', {
      content,
      files: [],
      executionId: executionUuid,
      outputType: 'TEXT',
      tokensUsed: usage.tokensUsed,
      costUsd: usage.costUsd,
    });

    return {
      content,
      files: [],
      outputType: 'TEXT',
    };
  }

  private buildMessagesForAgent(
    agentMessages: ModelMessage[],
    savedInput: SavedExecutionInput,
    resumeApprovals?: Array<{ approvalId: string; approved: boolean }>,
  ): ModelMessage[] {
    if (!resumeApprovals?.length) {
      return agentMessages;
    }

    const responseMessages = savedInput.responseMessages ?? [];
    if (responseMessages.length === 0) {
      return agentMessages;
    }

    return [
      ...agentMessages,
      ...responseMessages,
      {
        role: 'tool',
        content: resumeApprovals.map((approval) => ({
          type: 'tool-approval-response' as const,
          approvalId: approval.approvalId,
          approved: approval.approved,
        })),
      },
    ];
  }

  private async buildInstructions(
    organizationUuid: string,
    userUuid: string,
    attachedDocuments: Awaited<ReturnType<DocumentReaderService['getAttachedMetadata']>>,
    integrationUuids: string[] | undefined,
    userMessage: string,
    messagesForAgent: ModelMessage[],
  ) {
    const instructions = await this.systemPromptBuilder.build(
      organizationUuid,
      userUuid,
      attachedDocuments,
      integrationUuids,
    );

    const guidance: string[] = [];

    if (this.shouldApplyExportFollowUpGuidance(userMessage, messagesForAgent)) {
      guidance.push(
        'The latest user message is a follow-up export request.',
        'Use the data already present in this conversation to build the requested file now.',
        'If the prior assistant reply only summarized results, re-run the same organization or database tools instead of asking the user to provide the data again.',
      );
    }

    if (this.shouldApplyEmailSendGuidance(userMessage, messagesForAgent)) {
      guidance.push(
        'The latest user message asks to send content by email.',
        'First gather the needed organization or output data with the appropriate tools, then send email with a connected email integration tool such as smtp__send_email, sendgrid__send_email, resend__send_email, or gmail__send_message.',
        'Use the to field for the recipient email address. Attach generated files with attachment_document_uuids from earlier output tool results or generatedDocuments metadata in the conversation.',
        'Do not claim an email was sent until an email integration send tool completes successfully.',
      );
    }

    if (guidance.length === 0) {
      return instructions;
    }

    return [instructions, ...guidance].join('\n');
  }

  private shouldApplyEmailSendGuidance(userMessage: string, messagesForAgent: ModelMessage[]) {
    if (!isEmailSendRequest(userMessage)) {
      return false;
    }

    return messagesForAgent.some((message) => message.role === 'assistant');
  }

  private shouldApplyExportFollowUpGuidance(userMessage: string, messagesForAgent: ModelMessage[]) {
    if (!isExportFollowUpRequest(userMessage)) {
      return false;
    }

    return messagesForAgent.some((message) => message.role === 'assistant');
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
    const seenApprovalIds = new Set<string>();

    const collect = (parts: unknown[]) => {
      for (const part of parts) {
        if (!part || typeof part !== 'object') {
          continue;
        }

        const record = part as Record<string, unknown>;
        if (record.type !== 'tool-approval-request' || typeof record.approvalId !== 'string') {
          continue;
        }

        if (seenApprovalIds.has(record.approvalId)) {
          continue;
        }

        seenApprovalIds.add(record.approvalId);
        const toolCall =
          record.toolCall && typeof record.toolCall === 'object'
            ? (record.toolCall as Record<string, unknown>)
            : null;

        requests.push({
          approvalId: record.approvalId,
          toolName: typeof toolCall?.toolName === 'string' ? toolCall.toolName : undefined,
          input: toolCall?.input,
        });
      }
    };

    for (const step of result?.steps ?? []) {
      if (Array.isArray(step?.content)) {
        collect(step.content);
      }
    }

    for (const message of result?.response?.messages ?? []) {
      if (message?.role === 'assistant' && Array.isArray(message.content)) {
        collect(message.content);
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

