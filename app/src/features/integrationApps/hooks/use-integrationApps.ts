import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { IntegrationAppsConnectionTier, IntegrationAppsToolkitFilters } from '../interfaces/integrationApps.interface';
import {
  connectIntegrationAppsToolkit,
  createIntegrationAppsTrigger,
  deleteIntegrationAppsTrigger,
  disableIntegrationAppsToolkit,
  enableIntegrationAppsToolkit,
  getIntegrationAppsTriggers,
  getIntegrationAppsToolkit,
  getIntegrationAppsToolkits,
  updateIntegrationAppsTrigger,
  updateIntegrationAppsToolPermission,
  verifyIntegrationAppsCallback,
} from '../services/integrationApps.service';

export const integrationAppsToolkitsQueryKey = ['integrationApps-toolkits'] as const;
export const integrationAppsTriggersQueryKey = ['integrationApps-triggers'] as const;

export function useGetIntegrationAppsToolkits(organizationUuid?: string, filters?: IntegrationAppsToolkitFilters) {
  return useQuery({
    queryKey: [...integrationAppsToolkitsQueryKey, organizationUuid, filters],
    queryFn: () => getIntegrationAppsToolkits(organizationUuid as string, filters),
    enabled: !!organizationUuid,
  });
}

export function useGetIntegrationAppsToolkit(organizationUuid?: string, toolkitSlug?: string) {
  return useQuery({
    queryKey: [...integrationAppsToolkitsQueryKey, organizationUuid, toolkitSlug],
    queryFn: () => getIntegrationAppsToolkit(organizationUuid as string, toolkitSlug as string),
    enabled: !!organizationUuid && !!toolkitSlug,
  });
}

export function useConnectIntegrationAppsToolkit(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      toolkitSlug,
      connectionTier,
    }: {
      toolkitSlug: string;
      connectionTier?: IntegrationAppsConnectionTier;
    }) => connectIntegrationAppsToolkit(organizationUuid as string, toolkitSlug, connectionTier),
    onSuccess: (response) => {
      if (response.redirect_url) {
        window.location.assign(response.redirect_url);
        return;
      }

      queryClient.invalidateQueries({ queryKey: integrationAppsToolkitsQueryKey });
      toast({ title: 'Connection synced', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not connect toolkit', description: error.message, variant: 'error' });
    },
  });
}

export function useEnableIntegrationAppsToolkit(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (toolkitSlug: string) => enableIntegrationAppsToolkit(organizationUuid as string, toolkitSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationAppsToolkitsQueryKey });
      toast({ title: 'Toolkit enabled', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not enable toolkit', description: error.message, variant: 'error' });
    },
  });
}

export function useDisableIntegrationAppsToolkit(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (toolkitSlug: string) => disableIntegrationAppsToolkit(organizationUuid as string, toolkitSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationAppsToolkitsQueryKey });
      toast({ title: 'Toolkit disabled', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not disable toolkit', description: error.message, variant: 'error' });
    },
  });
}

export function useVerifyIntegrationAppsCallback(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      toolkitSlug,
      connectionRequestId,
      connectedAccountId,
    }: {
      toolkitSlug: string;
      connectionRequestId?: string;
      connectedAccountId?: string;
    }) =>
      verifyIntegrationAppsCallback(
        organizationUuid as string,
        toolkitSlug,
        connectionRequestId,
        undefined,
        connectedAccountId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationAppsToolkitsQueryKey });
      toast({ title: 'Connection verified', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not verify connection', description: error.message, variant: 'error' });
    },
  });
}

export function useUpdateIntegrationAppsToolPermission(organizationUuid?: string, toolkitSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      toolSlug,
      payload,
    }: {
      toolSlug: string;
      payload: { enabled?: boolean; requires_approval?: boolean; required_permission_key?: string | null };
    }) => updateIntegrationAppsToolPermission(organizationUuid as string, toolSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationAppsToolkitsQueryKey });
      queryClient.invalidateQueries({ queryKey: [...integrationAppsToolkitsQueryKey, organizationUuid, toolkitSlug] });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update tool', description: error.message, variant: 'error' });
    },
  });
}

export function useGetIntegrationAppsTriggers(organizationUuid?: string) {
  return useQuery({
    queryKey: [...integrationAppsTriggersQueryKey, organizationUuid],
    queryFn: () => getIntegrationAppsTriggers(organizationUuid as string),
    enabled: !!organizationUuid,
  });
}

export function useCreateIntegrationAppsTrigger(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      toolkit_slug: string;
      trigger_slug: string;
      connected_account_id: string;
      config?: Record<string, unknown>;
    }) => createIntegrationAppsTrigger(organizationUuid as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationAppsTriggersQueryKey });
      toast({ title: 'Trigger created', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not create trigger', description: error.message, variant: 'error' });
    },
  });
}

export function useUpdateIntegrationAppsTrigger(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      triggerUuid,
      payload,
    }: {
      triggerUuid: string;
      payload: { is_enabled?: boolean; config?: Record<string, unknown> };
    }) => updateIntegrationAppsTrigger(organizationUuid as string, triggerUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationAppsTriggersQueryKey });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update trigger', description: error.message, variant: 'error' });
    },
  });
}

export function useDeleteIntegrationAppsTrigger(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (triggerUuid: string) => deleteIntegrationAppsTrigger(organizationUuid as string, triggerUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationAppsTriggersQueryKey });
      toast({ title: 'Trigger deleted', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not delete trigger', description: error.message, variant: 'error' });
    },
  });
}
