export type IntegrationAppsConnectionTier = 'ORG_SHARED' | 'USER_PERSONAL';
export type IntegrationAppsAccountStatus = 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'INACTIVE';

export interface IntegrationAppsConnectedAccountSummary {
  id: string;
  account_id: string;
  label?: string | null;
  status: IntegrationAppsAccountStatus;
  user_uuid?: string | null;
}

export interface IntegrationAppsToolkit {
  uuid: string;
  slug: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  categories: string[];
  connection_tier: IntegrationAppsConnectionTier;
  is_connected: boolean;
  connected_accounts: IntegrationAppsConnectedAccountSummary[];
  is_org_enabled: boolean;
  tool_count: number;
}

export interface IntegrationAppsTool {
  uuid: string;
  slug: string;
  name: string;
  description?: string | null;
  toolkit_slug?: string;
  enabled: boolean;
  requires_approval: boolean;
  required_permission_key?: string | null;
}

export interface IntegrationAppsToolkitDetail {
  toolkit: Omit<IntegrationAppsToolkit, 'is_connected' | 'connected_accounts'>;
  tools: IntegrationAppsTool[];
  connections: Array<{
    uuid: string;
    account_id: string;
    account_label?: string | null;
    status: IntegrationAppsAccountStatus;
    user_uuid?: string | null;
  }>;
}

export interface PaginatedIntegrationAppsToolkits {
  data: IntegrationAppsToolkit[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface IntegrationAppsToolkitFilters {
  search?: string;
  category?: string;
  tier?: IntegrationAppsConnectionTier;
  connected?: boolean;
  page?: number;
  limit?: number;
}

export interface ConnectIntegrationAppsResponse {
  redirect_url: string;
  connection_request_id?: string;
  toolkit_slug: string;
}

export interface IntegrationAppsCallbackResponse {
  status: string;
  connected_account_id?: string;
  toolkit_slug?: string;
}

export interface IntegrationAppsTrigger {
  uuid: string;
  integration_trigger_id: string;
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
