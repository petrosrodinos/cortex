import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { CreateAiProviderDto, UpdateAiProviderDto } from '../interfaces/ai-providers.interfaces';
import {
  createAiProvider,
  deleteAiProvider,
  getAiProviders,
  updateAiProvider,
} from '../services/ai-providers.services';

export const aiProvidersQueryKey = ['ai-providers'] as const;

export function useGetAiProviders(orgUuid?: string) {
  return useQuery({
    queryKey: [...aiProvidersQueryKey, orgUuid],
    queryFn: () => getAiProviders(orgUuid as string),
    enabled: !!orgUuid,
  });
}

export function useCreateAiProvider(orgUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAiProviderDto) => createAiProvider(orgUuid as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiProvidersQueryKey });
      toast({ title: 'AI provider added', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not add AI provider', description: error.message, variant: 'error' });
    },
  });
}

export function useUpdateAiProvider(orgUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ providerUuid, payload }: { providerUuid: string; payload: UpdateAiProviderDto }) =>
      updateAiProvider(orgUuid as string, providerUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiProvidersQueryKey });
      toast({ title: 'AI provider updated', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update AI provider', description: error.message, variant: 'error' });
    },
  });
}

export function useDeleteAiProvider(orgUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (providerUuid: string) => deleteAiProvider(orgUuid as string, providerUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiProvidersQueryKey });
      toast({ title: 'AI provider removed', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not remove AI provider', description: error.message, variant: 'error' });
    },
  });
}
