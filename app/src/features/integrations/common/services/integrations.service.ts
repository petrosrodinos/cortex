import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  CreateIntegrationDto,
  Integration,
  IntegrationAction,
  TestIntegrationResponse,
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

export const deleteIntegration = async (organizationUuid: string, integrationUuid: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.organizations.integration(organizationUuid, integrationUuid));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to remove integration. Please try again.');
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
