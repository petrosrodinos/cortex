export interface UsageQuery {
  date_from?: string;
  date_to?: string;
  member_uuid?: string;
  page?: number;
  limit?: number;
}

export interface UsageDailyPoint {
  date: string;
  tokens: number;
  cost_usd: number;
  count: number;
}

export interface UsageSummary {
  total_tokens: number;
  total_cost_usd: number;
  total_executions: number;
  daily: UsageDailyPoint[];
}

export interface UsageToolCallRecord {
  uuid: string;
  tool_name: string;
  tokens_used: number;
  cost_usd: number;
  status: string;
  duration_ms: number;
  created_at: string;
}

export interface UsageExecutionRecord {
  uuid: string;
  status: string;
  tokens_used: number;
  cost_usd: number;
  created_at: string;
  completed_at?: string | null;
  conversation_uuid: string;
  conversation_title?: string | null;
  user_uuid: string;
  member_uuid?: string | null;
  user_email: string;
  tool_calls_count: number;
  tool_calls: UsageToolCallRecord[];
}

export interface UsageRecordsResponse {
  data: UsageExecutionRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
