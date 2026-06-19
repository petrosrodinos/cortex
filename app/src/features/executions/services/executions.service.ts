import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type { UsageQuery, UsageRecordsResponse, UsageSummary } from '../interfaces/usage.interfaces';

export interface ToolCall {
  uuid: string;
  tool_name: string;
  integration_uuid: string;
  input: unknown;
  output: unknown;
  status: string;
  error?: string;
  duration_ms: number;
  tokens_used: number;
  cost_usd: number;
  created_at: string;
}

export interface ExecutionInput {
  content?: string;
  documentUuids?: string[];
  integrationUuids?: string[];
}

export interface ExecutionOutput {
  content: string;
  files: string[];
  outputType: string;
}

export interface ExecutionDetail {
  uuid: string;
  status: string;
  tokens_used: number;
  cost_usd: number;
  created_at: string;
  completed_at?: string;
  error?: string;
  input?: ExecutionInput;
  output?: ExecutionOutput;
  tool_calls: ToolCall[];
}

export const getExecution = async (orgUuid: string, executionUuid: string): Promise<ExecutionDetail> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.execution(orgUuid, executionUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load execution.');
  }
};

export const listExecutions = async (orgUuid: string): Promise<ExecutionDetail[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.executions(orgUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load executions.');
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
