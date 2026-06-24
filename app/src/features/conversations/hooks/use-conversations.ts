import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { ComposioConnectionTier } from '@/features/integration-apps/constants/composio-connection-tier';
import type { UpdateConversationPayload } from '../interfaces/conversation.interfaces';
import {
  approveExecution,
  createConversation,
  deleteConversation,
  deleteMessage,
  getConversation,
  getConversations,
  getMessages,
  getConversationAgentTools,
  rejectExecution,
  resolveConnectionTiers,
  sendMessage,
  updateConversation,
} from '../services/conversations.service';

export const conversationsQueryKey = ['conversations'] as const;

export function useGetConversations(organizationUuid?: string) {
  return useQuery({
    queryKey: [...conversationsQueryKey, organizationUuid],
    queryFn: () => getConversations(organizationUuid as string),
    enabled: !!organizationUuid,
  });
}

export function useGetConversation(organizationUuid?: string, conversationUuid?: string) {
  return useQuery({
    queryKey: [...conversationsQueryKey, organizationUuid, conversationUuid],
    queryFn: () => getConversation(organizationUuid as string, conversationUuid as string),
    enabled: !!organizationUuid && !!conversationUuid,
  });
}

export function useGetMessages(organizationUuid?: string, conversationUuid?: string) {
  return useQuery({
    queryKey: ['messages', organizationUuid, conversationUuid],
    queryFn: () => getMessages(organizationUuid as string, conversationUuid as string),
    enabled: !!organizationUuid && !!conversationUuid,
  });
}

export function useGetConversationAgentTools(organizationUuid?: string) {
  return useQuery({
    queryKey: ['conversation-agent-tools', organizationUuid],
    queryFn: () => getConversationAgentTools(organizationUuid as string),
    enabled: !!organizationUuid,
  });
}

export function useCreateConversation(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title?: string) => createConversation(organizationUuid as string, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
      toast({ title: 'Conversation created', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not create conversation', description: error.message, variant: 'error' });
    },
  });
}

export function useDeleteConversation(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationUuid: string) => deleteConversation(organizationUuid as string, conversationUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
      toast({ title: 'Conversation deleted', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not delete conversation', description: error.message, variant: 'error' });
    },
  });
}

export function useUpdateConversation(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationUuid,
      ...payload
    }: { conversationUuid: string } & UpdateConversationPayload) =>
      updateConversation(organizationUuid as string, conversationUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
      toast({ title: 'Conversation updated', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update conversation', description: error.message, variant: 'error' });
    },
  });
}

export function useSendMessage(organizationUuid?: string, conversationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      content,
      documentUuids,
      integrationUuids,
      toolkitSlugs,
    }: {
      content: string;
      documentUuids?: string[];
      integrationUuids?: string[];
      toolkitSlugs?: string[];
    }) =>
      sendMessage(
        organizationUuid as string,
        conversationUuid as string,
        content,
        documentUuids,
        integrationUuids,
        toolkitSlugs,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', organizationUuid, conversationUuid] });
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not send message', description: error.message, variant: 'error' });
    },
  });
}

export function useDeleteMessage(organizationUuid?: string, conversationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageUuid: string) =>
      deleteMessage(organizationUuid as string, conversationUuid as string, messageUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', organizationUuid, conversationUuid] });
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
      toast({ title: 'Message deleted', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not delete message', description: error.message, variant: 'error' });
    },
  });
}

export function useApproveExecution(organizationUuid?: string) {
  return useMutation({
    mutationFn: (executionUuid: string) => approveExecution(organizationUuid as string, executionUuid),
    onError: (error: Error) => {
      toast({ title: 'Could not approve action', description: error.message, variant: 'error' });
    },
  });
}

export function useRejectExecution(organizationUuid?: string) {
  return useMutation({
    mutationFn: (executionUuid: string) => rejectExecution(organizationUuid as string, executionUuid),
    onError: (error: Error) => {
      toast({ title: 'Could not reject action', description: error.message, variant: 'error' });
    },
  });
}

export function useResolveConnectionTiers(organizationUuid?: string) {
  return useMutation({
    mutationFn: ({
      executionUuid,
      choices,
    }: {
      executionUuid: string;
      choices: Record<string, ComposioConnectionTier>;
    }) => resolveConnectionTiers(organizationUuid as string, executionUuid, choices),
    onError: (error: Error) => {
      toast({ title: 'Could not continue', description: error.message, variant: 'error' });
    },
  });
}
