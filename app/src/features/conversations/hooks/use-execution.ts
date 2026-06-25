import { useCallback, useEffect, useReducer, useRef } from 'react';
import { WEBSOCKET_EVENTS } from '@/features/websocket/interfaces/websocket-events.constants';
import {
  websocketJoinRoom,
  websocketLeaveRoom,
  websocketSubscribe,
} from '@/features/websocket/services/websocket.service';
import { useWebsocketStore } from '@/stores/websocket.store';
import { getExecution } from '../services/conversations.service';
import {
  AgentExecutionStatuses,
  type AgentCompleteEvent,
  type AgentExecution,
  type ExecutionApprovalRequest,
  type ExecutionConnectionTierRequest,
  type ExecutionUserChoiceRequest,
  type ExecutionToolCall,
} from '../interfaces/conversation.interfaces';
import {
  agentProgressReducer,
  initialAgentProgressState,
} from '../utils/agent-progress.reducer';
import { isDisplayableToolName } from '../utils/agent-progress-labels';

const EXECUTION_POLL_INTERVAL_MS = 1000;

function conversationRoom(organizationUuid: string, conversationUuid: string) {
  return `org:${organizationUuid}:conversation:${conversationUuid}`;
}

function parseApprovalRequest(execution: AgentExecution): ExecutionApprovalRequest | null {
  if (execution.status !== AgentExecutionStatuses.AWAITING_APPROVAL) {
    return null;
  }

  const approvalRequests = execution.input?.approvalRequests ?? [];
  const first = approvalRequests[0];

  return {
    executionId: execution.uuid,
    approvalRequests,
    toolName: first?.toolName,
    input: first?.input,
  };
}

function parseConnectionTierRequest(
  execution: AgentExecution,
): ExecutionConnectionTierRequest | null {
  if (execution.status !== AgentExecutionStatuses.AWAITING_CONNECTION_TIER) {
    return null;
  }

  const connectionTierChoices = execution.input?.connectionTierChoices ?? [];
  if (connectionTierChoices.length === 0) {
    return null;
  }

  return {
    executionId: execution.uuid,
    connectionTierChoices,
  };
}

function parseUserChoiceRequest(execution: AgentExecution): ExecutionUserChoiceRequest | null {
  const choiceRequest = execution.input?.choiceRequest;
  if (!choiceRequest?.options?.length) {
    return null;
  }

  const hasChoiceCheckpoint =
    !!execution.input?.choiceApprovalRequests?.length &&
    !!execution.input?.agentMessages &&
    !!execution.input?.responseMessages;

  const isAwaitingChoice =
    execution.status === AgentExecutionStatuses.AWAITING_USER_CHOICE ||
    (execution.status === AgentExecutionStatuses.RUNNING && hasChoiceCheckpoint);

  if (!isAwaitingChoice) {
    return null;
  }

  return {
    executionId: execution.uuid,
    prompt: choiceRequest.prompt,
    description: choiceRequest.description,
    selection_mode: choiceRequest.selection_mode,
    options: choiceRequest.options,
  };
}

function mapExecutionToolCalls(toolCalls: ExecutionToolCall[]) {
  return toolCalls
    .filter((toolCall) => isDisplayableToolName(toolCall.tool_name))
    .map((toolCall) => ({
      callId: toolCall.uuid,
      toolName: toolCall.tool_name,
      status: toolCall.status === 'FAILED' ? ('failed' as const) : ('completed' as const),
      durationMs: toolCall.duration_ms,
      success: toolCall.status === 'SUCCESS',
    }));
}

