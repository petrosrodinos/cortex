export type ComposioConnectionTier = 'ORG_SHARED' | 'USER_PERSONAL';
export type ComposioAccountStatus = 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'INACTIVE';

export interface ComposioConnectedAccountSummary {
  id: string;
  composio_account_id: string;
  label?: string | null;
  status: ComposioAccountStatus;
  user_uuid?: string | null;
}

export interface ComposioToolkit {
  uuid: string;
  slug: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  categories: string[];
  connection_tier: ComposioConnectionTier;
  is_connected: boolean;
  connected_accounts: ComposioConnectedAccountSummary[];
  is_org_enabled: boolean;
  tool_count: number;
}

export interface ComposioTool {
  uuid: string;
  slug: string;
  name: string;
  description?: string | null;
  toolkit_slug?: string;
  enabled: boolean;
  requires_approval: boolean;
  required_permission_key?: string | null;
}

export interface ComposioToolkitDetail {
  toolkit: Omit<ComposioToolkit, 'is_connected' | 'connected_accounts'>;
  tools: ComposioTool[];
  connections: Array<{
    uuid: string;
    composio_account_id: string;
    account_label?: string | null;
    status: ComposioAccountStatus;
    user_uuid?: string | null;
  }>;
}

export interface PaginatedComposioToolkits {
  data: ComposioToolkit[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface ComposioToolkitFilters {
  search?: string;
  category?: string;
  tier?: ComposioConnectionTier;
  connected?: boolean;
  page?: number;
  limit?: number;
}

export interface ConnectComposioResponse {
  redirect_url: string;
  connection_request_id?: string;
  toolkit_slug: string;
}

export interface ComposioCallbackResponse {
  status: string;
  connected_account_id?: string;
  toolkit_slug?: string;
}

export interface ComposioTrigger {
  uuid: string;
  composio_trigger_id: string;
  trigger_slug: string;
  connected_account_id: string;
  is_enabled: boolean;
  config: Record<string, unknown>;
  webhook_subscription_id?: string | null;
  created_at: string;
  toolkit: {
    uuid: string;
    slug: string;
    name: string;
    logo_url?: string | null;
  };
}
