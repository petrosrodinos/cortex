import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type {
  CreateIntegrationDto,
  ToggleIntegrationActionDto,
  UpdateIntegrationDto,
} from '../interfaces/integration.interface';
import {
  createIntegration,
  deleteIntegration,
  getIntegration,
  getIntegrationActions,
  getIntegrations,
  testIntegration,
  toggleIntegrationAction,
  updateIntegration,
} from '../services/integrations.service';

export const integrationsQueryKey = ['integrations'] as const;

export function useGetIntegrations(organizationUuid?: string) {
  return useQuery({
    queryKey: [...integrationsQueryKey, organizationUuid],
    queryFn: () => getIntegrations(organizationUuid as string),
    enabled: !!organizationUuid,
  });
}

export function useGetIntegration(organizationUuid?: string, integrationUuid?: string) {
  return useQuery({
    queryKey: [...integrationsQueryKey, organizationUuid, integrationUuid],
    queryFn: () => getIntegration(organizationUuid as string, integrationUuid as string),
    enabled: !!organizationUuid && !!integrationUuid,
  });
}

export function useCreateIntegration(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateIntegrationDto) => createIntegration(organizationUuid as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationsQueryKey });
      toast({ title: 'Integration created', description: 'The integration has been connected.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not create integration', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useUpdateIntegration(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ integration_uuid, payload }: { integration_uuid: string; payload: UpdateIntegrationDto }) =>
      updateIntegration(organizationUuid as string, integration_uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationsQueryKey });
      toast({ title: 'Integration updated', description: 'The integration changes were saved.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update integration', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useDeleteIntegration(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ integration_uuid }: { integration_uuid: string }) =>
      deleteIntegration(organizationUuid as string, integration_uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationsQueryKey });
      toast({ title: 'Integration removed', description: 'The integration has been deleted.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not remove integration', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useTestIntegration(organizationUuid?: string) {
  return useMutation({
    mutationFn: ({ integration_uuid }: { integration_uuid: string }) => testIntegration(organizationUuid as string, integration_uuid),
    onError: (error: Error) => {
      toast({ title: 'Could not test integration', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useGetIntegrationActions(organizationUuid?: string, integrationUuid?: string) {
  return useQuery({
    queryKey: [...integrationsQueryKey, organizationUuid, integrationUuid, 'actions'],
    queryFn: () => getIntegrationActions(organizationUuid as string, integrationUuid as string),
    enabled: !!organizationUuid && !!integrationUuid,
  });
}

export function useToggleIntegrationAction(organizationUuid?: string, integrationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ action_uuid, payload }: { action_uuid: string; payload: ToggleIntegrationActionDto }) =>
      toggleIntegrationAction(organizationUuid as string, integrationUuid as string, action_uuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationsQueryKey });
      toast({ title: 'Action updated', description: 'The agent tool availability was changed.', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update action', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}
