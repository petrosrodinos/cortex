import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  IntegrationAppsCallbackResponse,
  IntegrationAppsTrigger,
  IntegrationAppsToolkitDetail,
  IntegrationAppsToolkitCount,
  IntegrationAppsToolkitCountFilters,
  IntegrationAppsToolkitFilters,
  IntegrationAppsToolFilters,
  IntegrationAppsTool,
  IntegrationAppsConnectionTier,
  ConnectIntegrationAppsResponse,
  PaginatedIntegrationAppsToolkits,
  PaginatedIntegrationAppsTools,
} from '../interfaces/integrationApps.interface';

function buildToolkitQuery(filters: IntegrationAppsToolkitFilters = {}) {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.tier) params.set('tier', filters.tier);
  if (filters.connected !== undefined) params.set('connected', String(filters.connected));
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  const query = params.toString();
  return query ? `?${query}` : '';
}

function buildToolkitCountQuery(filters: IntegrationAppsToolkitCountFilters = {}) {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.tier) params.set('tier', filters.tier);
  if (filters.connected !== undefined) params.set('connected', String(filters.connected));

  const query = params.toString();
  return query ? `?${query}` : '';
}

function buildToolkitToolsQuery(filters: IntegrationAppsToolFilters = {}) {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  const query = params.toString();
  return query ? `?${query}` : '';
}

export const getIntegrationAppsToolkits = async (
  organizationUuid: string,
  filters?: IntegrationAppsToolkitFilters,
): Promise<PaginatedIntegrationAppsToolkits> => {
  try {
    const response = await axiosInstance.get(
      `${ApiRoutes.organizations.integrationAppsToolkits(organizationUuid)}${buildToolkitQuery(filters)}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load integrations.');
  }
};

export const getIntegrationAppsToolkitsCount = async (
  organizationUuid: string,
  filters?: IntegrationAppsToolkitCountFilters,
): Promise<IntegrationAppsToolkitCount> => {
  try {
    const response = await axiosInstance.get(
      `${ApiRoutes.organizations.integrationAppsToolkitsCount(organizationUuid)}${buildToolkitCountQuery(filters)}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load integration count.');
  }
};

export const getIntegrationAppsToolkit = async (
  organizationUuid: string,
  toolkitSlug: string,
): Promise<IntegrationAppsToolkitDetail> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.integrationAppsToolkit(organizationUuid, toolkitSlug));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load integration.');
  }
};

export const getIntegrationAppsToolkitTools = async (
  organizationUuid: string,
  toolkitSlug: string,
  filters?: IntegrationAppsToolFilters,
): Promise<PaginatedIntegrationAppsTools> => {
  try {
    const response = await axiosInstance.get(
      `${ApiRoutes.organizations.integrationAppsToolkitTools(organizationUuid, toolkitSlug)}${buildToolkitToolsQuery(filters)}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load integration tools.');
  }
};

const connectTierStorageKey = (toolkitSlug: string) => `integrationAppsConnectTier:${toolkitSlug}`;

export const connectIntegrationAppsToolkit = async (
  organizationUuid: string,
  toolkitSlug: string,
  connectionTier?: IntegrationAppsConnectionTier,
): Promise<ConnectIntegrationAppsResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.integrationAppsConnect(organizationUuid), {
      toolkit_slug: toolkitSlug,
      ...(connectionTier ? { connection_tier: connectionTier } : {}),
    });
    if (connectionTier) {
      sessionStorage.setItem(connectTierStorageKey(toolkitSlug), connectionTier);
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create integration connect link.');
  }
};

export const enableIntegrationAppsToolkit = async (organizationUuid: string, toolkitSlug: string): Promise<void> => {
  try {
    await axiosInstance.post(ApiRoutes.organizations.integrationAppsToolkitEnable(organizationUuid, toolkitSlug));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to enable integration.');
  }
};

export const disableIntegrationAppsToolkit = async (organizationUuid: string, toolkitSlug: string): Promise<void> => {
  try {
    await axiosInstance.post(ApiRoutes.organizations.integrationAppsToolkitDisable(organizationUuid, toolkitSlug));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to disable integration.');
  }
};

export const disconnectIntegrationAppsAccount = async (
  organizationUuid: string,
  connectedAccountId: string,
): Promise<void> => {
  try {
    await axiosInstance.delete(
      ApiRoutes.organizations.integrationAppsAccount(organizationUuid, connectedAccountId),
    );
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to remove connection.');
  }
};

export const verifyIntegrationAppsCallback = async (
  organizationUuid: string,
  toolkitSlug: string,
  connectionRequestId?: string,
  connectionTier?: IntegrationAppsConnectionTier,
  connectedAccountId?: string,
): Promise<IntegrationAppsCallbackResponse> => {
  try {
    const storedTier = connectionTier ?? (sessionStorage.getItem(connectTierStorageKey(toolkitSlug)) as IntegrationAppsConnectionTier | null);
    const response = await axiosInstance.post(ApiRoutes.organizations.integrationAppsCallback(organizationUuid), {
      toolkit_slug: toolkitSlug,
      connection_request_id: connectionRequestId,
      connected_account_id: connectedAccountId,
      ...(storedTier ? { connection_tier: storedTier } : {}),
    });
    sessionStorage.removeItem(connectTierStorageKey(toolkitSlug));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to verify integration connection.');
  }
};

export const updateIntegrationAppsToolPermission = async (
  organizationUuid: string,
  toolSlug: string,
  payload: { enabled?: boolean; requires_approval?: boolean; required_permission_key?: string | null },
): Promise<IntegrationAppsTool> => {
  try {
    const response = await axiosInstance.patch(
      ApiRoutes.organizations.integrationAppsToolPermission(organizationUuid, toolSlug),
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update integration tool permission.');
  }
};

export const getIntegrationAppsTriggers = async (organizationUuid: string): Promise<{ data: IntegrationAppsTrigger[] }> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.integrationAppsTriggers(organizationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load integration triggers.');
  }
};

export const createIntegrationAppsTrigger = async (
  organizationUuid: string,
  payload: {
    toolkit_slug: string;
    trigger_slug: string;
    connected_account_id: string;
    config?: Record<string, unknown>;
  },
): Promise<IntegrationAppsTrigger> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.integrationAppsTriggers(organizationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create integration trigger.');
  }
};

export const updateIntegrationAppsTrigger = async (
  organizationUuid: string,
  triggerUuid: string,
  payload: { is_enabled?: boolean; config?: Record<string, unknown> },
): Promise<IntegrationAppsTrigger> => {
  try {
    const response = await axiosInstance.patch(
      ApiRoutes.organizations.integrationAppsTrigger(organizationUuid, triggerUuid),
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update integration trigger.');
  }
};

export const deleteIntegrationAppsTrigger = async (organizationUuid: string, triggerUuid: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.organizations.integrationAppsTrigger(organizationUuid, triggerUuid));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to delete integration trigger.');
  }
};
