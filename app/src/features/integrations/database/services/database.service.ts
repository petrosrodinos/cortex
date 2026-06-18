import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  CreateDatabaseIntegrationDto,
  DatabaseIntegrationDetails,
  TestDatabaseConnectionDto,
  TestDatabaseConnectionResponse,
} from '../interfaces/database.interface';
import type { Integration, TestIntegrationResponse } from '../../common/interfaces/integration.interface';

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
