import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { UpdateConversationPersonalizationDto } from '../interfaces/conversation-personalization.interfaces';
import {
  getConversationPersonalization,
  updateConversationPersonalization,
} from '../services/conversation-personalization.services';

export const conversationPersonalizationQueryKey = ['conversation-personalization'] as const;

export function useGetConversationPersonalization(orgUuid?: string) {
  return useQuery({
    queryKey: [...conversationPersonalizationQueryKey, orgUuid],
    queryFn: () => getConversationPersonalization(orgUuid as string),
    enabled: !!orgUuid,
  });
}

export function useUpdateConversationPersonalization(orgUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateConversationPersonalizationDto) =>
      updateConversationPersonalization(orgUuid as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationPersonalizationQueryKey });
      toast({ title: 'Personalization saved', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({
        title: 'Could not save personalization',
        description: error.message,
        variant: 'error',
      });
    },
  });
}
