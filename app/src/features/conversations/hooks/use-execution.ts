import { useCallback, useEffect, useState } from 'react';
import {
  websocketJoinRoom,
  websocketLeaveRoom,
  websocketSubscribe,
} from '@/features/websocket/services/websocket.service';
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

export function useExecution(organizationUuid?: string, executionId?: string | null) {
  const [toolCalls, setToolCalls] = useState<ToolCallProgress[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [assistantContent, setAssistantContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [approvalRequest, setApprovalRequest] = useState<ExecutionApprovalRequest | null>(null);

  const reset = useCallback(() => {
    setToolCalls([]);
    setIsRunning(false);
    setAssistantContent(null);
    setError(null);
    setApprovalRequest(null);
  }, []);

  useEffect(() => {
    if (!organizationUuid || !executionId) {
      return;
    }

    reset();
    setIsRunning(true);

    const room = `org:${organizationUuid}:execution:${executionId}`;
    websocketJoinRoom(room);

    const subscriptions = [
      websocketSubscribe<{ toolName: string; input?: unknown }>(AGENT_EVENTS.TOOL_START, (payload) => {
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
        setAssistantContent(payload.content);
        setIsRunning(false);
        setApprovalRequest(null);
      }),
      websocketSubscribe<{ error: string }>(AGENT_EVENTS.AGENT_ERROR, (payload) => {
        setError(payload.error);
        setIsRunning(false);
      }),
      websocketSubscribe<ExecutionApprovalRequest>(AGENT_EVENTS.APPROVAL_REQUIRED, (payload) => {
        setApprovalRequest(payload);
        setIsRunning(false);
      }),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
      websocketLeaveRoom(room);
    };
  }, [organizationUuid, executionId, reset]);

  return {
    toolCalls,
    isRunning,
    assistantContent,
    error,
    approvalRequest,
    reset,
  };
}
