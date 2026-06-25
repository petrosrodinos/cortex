import { randomUUID } from 'crypto';
import { WsEventsService } from '@/core/websockets/ws-events.service';
import { AGENT_PROGRESS_EVENTS } from './agent-progress.constants';

export interface AgentToolCompletePayload {
  toolName: string;
  result?: unknown;
  durationMs: number;
  success: boolean;
  cached?: boolean;
}

export interface AgentCompletePayload {
  content: string;
  files: string[];
  executionId: string;
  outputType?: string;
  tokensUsed?: number;
  costUsd?: number;
}

export interface AgentApprovalRequiredPayload {
  toolName?: string;
  input?: unknown;
  executionId: string;
  approvalRequests?: unknown[];
}

export interface AgentChoiceRequiredPayload {
  executionId: string;
  choiceRequest: {
    prompt: string;
    description?: string;
    selection_mode: 'single' | 'multiple';
    options: Array<{
      id: string;
      label: string;
      description?: string;
    }>;
  };
}

export class AgentProgressScope {
  constructor(
    private readonly wsEvents: WsEventsService,
    private readonly organizationUuid: string,
    private readonly conversationUuid: string,
    private readonly executionUuid: string,
  ) {}

  toolStart(toolName: string, input?: unknown): string {
    const callId = randomUUID();
    this.wsEvents.emitToConversation(
      this.organizationUuid,
      this.conversationUuid,
      AGENT_PROGRESS_EVENTS.TOOL_START,
      { callId, toolName, input, executionId: this.executionUuid },
    );
    return callId;
  }

  toolComplete(callId: string, payload: AgentToolCompletePayload) {
    this.wsEvents.emitToConversation(
      this.organizationUuid,
      this.conversationUuid,
      AGENT_PROGRESS_EVENTS.TOOL_COMPLETE,
      { callId, executionId: this.executionUuid, ...payload },
    );
  }

  async trackTool<T>(toolName: string, input: unknown, handler: () => Promise<T>): Promise<T> {
    const callId = this.toolStart(toolName, input);
    const started = Date.now();

    try {
      const result = await handler();
      this.toolComplete(callId, {
        toolName,
        result,
        durationMs: Date.now() - started,
        success: true,
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tool execution failed';
      this.toolComplete(callId, {
        toolName,
        result: { error: message },
        durationMs: Date.now() - started,
        success: false,
      });
      throw error;
    }
  }

  emitComplete(payload: AgentCompletePayload) {
    this.wsEvents.emitToConversation(
      this.organizationUuid,
      this.conversationUuid,
      AGENT_PROGRESS_EVENTS.COMPLETE,
      payload,
    );
  }

  emitError(error: string) {
    this.wsEvents.emitToConversation(
      this.organizationUuid,
      this.conversationUuid,
      AGENT_PROGRESS_EVENTS.ERROR,
      { error, executionId: this.executionUuid },
    );
  }

  emitApprovalRequired(payload: AgentApprovalRequiredPayload) {
    this.wsEvents.emitToConversation(
      this.organizationUuid,
      this.conversationUuid,
      AGENT_PROGRESS_EVENTS.APPROVAL_REQUIRED,
      payload,
    );
  }

  emitChoiceRequired(payload: AgentChoiceRequiredPayload) {
    this.wsEvents.emitToConversation(
      this.organizationUuid,
      this.conversationUuid,
      AGENT_PROGRESS_EVENTS.CHOICE_REQUIRED,
      payload,
    );
  }
}
