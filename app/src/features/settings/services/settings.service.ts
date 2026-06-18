import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  UsageQuery,
  UsageRecordsResponse,
  UsageSummary,
} from '../interfaces/usage.interfaces';

export type { UsageQuery, UsageRecordsResponse, UsageSummary } from '../interfaces/usage.interfaces';

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

export interface Usage extends UsageSummary {}


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

export const getUsage = async (orgUuid: string, query?: UsageQuery): Promise<UsageSummary> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.usage(orgUuid), { params: query });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load usage.');
  }
};

export const getUsageRecords = async (orgUuid: string, query?: UsageQuery): Promise<UsageRecordsResponse> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.usageRecords(orgUuid), { params: query });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load usage records.');
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
