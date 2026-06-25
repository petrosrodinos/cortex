import type {
  AgentProgressState,
  ExecutionApprovalRequest,
  ExecutionConnectionTierRequest,
  ExecutionUserChoiceRequest,
  ToolCallProgress,
} from '../interfaces/conversation.interfaces';

export const initialAgentProgressState: AgentProgressState = {
  toolCalls: [],
  assistantContent: null,
  isComplete: false,
  isRunning: false,
  error: null,
  approvalRequest: null,
  connectionTierRequest: null,
  userChoiceRequest: null,
};

export type AgentProgressAction =
  | { type: 'reset' }
  | { type: 'running' }
  | { type: 'tool_start'; callId: string; toolName: string; input?: unknown }
  | {
      type: 'tool_complete';
      callId: string;
      toolName: string;
      result?: unknown;
      durationMs?: number;
      success?: boolean;
      cached?: boolean;
    }
  | { type: 'complete'; content: string }
  | { type: 'error'; error: string }
  | { type: 'approval_required'; request: ExecutionApprovalRequest }
  | { type: 'connection_tier_required'; request: ExecutionConnectionTierRequest }
  | { type: 'choice_required'; request: ExecutionUserChoiceRequest }
  | { type: 'sync_tool_calls'; toolCalls: ToolCallProgress[] };

function upsertToolCall(toolCalls: ToolCallProgress[], next: ToolCallProgress): ToolCallProgress[] {
  const index = toolCalls.findIndex((item) => item.callId === next.callId);
  if (index === -1) {
    return [...toolCalls, next];
  }

  const updated = [...toolCalls];
  updated[index] = { ...updated[index], ...next };
  return updated;
}

export function agentProgressReducer(
  state: AgentProgressState,
  action: AgentProgressAction,
): AgentProgressState {
  switch (action.type) {
    case 'reset':
      return initialAgentProgressState;

    case 'running':
      return {
        ...initialAgentProgressState,
        isRunning: true,
      };

    case 'tool_start': {
      const toolCall: ToolCallProgress = {
        callId: action.callId,
        toolName: action.toolName,
        input: action.input,
        status: 'running',
      };

      return {
        ...state,
        isRunning: true,
        toolCalls: upsertToolCall(state.toolCalls, toolCall),
      };
    }

    case 'tool_complete': {
      const status = action.success === false ? 'failed' : 'completed';
      const toolCall: ToolCallProgress = {
        callId: action.callId,
        toolName: action.toolName,
        result: action.result,
        durationMs: action.durationMs,
        success: action.success,
        cached: action.cached,
        status,
      };

      return {
        ...state,
        toolCalls: upsertToolCall(state.toolCalls, toolCall),
      };
    }

    case 'complete':
      return {
        ...state,
        assistantContent: action.content,
        isComplete: true,
        isRunning: false,
        approvalRequest: null,
        connectionTierRequest: null,
        userChoiceRequest: null,
      };

    case 'error':
      return {
        ...state,
        error: action.error,
        isRunning: false,
        approvalRequest: null,
        connectionTierRequest: null,
        userChoiceRequest: null,
      };

    case 'approval_required':
      return {
        ...state,
        isRunning: false,
        approvalRequest: action.request,
        connectionTierRequest: null,
        userChoiceRequest: null,
      };

    case 'connection_tier_required':
      return {
        ...state,
        isRunning: false,
        connectionTierRequest: action.request,
        approvalRequest: null,
        userChoiceRequest: null,
      };

    case 'choice_required':
      return {
        ...state,
        isRunning: false,
        userChoiceRequest: action.request,
        approvalRequest: null,
        connectionTierRequest: null,
      };

    case 'sync_tool_calls': {
      const syncedIds = new Set(action.toolCalls.map((tool) => tool.callId));
      const running = state.toolCalls.filter(
        (tool) => tool.status === 'running' && !syncedIds.has(tool.callId),
      );

      return {
        ...state,
        toolCalls: [...action.toolCalls, ...running],
      };
    }

    default:
      return state;
  }
}
