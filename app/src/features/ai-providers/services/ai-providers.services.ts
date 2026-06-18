import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type { AiProvider, CreateAiProviderDto, UpdateAiProviderDto } from '../interfaces/ai-providers.interfaces';

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
