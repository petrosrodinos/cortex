import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  ConversationPersonalization,
  UpdateConversationPersonalizationDto,
} from '../interfaces/conversation-personalization.interfaces';

export const getConversationPersonalization = async (
  orgUuid: string,
): Promise<ConversationPersonalization> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.conversationPersonalization(orgUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load personalization settings.');
  }
};

export const updateConversationPersonalization = async (
  orgUuid: string,
  payload: UpdateConversationPersonalizationDto,
): Promise<ConversationPersonalization> => {
  try {
    const response = await axiosInstance.patch(
      ApiRoutes.organizations.conversationPersonalization(orgUuid),
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update personalization settings.');
  }
};
