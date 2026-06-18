import { useCallback, useEffect, useRef, useState } from 'react';
import {
  websocketJoinRoom,
  websocketLeaveRoom,
  websocketSubscribe,
} from '@/features/websocket/services/websocket.service';
import { getExecution } from '../services/conversations.service';
import { AgentExecutionStatuses } from '../interfaces/conversation.interfaces';
import type {
  AgentCompleteEvent,
  ExecutionApprovalRequest,
  ToolCallProgress,
} from '../interfaces/conversation.interfaces';

const AGENT_EVENTS = {
  TOOL_START: 'tool:start',
  TOOL_COMPLETE: 'tool:complete',
  AGENT_COMPLETE: 'agent:complete',
  AGENT_ERROR: 'agent:error',
  APPROVAL_REQUIRED: 'agent:approval_required',
} as const;

const EXECUTION_POLL_INTERVAL_MS = 2000;

export function useExecution(organizationUuid?: string, executionId?: string | null) {
  const [toolCalls, setToolCalls] = useState<ToolCallProgress[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [assistantContent, setAssistantContent] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvalRequest, setApprovalRequest] = useState<ExecutionApprovalRequest | null>(null);
  const completedRef = useRef(false);

  const markComplete = useCallback((content: string) => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;
    setAssistantContent(content);
    setIsRunning(false);
    setIsComplete(true);
    setApprovalRequest(null);
  }, []);

  const markError = useCallback((message: string) => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;
    setError(message);
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    completedRef.current = false;
    setToolCalls([]);
    setIsRunning(false);
    setAssistantContent(null);
    setIsComplete(false);
    setError(null);
    setApprovalRequest(null);
  }, []);

  useEffect(() => {
    if (!organizationUuid || !executionId) {
      reset();
      return;
    }

    reset();
    setIsRunning(true);

    const room = `org:${organizationUuid}:execution:${executionId}`;
    websocketJoinRoom(room);

    const subscriptions = [
      websocketSubscribe<{ toolName: string; input?: unknown }>(AGENT_EVENTS.TOOL_START, (payload) => {
        setApprovalRequest(null);
        setIsRunning(true);
        setToolCalls((current) => [
          ...current,
          { toolName: payload.toolName, input: payload.input, status: 'running' },
        ]);
      }),
      websocketSubscribe<{ toolName: string; result?: unknown; durationMs?: number; success?: boolean }>(
        AGENT_EVENTS.TOOL_COMPLETE,
        (payload) => {
          setToolCalls((current) =>
            current.map((item) =>
              item.toolName === payload.toolName && item.status === 'running'
                ? {
                    ...item,
                    result: payload.result,
                    durationMs: payload.durationMs,
                    success: payload.success,
                    status: payload.success === false ? 'failed' : 'completed',
                  }
                : item,
            ),
          );
        },
      ),
      websocketSubscribe<AgentCompleteEvent>(AGENT_EVENTS.AGENT_COMPLETE, (payload) => {
        markComplete(payload.content ?? '');
      }),
      websocketSubscribe<{ error: string }>(AGENT_EVENTS.AGENT_ERROR, (payload) => {
        markError(payload.error);
      }),
      websocketSubscribe<ExecutionApprovalRequest>(AGENT_EVENTS.APPROVAL_REQUIRED, (payload) => {
        setApprovalRequest(payload);
        setIsRunning(false);
      }),
    ];

    const pollInterval = window.setInterval(() => {
      if (completedRef.current) {
        return;
      }

      void getExecution(organizationUuid, executionId)
        .then((execution) => {
          if (completedRef.current) {
            return;
          }

          if (execution.status === AgentExecutionStatuses.COMPLETED) {
            const output = execution.output as { content?: string } | null | undefined;
            markComplete(output?.content ?? '');
            return;
          }

          if (execution.status === AgentExecutionStatuses.FAILED) {
            markError(execution.error ?? 'Agent execution failed');
            return;
          }

          if (execution.status === AgentExecutionStatuses.AWAITING_APPROVAL) {
            setIsRunning(false);
          }
        })
        .catch(() => {});
    }, EXECUTION_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(pollInterval);
      subscriptions.forEach((subscription) => subscription.unsubscribe());
      websocketLeaveRoom(room);
    };
  }, [organizationUuid, executionId, reset, markComplete, markError]);

  return {
    toolCalls,
    isRunning,
    assistantContent,
    isComplete,
    error,
    approvalRequest,
    reset,
  };
}
