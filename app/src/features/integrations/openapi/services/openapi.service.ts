import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  CreateOpenApiIntegrationDto,
  ParseOpenApiSpecDto,
  ParseOpenApiSpecResponse,
} from '../interfaces/openapi.interface';
import type { Integration, TestIntegrationResponse } from '../../common/interfaces/integration.interface';

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
