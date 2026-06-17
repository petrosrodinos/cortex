import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type { Conversation, Message, SendMessageResponse } from '../interfaces/conversation.interfaces';

export const getConversations = async (organizationUuid: string): Promise<Conversation[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.conversations(organizationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load conversations.');
  }
};

export const createConversation = async (organizationUuid: string, title?: string): Promise<Conversation> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.conversations(organizationUuid), { title });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create conversation.');
  }
};

export const getConversation = async (organizationUuid: string, conversationUuid: string): Promise<Conversation> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.conversation(organizationUuid, conversationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load conversation.');
  }
};

export const deleteConversation = async (organizationUuid: string, conversationUuid: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.organizations.conversation(organizationUuid, conversationUuid));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to delete conversation.');
  }
};

export const getMessages = async (organizationUuid: string, conversationUuid: string): Promise<Message[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.conversationMessages(organizationUuid, conversationUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load messages.');
  }
};

export const sendMessage = async (
  organizationUuid: string,
  conversationUuid: string,
  content: string,
): Promise<SendMessageResponse> => {
  try {
    const response = await axiosInstance.post(
      ApiRoutes.organizations.conversationMessages(organizationUuid, conversationUuid),
      { content },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to send message.');
  }
};

export const approveExecution = async (organizationUuid: string, executionUuid: string) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.executionApprove(organizationUuid, executionUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to approve execution.');
  }
};

export const rejectExecution = async (organizationUuid: string, executionUuid: string) => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.executionReject(organizationUuid, executionUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to reject execution.');
  }
};
