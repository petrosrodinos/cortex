import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type {
  CreateSavedPromptDto,
  UpdateSavedPromptDto,
} from '../interfaces/saved-prompts.interfaces';
import {
  createSavedPrompt,
  deleteSavedPrompt,
  getSavedPrompts,
  updateSavedPrompt,
} from '../services/saved-prompts.services';

export const savedPromptsQueryKey = ['saved-prompts'] as const;

export function useGetSavedPrompts(organizationUuid?: string) {
  return useQuery({
    queryKey: [...savedPromptsQueryKey, organizationUuid],
    queryFn: () => getSavedPrompts(organizationUuid!),
    enabled: !!organizationUuid,
  });
}

export function useCreateSavedPrompt(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSavedPromptDto) =>
      createSavedPrompt(organizationUuid!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedPromptsQueryKey });
      toast({
        title: 'Prompt saved',
        description: 'Your prompt was added to the library.',
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Could not save prompt',
        description: error.message,
        variant: 'error',
        duration: 3000,
      });
    },
  });
}

export function useUpdateSavedPrompt(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      promptUuid,
      payload,
    }: {
      promptUuid: string;
      payload: UpdateSavedPromptDto;
    }) => updateSavedPrompt(organizationUuid!, promptUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedPromptsQueryKey });
      toast({
        title: 'Prompt updated',
        description: 'Your changes were saved.',
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Could not update prompt',
        description: error.message,
        variant: 'error',
        duration: 3000,
      });
    },
  });
}

export function useDeleteSavedPrompt(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promptUuid: string) => deleteSavedPrompt(organizationUuid!, promptUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedPromptsQueryKey });
      toast({
        title: 'Prompt deleted',
        description: 'The prompt was removed from your library.',
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Could not delete prompt',
        description: error.message,
        variant: 'error',
        duration: 3000,
      });
    },
  });
}
