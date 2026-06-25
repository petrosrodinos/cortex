import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  CreateSavedPromptDto,
  SavedPrompt,
  UpdateSavedPromptDto,
} from '../interfaces/saved-prompts.interfaces';

export async function getSavedPrompts(organizationUuid: string): Promise<SavedPrompt[]> {
  try {
    const response = await axiosInstance.get<SavedPrompt[]>(
      ApiRoutes.organizations.savedPrompts(organizationUuid),
    );
    return response.data;
  } catch {
    throw new Error('Failed to load saved prompts. Please try again.');
  }
}

export async function createSavedPrompt(
  organizationUuid: string,
  payload: CreateSavedPromptDto,
): Promise<SavedPrompt> {
  try {
    const response = await axiosInstance.post<SavedPrompt>(
      ApiRoutes.organizations.savedPrompts(organizationUuid),
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string | string[] } } })?.response?.data
        ?.message;
    if (typeof message === 'string') {
      throw new Error(message);
    }
    if (Array.isArray(message)) {
      throw new Error(message.join(', '));
    }
    throw new Error('Failed to save prompt. Please try again.');
  }
}

export async function updateSavedPrompt(
  organizationUuid: string,
  promptUuid: string,
  payload: UpdateSavedPromptDto,
): Promise<SavedPrompt> {
  try {
    const response = await axiosInstance.patch<SavedPrompt>(
      ApiRoutes.organizations.savedPrompt(organizationUuid, promptUuid),
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string | string[] } } })?.response?.data
        ?.message;
    if (typeof message === 'string') {
      throw new Error(message);
    }
    if (Array.isArray(message)) {
      throw new Error(message.join(', '));
    }
    throw new Error('Failed to update prompt. Please try again.');
  }
}

export async function deleteSavedPrompt(
  organizationUuid: string,
  promptUuid: string,
): Promise<void> {
  try {
    await axiosInstance.delete(
      ApiRoutes.organizations.savedPrompt(organizationUuid, promptUuid),
    );
  } catch {
    throw new Error('Failed to delete prompt. Please try again.');
  }
}
