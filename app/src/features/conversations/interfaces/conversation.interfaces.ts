import type { ComposioConnectionTier } from '@/features/integration-apps/constants/composio-connection-tier';

export const ConversationKinds = {
  STANDARD: 'STANDARD',
  SCHEDULED_AGENT: 'SCHEDULED_AGENT',
} as const;

export type ConversationKind = (typeof ConversationKinds)[keyof typeof ConversationKinds];

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
  AWAITING_CONNECTION_TIER: 'AWAITING_CONNECTION_TIER',
  AWAITING_USER_CHOICE: 'AWAITING_USER_CHOICE',
} as const;

export type AgentExecutionStatus = (typeof AgentExecutionStatuses)[keyof typeof AgentExecutionStatuses];

export interface Conversation {
  uuid: string;
  org_uuid: string;
  user_uuid: string;
  title: string | null;
  kind?: ConversationKind;
  ai_provider?: string | null;
  ai_model?: string | null;
  ai_research_mode?: string | null;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface UpdateConversationPayload {
  title?: string;
  ai_provider?: string;
  ai_model?: string;
  ai_research_mode?: string;
}

export interface MessageAttachment {
  uuid: string;
  filename: string;
  url?: string;
  mimetype?: string;
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

export interface ConversationAgentIntegration {
  uuid: string;
  name: string;
  provider: string;
  actions: string[];
}

export interface ConversationAgentConnectedAccount {
  connection_tier: ComposioConnectionTier;
  account_label?: string | null;
}

export interface ConversationAgentToolkit {
  uuid: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  tool_count: number;
  is_connected: boolean;
  connection_tiers: ComposioConnectionTier[];
  connected_accounts: ConversationAgentConnectedAccount[];
}

export interface ConversationAgentTools {
  integrations: ConversationAgentIntegration[];
  toolkits: ConversationAgentToolkit[];
}

export interface AgentExecution {
  uuid: string;
  status: AgentExecutionStatus;
  error?: string | null;
  tool_calls?: ExecutionToolCall[];
  input?: {
    content?: string;
    approvalRequests?: Array<{
      approvalId?: string;
      toolName?: string;
      input?: unknown;
    }>;
    connectionTierChoices?: ExecutionConnectionTierChoice[];
    choiceRequest?: ExecutionUserChoiceRequestPayload;
    choiceApprovalRequests?: Array<{ approvalId?: string }>;
    agentMessages?: unknown;
    responseMessages?: unknown;
    toolkitConnectionTiers?: Record<string, ComposioConnectionTier>;
  } | null;
  output?: {
    content?: string;
    files?: string[];
    outputType?: string;
  } | null;
}

export interface ExecutionToolCall {
  uuid: string;
  tool_name: string;
  status: 'SUCCESS' | 'FAILED';
  duration_ms: number;
}

export interface ToolCallProgress {
  callId: string;
  toolName: string;
  input?: unknown;
  result?: unknown;
  durationMs?: number;
  success?: boolean;
  cached?: boolean;
  status: 'running' | 'completed' | 'failed';
}

export interface AgentProgressState {
  toolCalls: ToolCallProgress[];
  assistantContent: string | null;
  isComplete: boolean;
  isRunning: boolean;
  error: string | null;
  approvalRequest: ExecutionApprovalRequest | null;
  connectionTierRequest: ExecutionConnectionTierRequest | null;
  userChoiceRequest: ExecutionUserChoiceRequest | null;
}

export interface ExecutionApprovalRequest {
  toolName?: string;
  input?: unknown;
  executionId: string;
  approvalRequests?: unknown[];
}

export interface ExecutionConnectionTierChoice {
  slug: string;
  name: string;
  availableTiers: ComposioConnectionTier[];
}

export interface ExecutionConnectionTierRequest {
  executionId: string;
  connectionTierChoices: ExecutionConnectionTierChoice[];
}

export type UserChoiceSelectionMode = 'single' | 'multiple';

export interface ExecutionUserChoiceOption {
  id: string;
  label: string;
  description?: string;
}

export interface ExecutionUserChoiceRequestPayload {
  prompt: string;
  description?: string;
  selection_mode: UserChoiceSelectionMode;
  options: ExecutionUserChoiceOption[];
}

export interface ExecutionUserChoiceRequest extends ExecutionUserChoiceRequestPayload {
  executionId: string;
}

export interface AgentCompleteEvent {
  content: string;
  files: string[];
  executionId: string;
  outputType?: string;
  tokensUsed?: number;
  costUsd?: number;
}
