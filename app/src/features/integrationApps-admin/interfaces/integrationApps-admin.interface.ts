import type { IntegrationAppsConnectionTier } from '@/features/integrationApps/interfaces/integrationApps.interface';

export type IntegrationAppsSyncType = 'FULL' | 'TOOLKIT' | 'TOOLS';
export type IntegrationAppsSyncStatus = 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface AdminIntegrationAppsToolkit {
  uuid: string;
  slug: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  categories: string[];
  tool_count: number;
  connection_tiers: IntegrationAppsConnectionTier[];
  is_enabled: boolean;
  last_synced_at?: string | null;
  created_at: string;
  updated_at: string;
  _count?: {
    tools?: number;
    enabled_orgs?: number;
  };
}

export interface AdminIntegrationAppsTool {
  uuid: string;
  slug: string;
  name: string;
  description: string;
  tags: string[];
  is_enabled: boolean;
  last_synced_at?: string | null;
}

export interface AdminIntegrationAppsSyncRun {
  uuid: string;
  sync_type: IntegrationAppsSyncType;
  status: IntegrationAppsSyncStatus;
  toolkits_upserted: number;
  tools_upserted: number;
  error?: string | null;
  started_at: string;
  completed_at?: string | null;
}

export interface AdminIntegrationAppsToolkitDetail extends AdminIntegrationAppsToolkit {
  tools: AdminIntegrationAppsTool[];
}

export interface AdminIntegrationAppsToolkitStats {
  connected_accounts_count: number;
  active_triggers_count: number;
}

export interface PaginatedAdminIntegrationAppsToolkits {
  data: AdminIntegrationAppsToolkit[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
