import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  AdminIntegrationAppsSyncRun,
  AdminIntegrationAppsToolkit,
  AdminIntegrationAppsToolkitDetail,
  AdminIntegrationAppsToolkitStats,
  AdminIntegrationAppsTool,
  IntegrationAppsSyncType,
  PaginatedAdminIntegrationAppsToolkits,
} from '../interfaces/integrationApps-admin.interface';

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

export const getAdminIntegrationAppsToolkits = async (
  filters?: AdminToolkitFilters,
): Promise<PaginatedAdminIntegrationAppsToolkits> => {
  const response = await axiosInstance.get(`${ApiRoutes.admin.integrationAppsToolkits}${queryString(filters)}`);
  return response.data;
};

export const getAdminIntegrationAppsToolkit = async (toolkitSlug: string): Promise<AdminIntegrationAppsToolkitDetail> => {
  const response = await axiosInstance.get(ApiRoutes.admin.integrationAppsToolkit(toolkitSlug));
  return response.data;
};

export const updateAdminIntegrationAppsToolkit = async (
  toolkitSlug: string,
  payload: Pick<Partial<AdminIntegrationAppsToolkit>, 'is_enabled' | 'connection_tier'>,
): Promise<AdminIntegrationAppsToolkit> => {
  const response = await axiosInstance.patch(ApiRoutes.admin.integrationAppsToolkit(toolkitSlug), payload);
  return response.data;
};

export const createAdminIntegrationAppsToolkit = async (slug: string): Promise<AdminIntegrationAppsToolkit> => {
  const response = await axiosInstance.post(ApiRoutes.admin.integrationAppsToolkits, { slug });
  return response.data;
};

export const refreshAdminIntegrationAppsToolkit = async (toolkitSlug: string): Promise<AdminIntegrationAppsToolkitDetail> => {
  const response = await axiosInstance.post(ApiRoutes.admin.integrationAppsToolkitRefresh(toolkitSlug));
  return response.data;
};

export const syncAdminIntegrationAppsToolkitTools = async (
  toolkitSlug: string,
): Promise<{ sync_run: AdminIntegrationAppsSyncRun; toolkit: AdminIntegrationAppsToolkitDetail }> => {
  const response = await axiosInstance.post(ApiRoutes.admin.integrationAppsToolkitSyncTools(toolkitSlug));
  return response.data;
};

export const getAdminIntegrationAppsToolkitStats = async (
  toolkitSlug: string,
): Promise<AdminIntegrationAppsToolkitStats> => {
  const response = await axiosInstance.get(ApiRoutes.admin.integrationAppsToolkitStats(toolkitSlug));
  return response.data;
};

export const updateAdminIntegrationAppsTool = async (
  toolkitSlug: string,
  toolSlug: string,
  isEnabled: boolean,
): Promise<AdminIntegrationAppsTool> => {
  const response = await axiosInstance.patch(ApiRoutes.admin.integrationAppsToolkitTool(toolkitSlug, toolSlug), {
    is_enabled: isEnabled,
  });
  return response.data;
};

export const startAdminIntegrationAppsSync = async (
  syncType: IntegrationAppsSyncType,
  toolkitSlug?: string,
): Promise<AdminIntegrationAppsSyncRun> => {
  const response = await axiosInstance.post(ApiRoutes.admin.integrationAppsSync, {
    sync_type: syncType,
    toolkit_slug: toolkitSlug,
  });
  return response.data;
};

export const getAdminIntegrationAppsSyncRuns = async (limit = 25): Promise<{ data: AdminIntegrationAppsSyncRun[] }> => {
  const response = await axiosInstance.get(`${ApiRoutes.admin.integrationAppsSync}?limit=${limit}`);
  return response.data;
};
