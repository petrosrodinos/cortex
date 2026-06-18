export const MessageRoles = {
  USER: 'USER',
  ASSISTANT: 'ASSISTANT',
  SYSTEM: 'SYSTEM',
  TOOL: 'TOOL',
} as const;

export type MessageRole = (typeof MessageRoles)[keyof typeof MessageRoles];

export const AgentExecutionStatuses = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  AWAITING_APPROVAL: 'AWAITING_APPROVAL',
} as const;

export type AgentExecutionStatus = (typeof AgentExecutionStatuses)[keyof typeof AgentExecutionStatuses];

export interface Conversation {
  uuid: string;
  org_uuid: string;
  user_uuid: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface Message {
  uuid: string;
  conversation_uuid: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface SendMessageResponse {
  executionId: string;
  messageId: string;
}

export interface AgentExecution {
  uuid: string;
  status: AgentExecutionStatus;
  error?: string | null;
  output?: {
    content?: string;
    files?: string[];
    outputType?: string;
  } | null;
}

export interface ToolCallProgress {
  toolName: string;
  input?: unknown;
  result?: unknown;
  durationMs?: number;
  success?: boolean;
  status: 'running' | 'completed' | 'failed';
}

export interface ExecutionApprovalRequest {
  toolName?: string;
  input?: unknown;
  executionId: string;
  approvalRequests?: unknown[];
}

export interface AgentCompleteEvent {
  content: string;
  files: string[];
  executionId: string;
  outputType?: string;
  tokensUsed?: number;
  costUsd?: number;
}
