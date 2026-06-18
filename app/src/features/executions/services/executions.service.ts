import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';

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
