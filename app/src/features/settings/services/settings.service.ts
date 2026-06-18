import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';

export interface AiProvider {
  uuid: string;
  org_uuid: string;
  provider: string;
  default_model: string;
  has_api_key: boolean;
  is_default: boolean;
  usage_limit_tokens?: number;
  usage_limit_cost_usd?: number;
  created_at: string;
}

export interface CreateAiProviderDto {
  provider: string;
  api_key: string;
  default_model: string;
  is_default?: boolean;
  usage_limit_tokens?: number;
  usage_limit_cost_usd?: number;
}

export type UpdateAiProviderDto = Partial<CreateAiProviderDto>;

export interface Usage {
  total_tokens: number;
  total_cost_usd: number;
  total_executions: number;
  daily: { date: string; tokens: number; cost_usd: number; count: number }[];
}

export interface AuditLog {
  uuid: string;
  action: string;
  resource_type: string;
  resource_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
  user_uuid: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

export const getAiProviders = async (orgUuid: string): Promise<AiProvider[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.aiProviders(orgUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load AI providers.');
  }
};

export const createAiProvider = async (orgUuid: string, payload: CreateAiProviderDto): Promise<AiProvider> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.aiProviders(orgUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create AI provider.');
  }
};

export const updateAiProvider = async (
  orgUuid: string,
  providerUuid: string,
  payload: UpdateAiProviderDto,
): Promise<AiProvider> => {
  try {
    const response = await axiosInstance.patch(ApiRoutes.aiProvider(orgUuid, providerUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update AI provider.');
  }
};

export const deleteAiProvider = async (orgUuid: string, providerUuid: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.aiProvider(orgUuid, providerUuid));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to delete AI provider.');
  }
};

export const getUsage = async (orgUuid: string): Promise<Usage> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.usage(orgUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load usage.');
  }
};

export const getAuditLogs = async (orgUuid: string, page = 1, limit = 20): Promise<AuditLogsResponse> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.auditLogs(orgUuid), { params: { page, limit } });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load audit logs.');
  }
};
