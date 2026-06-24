import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  AgentExecutionStatus,
  AiProviderType,
  AiResearchMode,
  MessageRole,
  OrganizationMemberStatus,
  ToolCallStatus,
} from 'generated/prisma';
import type { ModelMessage } from 'ai';
import { AiProviderFactoryService } from '../../providers/ai-provider-factory.service';
import { ConversationMemoryService } from '../../memory/conversation-memory.service';
import { AgentToolsFactory } from '../tools/core/agent-tools.factory';
import { SystemPromptBuilder } from '../prompt/system-prompt.builder';
import { detectOutputType } from '../prompt/detection/output-detector';
import { isExportFollowUpRequest } from '../outputs/tools/output-tools.factory';
import {
  extractGeneratedDocuments,
  isEmailSendRequest,
} from '../prompt/detection/email-send.utils';
import {
  buildToolContextFromDbRecords,
  buildToolContextFromStepResults,
  messagesIncludeRecentToolContext,
} from '../prompt/context/conversation-tool-context.utils';
import {
  isWidgetFollowUpRequest,
  isWidgetRequest,
  WIDGET_AGENT_GUIDANCE,
  WIDGET_FOLLOW_UP_GUIDANCE,
} from '../prompt/detection/widget-request.utils';
import { AgentProgressEmitterService } from '../progress/agent-progress-emitter.service';
import { ToolDispatcherService } from '../tools/dispatch/tool-dispatcher.service';
import { SandboxCodeService } from '../sandbox/sandbox-code.service';
import { DocumentReaderService } from '../documents/document-reader.service';
import { CapabilitiesToolsService } from '../capabilities/capabilities-tools.service';
import type { AgentToolScope } from '../tools/core/agent-tool-scope.utils';
import {
  buildOrgSharedToolkitConnectionTierMap,
  normalizeToolkitConnectionTierMap,
} from '../capabilities/toolkit-connection-tiers.utils';
import { getResearchModeInstructions } from '../../providers/provider-research-tools';

