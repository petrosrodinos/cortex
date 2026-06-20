import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { ComposioToolkitFilters } from '../interfaces/composio.interface';
import {
  connectComposioToolkit,
  createComposioTrigger,
  deleteComposioTrigger,
  disableComposioToolkit,
  enableComposioToolkit,
  getComposioTriggers,
  getComposioToolkit,
  getComposioToolkits,
  updateComposioTrigger,
  updateComposioToolPermission,
  verifyComposioCallback,
} from '../services/composio.service';

export const composioToolkitsQueryKey = ['composio-toolkits'] as const;
export const composioTriggersQueryKey = ['composio-triggers'] as const;

export function useGetComposioToolkits(organizationUuid?: string, filters?: ComposioToolkitFilters) {
  return useQuery({
    queryKey: [...composioToolkitsQueryKey, organizationUuid, filters],
    queryFn: () => getComposioToolkits(organizationUuid as string, filters),
    enabled: !!organizationUuid,
  });
}

export function useGetComposioToolkit(organizationUuid?: string, toolkitSlug?: string) {
  return useQuery({
    queryKey: [...composioToolkitsQueryKey, organizationUuid, toolkitSlug],
    queryFn: () => getComposioToolkit(organizationUuid as string, toolkitSlug as string),
    enabled: !!organizationUuid && !!toolkitSlug,
  });
}

export function useConnectComposioToolkit(organizationUuid?: string) {
  return useMutation({
    mutationFn: (toolkitSlug: string) => connectComposioToolkit(organizationUuid as string, toolkitSlug),
    onSuccess: (response) => {
      window.location.assign(response.redirect_url);
    },
    onError: (error: Error) => {
      toast({ title: 'Could not connect toolkit', description: error.message, variant: 'error' });
    },
  });
}

export function useEnableComposioToolkit(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (toolkitSlug: string) => enableComposioToolkit(organizationUuid as string, toolkitSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: composioToolkitsQueryKey });
      toast({ title: 'Toolkit enabled', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not enable toolkit', description: error.message, variant: 'error' });
    },
  });
}

export function useDisableComposioToolkit(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (toolkitSlug: string) => disableComposioToolkit(organizationUuid as string, toolkitSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: composioToolkitsQueryKey });
      toast({ title: 'Toolkit disabled', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not disable toolkit', description: error.message, variant: 'error' });
    },
  });
}

export function useVerifyComposioCallback(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      toolkitSlug,
      connectionRequestId,
    }: {
      toolkitSlug: string;
      connectionRequestId?: string;
    }) => verifyComposioCallback(organizationUuid as string, toolkitSlug, connectionRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: composioToolkitsQueryKey });
      toast({ title: 'Connection verified', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not verify connection', description: error.message, variant: 'error' });
    },
  });
}

export function useUpdateComposioToolPermission(organizationUuid?: string, toolkitSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      toolSlug,
      payload,
    }: {
      toolSlug: string;
      payload: { enabled?: boolean; requires_approval?: boolean; required_permission_key?: string | null };
    }) => updateComposioToolPermission(organizationUuid as string, toolSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: composioToolkitsQueryKey });
      queryClient.invalidateQueries({ queryKey: [...composioToolkitsQueryKey, organizationUuid, toolkitSlug] });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update tool', description: error.message, variant: 'error' });
    },
  });
}

export function useGetComposioTriggers(organizationUuid?: string) {
  return useQuery({
    queryKey: [...composioTriggersQueryKey, organizationUuid],
    queryFn: () => getComposioTriggers(organizationUuid as string),
    enabled: !!organizationUuid,
  });
}

export function useCreateComposioTrigger(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      toolkit_slug: string;
      trigger_slug: string;
      connected_account_id: string;
      config?: Record<string, unknown>;
    }) => createComposioTrigger(organizationUuid as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: composioTriggersQueryKey });
      toast({ title: 'Trigger created', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not create trigger', description: error.message, variant: 'error' });
    },
  });
}

export function useUpdateComposioTrigger(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      triggerUuid,
      payload,
    }: {
      triggerUuid: string;
      payload: { is_enabled?: boolean; config?: Record<string, unknown> };
    }) => updateComposioTrigger(organizationUuid as string, triggerUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: composioTriggersQueryKey });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update trigger', description: error.message, variant: 'error' });
    },
  });
}

export function useDeleteComposioTrigger(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (triggerUuid: string) => deleteComposioTrigger(organizationUuid as string, triggerUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: composioTriggersQueryKey });
      toast({ title: 'Trigger deleted', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not delete trigger', description: error.message, variant: 'error' });
    },
  });
}
