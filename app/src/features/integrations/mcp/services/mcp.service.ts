import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  CreateMcpIntegrationDto,
  TestMcpConnectionDto,
  TestMcpConnectionResponse,
} from '../interfaces/mcp.interface';
import type { Integration } from '../../common/interfaces/integration.interface';

export const testMcpConnection = async (
  organizationUuid: string,
  payload: TestMcpConnectionDto,
): Promise<TestMcpConnectionResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.mcpIntegrationTestConnection(organizationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to test MCP connection. Please try again.');
  }
};

export const createMcpIntegration = async (
  organizationUuid: string,
  payload: CreateMcpIntegrationDto,
): Promise<Integration> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.mcpIntegrations(organizationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create MCP integration. Please try again.');
  }
};

export const getMcpIntegrationDetails = async (
  organizationUuid: string,
  integrationUuid: string,
): Promise<Integration> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.mcpIntegration(organizationUuid, integrationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load MCP integration. Please try again.');
  }
};

export const syncMcpTools = async (organizationUuid: string, integrationUuid: string): Promise<Integration> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.mcpIntegrationSyncTools(organizationUuid, integrationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to sync MCP tools. Please try again.');
  }
};

export const testMcpIntegration = async (
  organizationUuid: string,
  integrationUuid: string,
): Promise<TestMcpConnectionResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.mcpIntegrationTest(organizationUuid, integrationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to test MCP integration. Please try again.');
  }
};
