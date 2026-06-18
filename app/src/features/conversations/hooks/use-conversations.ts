import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import {
  approveExecution,
  createConversation,
  deleteConversation,
  getConversation,
  getConversations,
  getMessages,
  rejectExecution,
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
    mutationFn: ({ conversationUuid, title }: { conversationUuid: string; title: string }) =>
      updateConversation(organizationUuid as string, conversationUuid, title),
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
    mutationFn: ({ content, documentUuids }: { content: string; documentUuids?: string[] }) =>
      sendMessage(organizationUuid as string, conversationUuid as string, content, documentUuids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', organizationUuid, conversationUuid] });
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not send message', description: error.message, variant: 'error' });
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
