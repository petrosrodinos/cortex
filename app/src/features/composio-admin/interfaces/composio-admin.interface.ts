import type { ComposioConnectionTier } from '@/features/composio/interfaces/composio.interface';

export type ComposioSyncType = 'FULL' | 'TOOLKIT' | 'TOOLS';
export type ComposioSyncStatus = 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface AdminComposioToolkit {
  uuid: string;
  slug: string;
  name: string;
  description?: string | null;
  logo_url?: string | null;
  categories: string[];
  tool_count: number;
  connection_tier: ComposioConnectionTier;
  is_enabled: boolean;
  last_synced_at?: string | null;
  created_at: string;
  updated_at: string;
  _count?: {
    tools?: number;
    enabled_orgs?: number;
  };
}

export interface AdminComposioTool {
  uuid: string;
  slug: string;
  name: string;
  description: string;
  tags: string[];
  is_enabled: boolean;
  last_synced_at?: string | null;
}

export interface AdminComposioSyncRun {
  uuid: string;
  sync_type: ComposioSyncType;
  status: ComposioSyncStatus;
  toolkits_upserted: number;
  tools_upserted: number;
  error?: string | null;
  started_at: string;
  completed_at?: string | null;
}

export interface AdminComposioToolkitDetail extends AdminComposioToolkit {
  tools: AdminComposioTool[];
}

export interface AdminComposioToolkitStats {
  connected_accounts_count: number;
  active_triggers_count: number;
}

export interface PaginatedAdminComposioToolkits {
  data: AdminComposioToolkit[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