interface SavedExecutionInput {
  content?: string;
  documentUuids?: string[];
  integrationUuids?: string[];
  toolkitSlugs?: string[];
  toolkitConnectionTiers?: Record<string, string>;
  aiProvider?: AiProviderType | null;
  aiModel?: string | null;
  aiResearchMode?: AiResearchMode | null;
  approvalRequests?: Array<{
    approvalId: string;
    toolName?: string;
    input?: unknown;
  }>;
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
    private readonly toolsFactory: AgentToolsFactory,
    private readonly systemPromptBuilder: SystemPromptBuilder,
    private readonly progressEmitter: AgentProgressEmitterService,
    private readonly toolDispatcher: ToolDispatcherService,
    private readonly sandboxCode: SandboxCodeService,
    private readonly documentReader: DocumentReaderService,
    private readonly capabilities: CapabilitiesToolsService,
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
      toolkitSlugs?: string[];
      toolkitConnectionTiers?: Record<string, string>;
      aiProvider?: AiProviderType | null;
      aiModel?: string | null;
      aiResearchMode?: AiResearchMode | null;
    },
  ): Promise<AgentRunResult> {
    const existingExecution = await this.prisma.agentExecution.findUnique({
      where: { uuid: executionUuid },
    });
    const savedInput = (existingExecution?.input ?? {}) as SavedExecutionInput;

    if (
      existingExecution?.status === AgentExecutionStatus.COMPLETED &&
      existingExecution.output
    ) {
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

    if (existingExecution?.status === AgentExecutionStatus.AWAITING_CONNECTION_TIER) {
      return {
        content: '',
        files: [],
        outputType: 'TEXT',
      };
    }

    await this.prisma.agentExecution.update({
      where: { uuid: executionUuid },
      data: { status: AgentExecutionStatus.RUNNING, started_at: new Date() },
    });

    const progress = this.progressEmitter.createScope(
      organizationUuid,
      conversationId,
      executionUuid,
    );

    try {
      const noAiConnectorMessage =
        await this.systemPromptBuilder.getNoAiConnectorMessage(
          organizationUuid,
        );
      if (noAiConnectorMessage) {
        return this.completeWithDirectResponse(
          organizationUuid,
          conversationId,
          executionUuid,
          noAiConnectorMessage,
        );
      }

      const permissions = await this.loadUserPermissions(
        userUuid,
        organizationUuid,
      );
      const resolved = await this.providerFactory.resolveProvider(
        organizationUuid,
        {
          provider: options?.aiProvider ?? savedInput.aiProvider,
          modelId: options?.aiModel ?? savedInput.aiModel,
        },
      );
      const messages = await this.memory.getMessages(
        organizationUuid,
        conversationId,
      );

      const documentUuids =
        options?.documentUuids ?? savedInput.documentUuids ?? [];
      const preliminaryToolScope = await this.capabilities.resolveAgentToolScope(
        organizationUuid,
        userUuid,
        options?.integrationUuids ?? savedInput.integrationUuids,
        options?.toolkitSlugs ?? savedInput.toolkitSlugs,
      );
      const scopedToolkitSlugs = preliminaryToolScope.toolkitSlugs ?? [];
      const toolScope: AgentToolScope = {
        ...preliminaryToolScope,
        toolkitConnectionTiers:
          scopedToolkitSlugs.length > 0
            ? buildOrgSharedToolkitConnectionTierMap(scopedToolkitSlugs)
            : undefined,
      };
      const attachedDocuments =
        documentUuids.length > 0
          ? await this.documentReader.getAttachedMetadata(documentUuids)
          : [];

      const agentMessages =
        options?.resumeApprovals?.length && savedInput.agentMessages?.length
          ? savedInput.agentMessages
          : this.buildAgentMessages(messages, attachedDocuments);
      const messagesForAgent = this.buildMessagesForAgent(
        agentMessages,
        savedInput,
        options?.resumeApprovals,
      );

      const tools = await this.toolsFactory.buildTools(
        organizationUuid,
        userUuid,
        conversationId,
        executionUuid,
        permissions,
        {
          documentUuids,
          integrationUuids: toolScope.integrationUuids,
          toolkitSlugs: toolScope.toolkitSlugs,
          toolkitConnectionTiers: toolScope.toolkitConnectionTiers,
          userMessage,
          progress,
        },
      );

      const researchMode =
        options?.aiResearchMode ??
        savedInput.aiResearchMode ??
        AiResearchMode.DEFAULT;
      const instructions = await this.buildInstructions(
        organizationUuid,
        userUuid,
        attachedDocuments,
        userMessage,
        messagesForAgent,
        conversationId,
        executionUuid,
        toolScope,
        researchMode,
      );
      const agent = this.providerFactory.createAgent(
        resolved,
        tools,
        instructions,
        { researchMode },
      );

      const result = await agent.generate({
        messages: messagesForAgent,
        onStepFinish: async (step) => {
          const usage = step?.usage;
          if (usage) {
            await this.toolDispatcher.recordStepUsage(
              executionUuid,
              'agent-step',
              usage,
              resolved.modelId,
            );
          }
        },
      });

      const approvalRequests = this.extractApprovalRequests(result);
      if (approvalRequests.length > 0 && !options?.resumeApprovals?.length) {
        const usage =
          await this.toolDispatcher.syncExecutionUsageTotals(executionUuid);

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
              integrationUuids: toolScope.integrationUuids,
              toolkitSlugs: toolScope.toolkitSlugs,
              toolkitConnectionTiers: toolScope.toolkitConnectionTiers,
              aiProvider: savedInput.aiProvider ?? options?.aiProvider,
              aiModel: savedInput.aiModel ?? options?.aiModel,
              aiResearchMode: researchMode,
            } as object,
            tokens_used: usage.tokensUsed,
            cost_usd: usage.costUsd,
          },
        });

        progress.emitApprovalRequired({
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

      const toolResults = (result.steps ?? []).flatMap(
        (step: any) => step.toolResults ?? [],
      );
      const generatedDocuments = extractGeneratedDocuments(toolResults);
      const toolContext = buildToolContextFromStepResults(toolResults);
      const content = this.sanitizeAssistantContent(
        result.text ?? '',
        toolResults,
      );
      const detection = detectOutputType(userMessage, content, toolResults);
      const usage =
        await this.toolDispatcher.syncExecutionUsageTotals(executionUuid);

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
            ...(toolContext ? { toolContext } : {}),
          },
        },
      ]);
      this.memory.scheduleHydrateCacheFromDb(organizationUuid, conversationId);

      progress.emitComplete({
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
      const message =
        error instanceof Error ? error.message : 'Agent execution failed';
      this.logger.error(
        message,
        error instanceof Error ? error.stack : undefined,
      );

      const usage = await this.toolDispatcher
        .syncExecutionUsageTotals(executionUuid)
        .catch(() => ({
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

      progress.emitError(message);

      throw error;
    } finally {
      try {
        await this.sandboxCode.closeSession(executionUuid);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to close sandbox session';
        this.logger.warn(
          `Sandbox cleanup failed for ${executionUuid}: ${message}`,
        );
      }
    }
  }

  private async completeWithDirectResponse(
    organizationUuid: string,
    conversationId: string,
    executionUuid: string,
    content: string,
  ): Promise<AgentRunResult> {
    const progress = this.progressEmitter.createScope(
      organizationUuid,
      conversationId,
      executionUuid,
    );
    const usage = await this.toolDispatcher
      .syncExecutionUsageTotals(executionUuid)
      .catch(() => ({
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

    progress.emitComplete({
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
    attachedDocuments: Awaited<
      ReturnType<DocumentReaderService['getAttachedMetadata']>
    >,
    userMessage: string,
    messagesForAgent: ModelMessage[],
    conversationId: string,
    executionUuid: string,
    toolScope: AgentToolScope,
    researchMode: AiResearchMode = AiResearchMode.DEFAULT,
  ) {
    const [instructions, capabilitiesPrompt] = await Promise.all([
      this.systemPromptBuilder.build(
        organizationUuid,
        userUuid,
        attachedDocuments,
      ),
      this.capabilities.buildAgentCapabilitiesPrompt({
        organizationUuid,
        userUuid,
        integrationUuids: toolScope.integrationUuids,
        toolkitSlugs: toolScope.toolkitSlugs,
        toolkitConnectionTiers: normalizeToolkitConnectionTierMap(
          toolScope.toolkitConnectionTiers,
        ),
      }),
    ]);

    const guidance: string[] = [capabilitiesPrompt];
    const researchInstructions = getResearchModeInstructions(researchMode);
    if (researchInstructions) {
      guidance.push(researchInstructions);
    }

    if (!messagesIncludeRecentToolContext(messagesForAgent)) {
      const recentToolContext = await this.loadRecentConversationToolContext(
        conversationId,
        executionUuid,
      );

      if (recentToolContext) {
        guidance.push(
          'Earlier tool results from this conversation are included below. Use them for follow-up requests such as email, export, or summarization without re-querying unless the user asks for fresh data.',
          recentToolContext,
        );
      }
    }

    if (
      isExportFollowUpRequest(userMessage) &&
      messagesForAgent.some((m) => m.role === 'assistant')
    ) {
      guidance.push(
        'The latest user message is a follow-up export request.',
        'Use the data already present in this conversation to build the requested file now.',
        'If the prior assistant reply only summarized results, re-run the same organization or database tools instead of asking the user to provide the data again.',
      );
    }

    if (
      isEmailSendRequest(userMessage) &&
      messagesForAgent.some((m) => m.role === 'assistant')
    ) {
      guidance.push(
        'The latest user message asks to send content by email.',
        'Use the data already present in this conversation — including any "Tool results from this turn" sections in earlier assistant messages — to compose the email body or attachments.',
        'If the prior assistant reply only summarized results, use the stored tool results or re-run the same organization, database, or integration tools instead of asking the user to provide the data again.',
        'Use generated file URLs or generatedDocuments metadata from earlier output tool results when the selected email tool supports attachments or links.',
        'Use only the email channels listed in "Available tools for this message". If none are listed, tell the user to connect an email app in Integrations instead of claiming a specific provider is blocked.',
        'Do not claim an email was sent until the email tool completes successfully.',
      );
    }

    if (isWidgetRequest(userMessage)) {
      guidance.push(...WIDGET_AGENT_GUIDANCE);

      if (
        isWidgetFollowUpRequest(userMessage) &&
        messagesForAgent.some((message) => message.role === 'assistant')
      ) {
        guidance.push(...WIDGET_FOLLOW_UP_GUIDANCE);
      }
    }

    if (guidance.length === 1) {
      return [instructions, capabilitiesPrompt].join('\n');
    }

    return [instructions, ...guidance].join('\n');
  }

  private buildAgentMessages(
    messages: ModelMessage[],
    attachedDocuments: Awaited<
      ReturnType<DocumentReaderService['getAttachedMetadata']>
    >,
  ): ModelMessage[] {
    if (attachedDocuments.length === 0) {
      return messages;
    }

    const documentContext =
      this.documentReader.formatMetadataForPrompt(attachedDocuments);
    return [
      ...messages,
      {
        role: 'user',
        content: `The user attached files to this message. Use document__list and the matching document__read_* tool to load their content before answering.\n\n${documentContext}`,
      },
    ];
  }

  private async loadUserPermissions(
    userUuid: string,
    organizationUuid: string,
  ) {
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

    return (
      membership?.role.permissions.map((entry) => entry.permission.key) ?? []
    );
  }

  private extractApprovalRequests(result: any) {
    const requests: Array<{
      toolName?: string;
      input?: unknown;
      approvalId?: string;
    }> = [];
    const seenApprovalIds = new Set<string>();

    const collect = (parts: unknown[]) => {
      for (const part of parts) {
        if (!part || typeof part !== 'object') {
          continue;
        }

        const record = part as Record<string, unknown>;
        if (
          record.type !== 'tool-approval-request' ||
          typeof record.approvalId !== 'string'
        ) {
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
          toolName:
            typeof toolCall?.toolName === 'string'
              ? toolCall.toolName
              : undefined,
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

  private sanitizeAssistantContent(
    content: string,
    toolResults: unknown[],
  ): string {
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
      sanitized = sanitized.replace(
        new RegExp(`!\\[[^\\]]*\\]\\(${escaped}\\)`, 'g'),
        '',
      );
      sanitized = sanitized.replace(new RegExp(escaped, 'g'), '');
    }

    return sanitized.replace(/\n{3,}/g, '\n\n').trim();
  }

  private async loadRecentConversationToolContext(
    conversationId: string,
    currentExecutionUuid: string,
  ): Promise<string | null> {
    const executions = await this.prisma.agentExecution.findMany({
      where: {
        conversation_uuid: conversationId,
        status: AgentExecutionStatus.COMPLETED,
        uuid: { not: currentExecutionUuid },
      },
      orderBy: { completed_at: 'desc' },
      take: 3,
      select: {
        tool_calls: {
          where: { status: ToolCallStatus.SUCCESS },
          orderBy: { created_at: 'asc' },
          select: {
            tool_name: true,
            output: true,
            status: true,
          },
        },
      },
    });

    const records = executions
      .flatMap((execution) => execution.tool_calls)
      .reverse();

    return buildToolContextFromDbRecords(records);
  }
}
