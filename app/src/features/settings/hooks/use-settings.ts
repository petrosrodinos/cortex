import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { CreateAiProviderDto, UpdateAiProviderDto } from '../services/settings.service';
import type { UsageQuery } from '../interfaces/usage.interfaces';
import {
  createAiProvider,
  deleteAiProvider,
  getAiProviders,
  getAuditLogs,
  getUsage,
  getUsageRecords,
  updateAiProvider,
} from '../services/settings.service';

export const aiProvidersQueryKey = ['aiProviders'] as const;
export const usageQueryKey = ['usage'] as const;
export const auditLogsQueryKey = ['auditLogs'] as const;

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
      queryClient.invalidateQueries({ queryKey: [...aiProvidersQueryKey, orgUuid] });
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
      queryClient.invalidateQueries({ queryKey: [...aiProvidersQueryKey, orgUuid] });
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
      queryClient.invalidateQueries({ queryKey: [...aiProvidersQueryKey, orgUuid] });
      toast({ title: 'AI provider removed', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not remove AI provider', description: error.message, variant: 'error' });
    },
  });
}

export function useGetUsage(orgUuid?: string, query?: UsageQuery) {
  return useQuery({
    queryKey: [...usageQueryKey, orgUuid, query],
    queryFn: () => getUsage(orgUuid as string, query),
    enabled: !!orgUuid,
  });
}

export function useGetUsageRecords(orgUuid?: string, query?: UsageQuery) {
  return useQuery({
    queryKey: [...usageQueryKey, 'records', orgUuid, query],
    queryFn: () => getUsageRecords(orgUuid as string, query),
    enabled: !!orgUuid,
  });
}

export function useGetAuditLogs(orgUuid?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [...auditLogsQueryKey, orgUuid, page, limit],
    queryFn: () => getAuditLogs(orgUuid as string, page, limit),
    enabled: !!orgUuid,
  });
}