export function useExecution(
  organizationUuid?: string,
  conversationUuid?: string,
  executionId?: string | null,
) {
  const { is_connected } = useWebsocketStore();
  const [state, dispatch] = useReducer(agentProgressReducer, initialAgentProgressState);
  const completedRef = useRef(false);
  const executionIdRef = useRef<string | null>(null);

  const reset = useCallback(() => {
    completedRef.current = false;
    executionIdRef.current = null;
    dispatch({ type: 'reset' });
  }, []);

  useEffect(() => {
    executionIdRef.current = executionId ?? null;
  }, [executionId]);

  useEffect(() => {
    if (!organizationUuid || !conversationUuid || !is_connected) {
      return;
    }

    const room = conversationRoom(organizationUuid, conversationUuid);
    websocketJoinRoom(room);

    const matchesExecution = (payloadExecutionId?: string) => {
      const activeExecutionId = executionIdRef.current;
      return activeExecutionId != null && payloadExecutionId === activeExecutionId;
    };

    const subscriptions = [
      websocketSubscribe<{ callId?: string; toolName?: string; input?: unknown; executionId?: string }>(
        WEBSOCKET_EVENTS.AGENT.TOOL_START,
        (payload) => {
          if (!matchesExecution(payload.executionId) || !payload.callId || !payload.toolName) {
            return;
          }

          if (!isDisplayableToolName(payload.toolName)) {
            return;
          }

          dispatch({
            type: 'tool_start',
            callId: payload.callId,
            toolName: payload.toolName,
            input: payload.input,
          });
        },
      ),
      websocketSubscribe<{
        callId?: string;
        toolName?: string;
        result?: unknown;
        durationMs?: number;
        success?: boolean;
        cached?: boolean;
        executionId?: string;
      }>(WEBSOCKET_EVENTS.AGENT.TOOL_COMPLETE, (payload) => {
        if (!matchesExecution(payload.executionId) || !payload.callId || !payload.toolName) {
          return;
        }

        if (!isDisplayableToolName(payload.toolName)) {
          return;
        }

        dispatch({
          type: 'tool_complete',
          callId: payload.callId,
          toolName: payload.toolName,
          result: payload.result,
          durationMs: payload.durationMs,
          success: payload.success,
          cached: payload.cached,
        });
      }),
      websocketSubscribe<AgentCompleteEvent>(WEBSOCKET_EVENTS.AGENT.COMPLETE, (payload) => {
        if (!matchesExecution(payload.executionId) || completedRef.current) {
          return;
        }

        completedRef.current = true;
        dispatch({ type: 'complete', content: payload.content ?? '' });
      }),
      websocketSubscribe<{ error: string; executionId?: string }>(WEBSOCKET_EVENTS.AGENT.ERROR, (payload) => {
        if (!matchesExecution(payload.executionId) || completedRef.current) {
          return;
        }

        completedRef.current = true;
        dispatch({ type: 'error', error: payload.error });
      }),
      websocketSubscribe<ExecutionApprovalRequest & { executionId?: string }>(
        WEBSOCKET_EVENTS.AGENT.APPROVAL_REQUIRED,
        (payload) => {
          const payloadExecutionId = payload.executionId ?? executionIdRef.current ?? undefined;
          if (!matchesExecution(payloadExecutionId)) {
            return;
          }

          dispatch({
            type: 'approval_required',
            request: {
              ...payload,
              executionId: payloadExecutionId ?? executionIdRef.current ?? '',
            },
          });
        },
      ),
      websocketSubscribe<{
        executionId?: string;
        choiceRequest?: ExecutionUserChoiceRequest;
      }>(WEBSOCKET_EVENTS.AGENT.CHOICE_REQUIRED, (payload) => {
        const payloadExecutionId = payload.executionId ?? executionIdRef.current ?? undefined;
        if (!matchesExecution(payloadExecutionId) || !payload.choiceRequest) {
          return;
        }

        dispatch({
          type: 'choice_required',
          request: {
            executionId: payloadExecutionId ?? executionIdRef.current ?? '',
            ...payload.choiceRequest,
          },
        });
      }),
    ];

    return () => {
      websocketLeaveRoom(room);
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [organizationUuid, conversationUuid, is_connected]);

  useEffect(() => {
    if (!organizationUuid || !executionId) {
      completedRef.current = false;
      dispatch({ type: 'reset' });
      return;
    }

    completedRef.current = false;
    dispatch({ type: 'running' });

    const pollExecution = () => {
      if (completedRef.current || executionIdRef.current !== executionId) {
        return;
      }

      void getExecution(organizationUuid, executionId)
        .then((execution) => {
          if (completedRef.current || executionIdRef.current !== executionId) {
            return;
          }

          if (execution.tool_calls?.length) {
            dispatch({
              type: 'sync_tool_calls',
              toolCalls: mapExecutionToolCalls(execution.tool_calls),
            });
          }

          if (execution.status === AgentExecutionStatuses.COMPLETED) {
            const output = execution.output as { content?: string } | null | undefined;
            completedRef.current = true;
            dispatch({ type: 'complete', content: output?.content ?? '' });
            return;
          }

          if (execution.status === AgentExecutionStatuses.FAILED) {
            completedRef.current = true;
            dispatch({ type: 'error', error: execution.error ?? 'Agent execution failed' });
            return;
          }

          if (execution.status === AgentExecutionStatuses.AWAITING_APPROVAL) {
            const request = parseApprovalRequest(execution);
            if (request) {
              dispatch({ type: 'approval_required', request });
            }
            return;
          }

          if (execution.status === AgentExecutionStatuses.AWAITING_CONNECTION_TIER) {
            const request = parseConnectionTierRequest(execution);
            if (request) {
              dispatch({ type: 'connection_tier_required', request });
            }
            return;
          }

          const choiceRequest = parseUserChoiceRequest(execution);
          if (choiceRequest) {
            dispatch({ type: 'choice_required', request: choiceRequest });
          }
        })
        .catch(() => {});
    };

    pollExecution();
    const pollInterval = window.setInterval(pollExecution, EXECUTION_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(pollInterval);
    };
  }, [organizationUuid, executionId]);

  return {
    toolCalls: state.toolCalls,
    isRunning: state.isRunning,
    assistantContent: state.assistantContent,
    isComplete: state.isComplete,
    error: state.error,
    approvalRequest: state.approvalRequest,
    connectionTierRequest: state.connectionTierRequest,
    userChoiceRequest: state.userChoiceRequest,
    reset,
  };
}
