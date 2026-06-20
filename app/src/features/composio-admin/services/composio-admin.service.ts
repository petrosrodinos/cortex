import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  AdminComposioSyncRun,
  AdminComposioToolkit,
  AdminComposioToolkitDetail,
  AdminComposioToolkitStats,
  AdminComposioTool,
  ComposioSyncType,
  PaginatedAdminComposioToolkits,
} from '../interfaces/composio-admin.interface';

export interface AdminToolkitFilters {
  search?: string;
  is_enabled?: boolean;
  page?: number;
  limit?: number;
}

function queryString(filters: AdminToolkitFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.is_enabled !== undefined) params.set('is_enabled', String(filters.is_enabled));
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  const value = params.toString();
  return value ? `?${value}` : '';
}

export const getAdminComposioToolkits = async (
  filters?: AdminToolkitFilters,
): Promise<PaginatedAdminComposioToolkits> => {
  const response = await axiosInstance.get(`${ApiRoutes.admin.composioToolkits}${queryString(filters)}`);
  return response.data;
};

export const getAdminComposioToolkit = async (toolkitSlug: string): Promise<AdminComposioToolkitDetail> => {
  const response = await axiosInstance.get(ApiRoutes.admin.composioToolkit(toolkitSlug));
  return response.data;
};

export const updateAdminComposioToolkit = async (
  toolkitSlug: string,
  payload: Pick<Partial<AdminComposioToolkit>, 'is_enabled' | 'connection_tier'>,
): Promise<AdminComposioToolkit> => {
  const response = await axiosInstance.patch(ApiRoutes.admin.composioToolkit(toolkitSlug), payload);
  return response.data;
};

export const createAdminComposioToolkit = async (slug: string): Promise<AdminComposioToolkit> => {
  const response = await axiosInstance.post(ApiRoutes.admin.composioToolkits, { slug });
  return response.data;
};

export const refreshAdminComposioToolkit = async (toolkitSlug: string): Promise<AdminComposioToolkitDetail> => {
  const response = await axiosInstance.post(ApiRoutes.admin.composioToolkitRefresh(toolkitSlug));
  return response.data;
};

export const syncAdminComposioToolkitTools = async (
  toolkitSlug: string,
): Promise<{ sync_run: AdminComposioSyncRun; toolkit: AdminComposioToolkitDetail }> => {
  const response = await axiosInstance.post(ApiRoutes.admin.composioToolkitSyncTools(toolkitSlug));
  return response.data;
};

export const getAdminComposioToolkitStats = async (
  toolkitSlug: string,
): Promise<AdminComposioToolkitStats> => {
  const response = await axiosInstance.get(ApiRoutes.admin.composioToolkitStats(toolkitSlug));
  return response.data;
};

export const updateAdminComposioTool = async (
  toolkitSlug: string,
  toolSlug: string,
  isEnabled: boolean,
): Promise<AdminComposioTool> => {
  const response = await axiosInstance.patch(ApiRoutes.admin.composioToolkitTool(toolkitSlug, toolSlug), {
    is_enabled: isEnabled,
  });
  return response.data;
};

export const startAdminComposioSync = async (
  syncType: ComposioSyncType,
  toolkitSlug?: string,
): Promise<AdminComposioSyncRun> => {
  const response = await axiosInstance.post(ApiRoutes.admin.composioSync, {
    sync_type: syncType,
    toolkit_slug: toolkitSlug,
  });
  return response.data;
};

export const getAdminComposioSyncRuns = async (limit = 25): Promise<{ data: AdminComposioSyncRun[] }> => {
  const response = await axiosInstance.get(`${ApiRoutes.admin.composioSync}?limit=${limit}`);
  return response.data;
};
