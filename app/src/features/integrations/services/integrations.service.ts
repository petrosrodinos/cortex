import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  CreateDatabaseIntegrationDto,
  CreateIntegrationDto,
  CreateMcpIntegrationDto,
  CreateOpenApiIntegrationDto,
  DatabaseIntegrationDetails,
  Integration,
  IntegrationAction,
  ParseOpenApiSpecDto,
  ParseOpenApiSpecResponse,
  TestDatabaseConnectionDto,
  TestDatabaseConnectionResponse,
  TestIntegrationResponse,
  TestMcpConnectionDto,
  TestMcpConnectionResponse,
  ToggleIntegrationActionDto,
  UpdateIntegrationDto,
} from '../interfaces/integration.interface';

export const getIntegrations = async (organizationUuid: string): Promise<Integration[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.integrations(organizationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load integrations. Please try again.');
  }
};

export const getIntegration = async (organizationUuid: string, integrationUuid: string): Promise<Integration> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.integration(organizationUuid, integrationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load integration. Please try again.');
  }
};

export const createIntegration = async (organizationUuid: string, payload: CreateIntegrationDto): Promise<Integration> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.integrations(organizationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create integration. Please try again.');
  }
};

export const createDatabaseIntegration = async (
  organizationUuid: string,
  payload: CreateDatabaseIntegrationDto,
): Promise<Integration> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.databaseIntegrations(organizationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create database integration. Please try again.');
  }
};

export const testDatabaseConnection = async (
  organizationUuid: string,
  payload: TestDatabaseConnectionDto,
): Promise<TestDatabaseConnectionResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.databaseIntegrationTestDraft(organizationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to test database connection. Please try again.');
  }
};

export const getDatabaseIntegrationDetails = async (
  organizationUuid: string,
  integrationUuid: string,
): Promise<Integration> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.databaseIntegration(organizationUuid, integrationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load database schema. Please try again.');
  }
};

export const syncDatabaseSchema = async (
  organizationUuid: string,
  integrationUuid: string,
): Promise<DatabaseIntegrationDetails> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.databaseIntegrationSync(organizationUuid, integrationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to sync database schema. Please try again.');
  }
};

export const testSavedDatabaseConnection = async (
  organizationUuid: string,
  integrationUuid: string,
): Promise<TestIntegrationResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.databaseIntegrationTest(organizationUuid, integrationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to test database connection. Please try again.');
  }
};

export const parseOpenApiSpec = async (
  organizationUuid: string,
  payload: ParseOpenApiSpecDto,
): Promise<ParseOpenApiSpecResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.openApiIntegrationParse(organizationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to parse OpenAPI spec. Please try again.');
  }
};

export const createOpenApiIntegration = async (
  organizationUuid: string,
  payload: CreateOpenApiIntegrationDto,
): Promise<Integration> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.openApiIntegrations(organizationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create OpenAPI integration. Please try again.');
  }
};

export const getOpenApiIntegrationDetails = async (
  organizationUuid: string,
  integrationUuid: string,
): Promise<Integration> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.openApiIntegration(organizationUuid, integrationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load OpenAPI integration. Please try again.');
  }
};

export const regenerateOpenApiTools = async (
  organizationUuid: string,
  integrationUuid: string,
): Promise<Integration> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.openApiIntegrationRegenerate(organizationUuid, integrationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to regenerate OpenAPI tools. Please try again.');
  }
};

export const testOpenApiIntegration = async (
  organizationUuid: string,
  integrationUuid: string,
): Promise<TestIntegrationResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.openApiIntegrationTest(organizationUuid, integrationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to test OpenAPI integration. Please try again.');
  }
};

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

export const updateIntegration = async (
  organizationUuid: string,
  integrationUuid: string,
  payload: UpdateIntegrationDto,
): Promise<Integration> => {
  try {
    const response = await axiosInstance.patch(ApiRoutes.organizations.integration(organizationUuid, integrationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update integration. Please try again.');
  }
};

export const testIntegration = async (organizationUuid: string, integrationUuid: string): Promise<TestIntegrationResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.integrationTest(organizationUuid, integrationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to test integration. Please try again.');
  }
};

export const getIntegrationActions = async (organizationUuid: string, integrationUuid: string): Promise<IntegrationAction[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.integrationActions(organizationUuid, integrationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load integration actions. Please try again.');
  }
};

export const toggleIntegrationAction = async (
  organizationUuid: string,
  integrationUuid: string,
  actionUuid: string,
  payload: ToggleIntegrationActionDto,
): Promise<IntegrationAction> => {
  try {
    const response = await axiosInstance.patch(
      ApiRoutes.organizations.integrationAction(organizationUuid, integrationUuid, actionUuid),
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update integration action. Please try again.');
  }
};
