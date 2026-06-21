import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { IntegrationAppsConnectionTier } from '@/features/integrationApps/interfaces/integrationApps.interface';
import type { IntegrationAppsSyncType } from '../interfaces/integrationApps-admin.interface';
import {
  createAdminIntegrationAppsToolkit,
  getAdminIntegrationAppsOverviewStats,
  getAdminIntegrationAppsSyncRuns,
  getAdminIntegrationAppsToolkit,
  getAdminIntegrationAppsToolkitStats,
  getAdminIntegrationAppsToolkits,
  refreshAdminIntegrationAppsToolkit,
  startAdminIntegrationAppsSync,
  syncAdminIntegrationAppsToolkitTools,
  updateAdminIntegrationAppsTool,
  updateAdminIntegrationAppsToolkit,
  type AdminToolkitFilters,
} from '../services/integrationApps-admin.service';

export const adminIntegrationAppsQueryKey = ['admin-integrationApps'] as const;

export function useAdminIntegrationAppsOverviewStats() {
  return useQuery({
    queryKey: [...adminIntegrationAppsQueryKey, 'overview-stats'],
    queryFn: () => getAdminIntegrationAppsOverviewStats(),
  });
}

export function useAdminIntegrationAppsToolkits(filters?: AdminToolkitFilters) {
  return useQuery({
    queryKey: [...adminIntegrationAppsQueryKey, 'toolkits', filters],
    queryFn: () => getAdminIntegrationAppsToolkits(filters),
  });
}

export function useAdminIntegrationAppsToolkit(toolkitSlug?: string) {
  return useQuery({
    queryKey: [...adminIntegrationAppsQueryKey, 'toolkit', toolkitSlug],
    queryFn: () => getAdminIntegrationAppsToolkit(toolkitSlug as string),
    enabled: !!toolkitSlug,
  });
}

export function useAdminIntegrationAppsToolkitStats(toolkitSlug?: string) {
  return useQuery({
    queryKey: [...adminIntegrationAppsQueryKey, 'toolkit', toolkitSlug, 'stats'],
    queryFn: () => getAdminIntegrationAppsToolkitStats(toolkitSlug as string),
    enabled: !!toolkitSlug,
  });
}

export function useAdminIntegrationAppsSyncRuns() {
  return useQuery({
    queryKey: [...adminIntegrationAppsQueryKey, 'sync-runs'],
    queryFn: () => getAdminIntegrationAppsSyncRuns(),
  });
}

export function useUpdateAdminIntegrationAppsToolkit(toolkitSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { is_enabled?: boolean; connection_tiers?: IntegrationAppsConnectionTier[] }) =>
      updateAdminIntegrationAppsToolkit(toolkitSlug as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminIntegrationAppsQueryKey });
      toast({ title: 'Toolkit updated', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update toolkit', description: error.message, variant: 'error' });
    },
  });
}

export function useCreateAdminIntegrationAppsToolkit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => createAdminIntegrationAppsToolkit(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminIntegrationAppsQueryKey });
      toast({ title: 'Toolkit synced', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not sync toolkit', description: error.message, variant: 'error' });
    },
  });
}

export function useRefreshAdminIntegrationAppsToolkit(toolkitSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => refreshAdminIntegrationAppsToolkit(toolkitSlug as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminIntegrationAppsQueryKey });
      toast({ title: 'Toolkit refreshed', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not refresh toolkit', description: error.message, variant: 'error' });
    },
  });
}

export function useSyncAdminIntegrationAppsToolkitTools(toolkitSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => syncAdminIntegrationAppsToolkitTools(toolkitSlug as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminIntegrationAppsQueryKey });
      toast({ title: 'Tools synced', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not sync tools', description: error.message, variant: 'error' });
    },
  });
}

export function useUpdateAdminIntegrationAppsTool(toolkitSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ toolSlug, isEnabled }: { toolSlug: string; isEnabled: boolean }) =>
      updateAdminIntegrationAppsTool(toolkitSlug as string, toolSlug, isEnabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminIntegrationAppsQueryKey });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update tool', description: error.message, variant: 'error' });
    },
  });
}

export function useStartAdminIntegrationAppsSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ syncType, toolkitSlug }: { syncType: IntegrationAppsSyncType; toolkitSlug?: string }) =>
      startAdminIntegrationAppsSync(syncType, toolkitSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminIntegrationAppsQueryKey });
      toast({ title: 'Sync started', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not start sync', description: error.message, variant: 'error' });
    },
  });
}
