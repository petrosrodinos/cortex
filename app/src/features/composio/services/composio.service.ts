import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  ComposioCallbackResponse,
  ComposioTrigger,
  ComposioToolkitDetail,
  ComposioToolkitFilters,
  ComposioTool,
  ConnectComposioResponse,
  PaginatedComposioToolkits,
} from '../interfaces/composio.interface';

function buildToolkitQuery(filters: ComposioToolkitFilters = {}) {
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

export const getComposioToolkits = async (
  organizationUuid: string,
  filters?: ComposioToolkitFilters,
): Promise<PaginatedComposioToolkits> => {
  try {
    const response = await axiosInstance.get(
      `${ApiRoutes.organizations.composioToolkits(organizationUuid)}${buildToolkitQuery(filters)}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load Composio toolkits.');
  }
};

export const getComposioToolkit = async (
  organizationUuid: string,
  toolkitSlug: string,
): Promise<ComposioToolkitDetail> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.composioToolkit(organizationUuid, toolkitSlug));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load Composio toolkit.');
  }
};

export const connectComposioToolkit = async (
  organizationUuid: string,
  toolkitSlug: string,
): Promise<ConnectComposioResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.composioConnect(organizationUuid), {
      toolkit_slug: toolkitSlug,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create Composio connect link.');
  }
};

export const enableComposioToolkit = async (organizationUuid: string, toolkitSlug: string): Promise<void> => {
  try {
    await axiosInstance.post(ApiRoutes.organizations.composioToolkitEnable(organizationUuid, toolkitSlug));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to enable Composio toolkit.');
  }
};

export const disableComposioToolkit = async (organizationUuid: string, toolkitSlug: string): Promise<void> => {
  try {
    await axiosInstance.post(ApiRoutes.organizations.composioToolkitDisable(organizationUuid, toolkitSlug));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to disable Composio toolkit.');
  }
};

export const verifyComposioCallback = async (
  organizationUuid: string,
  toolkitSlug: string,
  connectionRequestId?: string,
): Promise<ComposioCallbackResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.composioCallback(organizationUuid), {
      toolkit_slug: toolkitSlug,
      connection_request_id: connectionRequestId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to verify Composio connection.');
  }
};

export const updateComposioToolPermission = async (
  organizationUuid: string,
  toolSlug: string,
  payload: { enabled?: boolean; requires_approval?: boolean; required_permission_key?: string | null },
): Promise<ComposioTool> => {
  try {
    const response = await axiosInstance.patch(
      ApiRoutes.organizations.composioToolPermission(organizationUuid, toolSlug),
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update Composio tool permission.');
  }
};

export const getComposioTriggers = async (organizationUuid: string): Promise<{ data: ComposioTrigger[] }> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.composioTriggers(organizationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load Composio triggers.');
  }
};

export const createComposioTrigger = async (
  organizationUuid: string,
  payload: {
    toolkit_slug: string;
    trigger_slug: string;
    connected_account_id: string;
    config?: Record<string, unknown>;
  },
): Promise<ComposioTrigger> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.composioTriggers(organizationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create Composio trigger.');
  }
};

export const updateComposioTrigger = async (
  organizationUuid: string,
  triggerUuid: string,
  payload: { is_enabled?: boolean; config?: Record<string, unknown> },
): Promise<ComposioTrigger> => {
  try {
    const response = await axiosInstance.patch(
      ApiRoutes.organizations.composioTrigger(organizationUuid, triggerUuid),
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update Composio trigger.');
  }
};

export const deleteComposioTrigger = async (organizationUuid: string, triggerUuid: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.organizations.composioTrigger(organizationUuid, triggerUuid));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to delete Composio trigger.');
  }
};
