import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type { ComposioConnectionTier } from '@/features/integration-apps/constants/composio-connection-tier';
import type { Conversation, Message, SendMessageResponse, AgentExecution, ConversationAgentTools, UpdateConversationPayload } from '../interfaces/conversation.interfaces';

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

export const updateConversation = async (
  organizationUuid: string,
  conversationUuid: string,
  payload: UpdateConversationPayload,
): Promise<Conversation> => {
  try {
    const response = await axiosInstance.patch(
      ApiRoutes.organizations.conversation(organizationUuid, conversationUuid),
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update conversation.');
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

export const getConversationAgentTools = async (
  organizationUuid: string,
): Promise<ConversationAgentTools> => {
  try {
    const response = await axiosInstance.get(
      ApiRoutes.organizations.conversationAgentTools(organizationUuid),
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load conversation tools.');
  }
};

export const sendMessage = async (
  organizationUuid: string,
  conversationUuid: string,
  content: string,
  documentUuids?: string[],
  integrationUuids?: string[],
  toolkitSlugs?: string[],
): Promise<SendMessageResponse> => {
  try {
    const response = await axiosInstance.post(
      ApiRoutes.organizations.conversationMessages(organizationUuid, conversationUuid),
      { content, documentUuids, integrationUuids, toolkitSlugs },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to send message.');
  }
};

export const deleteMessage = async (
  organizationUuid: string,
  conversationUuid: string,
  messageUuid: string,
): Promise<void> => {
  try {
    await axiosInstance.delete(
      ApiRoutes.organizations.conversationMessage(organizationUuid, conversationUuid, messageUuid),
    );
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to delete message.');
  }
};

export const getExecution = async (organizationUuid: string, executionUuid: string): Promise<AgentExecution> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.execution(organizationUuid, executionUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load execution.');
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

export const resolveConnectionTiers = async (
  organizationUuid: string,
  executionUuid: string,
  choices: Record<string, ComposioConnectionTier>,
) => {
  try {
    const response = await axiosInstance.post(
      ApiRoutes.organizations.executionConnectionTiers(organizationUuid, executionUuid),
      { choices },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to resolve connection tiers.');
  }
};
