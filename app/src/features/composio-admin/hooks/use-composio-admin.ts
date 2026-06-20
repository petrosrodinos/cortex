import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { ComposioConnectionTier } from '@/features/composio/interfaces/composio.interface';
import type { ComposioSyncType } from '../interfaces/composio-admin.interface';
import {
  createAdminComposioToolkit,
  getAdminComposioSyncRuns,
  getAdminComposioToolkit,
  getAdminComposioToolkitStats,
  getAdminComposioToolkits,
  refreshAdminComposioToolkit,
  startAdminComposioSync,
  syncAdminComposioToolkitTools,
  updateAdminComposioTool,
  updateAdminComposioToolkit,
  type AdminToolkitFilters,
} from '../services/composio-admin.service';

export const adminComposioQueryKey = ['admin-composio'] as const;

export function useAdminComposioToolkits(filters?: AdminToolkitFilters) {
  return useQuery({
    queryKey: [...adminComposioQueryKey, 'toolkits', filters],
    queryFn: () => getAdminComposioToolkits(filters),
  });
}

export function useAdminComposioToolkit(toolkitSlug?: string) {
  return useQuery({
    queryKey: [...adminComposioQueryKey, 'toolkit', toolkitSlug],
    queryFn: () => getAdminComposioToolkit(toolkitSlug as string),
    enabled: !!toolkitSlug,
  });
}

export function useAdminComposioToolkitStats(toolkitSlug?: string) {
  return useQuery({
    queryKey: [...adminComposioQueryKey, 'toolkit', toolkitSlug, 'stats'],
    queryFn: () => getAdminComposioToolkitStats(toolkitSlug as string),
    enabled: !!toolkitSlug,
  });
}

export function useAdminComposioSyncRuns() {
  return useQuery({
    queryKey: [...adminComposioQueryKey, 'sync-runs'],
    queryFn: () => getAdminComposioSyncRuns(),
  });
}

export function useUpdateAdminComposioToolkit(toolkitSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { is_enabled?: boolean; connection_tier?: ComposioConnectionTier }) =>
      updateAdminComposioToolkit(toolkitSlug as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminComposioQueryKey });
      toast({ title: 'Toolkit updated', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update toolkit', description: error.message, variant: 'error' });
    },
  });
}

export function useCreateAdminComposioToolkit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => createAdminComposioToolkit(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminComposioQueryKey });
      toast({ title: 'Toolkit synced', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not sync toolkit', description: error.message, variant: 'error' });
    },
  });
}

export function useRefreshAdminComposioToolkit(toolkitSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => refreshAdminComposioToolkit(toolkitSlug as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminComposioQueryKey });
      toast({ title: 'Toolkit refreshed', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not refresh toolkit', description: error.message, variant: 'error' });
    },
  });
}

export function useSyncAdminComposioToolkitTools(toolkitSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => syncAdminComposioToolkitTools(toolkitSlug as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminComposioQueryKey });
      toast({ title: 'Tools synced', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not sync tools', description: error.message, variant: 'error' });
    },
  });
}

export function useUpdateAdminComposioTool(toolkitSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ toolSlug, isEnabled }: { toolSlug: string; isEnabled: boolean }) =>
      updateAdminComposioTool(toolkitSlug as string, toolSlug, isEnabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminComposioQueryKey });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update tool', description: error.message, variant: 'error' });
    },
  });
}

export function useStartAdminComposioSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ syncType, toolkitSlug }: { syncType: ComposioSyncType; toolkitSlug?: string }) =>
      startAdminComposioSync(syncType, toolkitSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminComposioQueryKey });
      toast({ title: 'Sync started', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not start sync', description: error.message, variant: 'error' });
    },
  });
}
