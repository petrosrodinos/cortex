import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type {
  CreateDatabaseIntegrationDto,
  CreateIntegrationDto,
  CreateOpenApiIntegrationDto,
  ParseOpenApiSpecDto,
  TestDatabaseConnectionDto,
  ToggleIntegrationActionDto,
  UpdateIntegrationDto,
} from '../interfaces/integration.interface';
import {
  createDatabaseIntegration,
  createIntegration,
  createOpenApiIntegration,
  getDatabaseIntegrationDetails,
  getIntegration,
  getIntegrationActions,
  getIntegrations,
  getOpenApiIntegrationDetails,
  parseOpenApiSpec,
  regenerateOpenApiTools,
  syncDatabaseSchema,
  testDatabaseConnection,
  testIntegration,
  testOpenApiIntegration,
  testSavedDatabaseConnection,
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

export function useCreateDatabaseIntegration(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDatabaseIntegrationDto) => createDatabaseIntegration(organizationUuid as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationsQueryKey });
      toast({ title: 'Database connected', description: 'Schema was synced and the database is ready.', duration: 2500 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not connect database', description: error.message, variant: 'error', duration: 3500 });
    },
  });
}

export function useTestDatabaseConnection(organizationUuid?: string) {
  return useMutation({
    mutationFn: (payload: TestDatabaseConnectionDto) => testDatabaseConnection(organizationUuid as string, payload),
    onError: (error: Error) => {
      toast({ title: 'Database test failed', description: error.message, variant: 'error', duration: 3500 });
    },
  });
}

export function useGetDatabaseIntegrationDetails(organizationUuid?: string, integrationUuid?: string, enabled = true) {
  return useQuery({
    queryKey: [...integrationsQueryKey, organizationUuid, integrationUuid, 'database'],
    queryFn: () => getDatabaseIntegrationDetails(organizationUuid as string, integrationUuid as string),
    enabled: enabled && !!organizationUuid && !!integrationUuid,
  });
}

export function useSyncDatabaseSchema(organizationUuid?: string, integrationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => syncDatabaseSchema(organizationUuid as string, integrationUuid as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationsQueryKey });
      toast({ title: 'Schema synced', description: 'The cached schema was refreshed.', duration: 2500 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not sync schema', description: error.message, variant: 'error', duration: 3500 });
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

export function useTestIntegration(organizationUuid?: string) {
  return useMutation({
    mutationFn: ({ integration_uuid }: { integration_uuid: string }) => testIntegration(organizationUuid as string, integration_uuid),
    onError: (error: Error) => {
      toast({ title: 'Could not test integration', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useTestSavedDatabaseConnection(organizationUuid?: string) {
  return useMutation({
    mutationFn: ({ integration_uuid }: { integration_uuid: string }) =>
      testSavedDatabaseConnection(organizationUuid as string, integration_uuid),
    onError: (error: Error) => {
      toast({ title: 'Could not test database', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}

export function useParseOpenApiSpec(organizationUuid?: string) {
  return useMutation({
    mutationFn: (payload: ParseOpenApiSpecDto) => parseOpenApiSpec(organizationUuid as string, payload),
    onError: (error: Error) => {
      toast({ title: 'Could not parse spec', description: error.message, variant: 'error', duration: 3500 });
    },
  });
}

export function useCreateOpenApiIntegration(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOpenApiIntegrationDto) => createOpenApiIntegration(organizationUuid as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationsQueryKey });
      toast({ title: 'OpenAPI connected', description: 'Tools were generated from the spec.', duration: 2500 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not connect OpenAPI', description: error.message, variant: 'error', duration: 3500 });
    },
  });
}

export function useGetOpenApiIntegrationDetails(organizationUuid?: string, integrationUuid?: string, enabled = true) {
  return useQuery({
    queryKey: [...integrationsQueryKey, organizationUuid, integrationUuid, 'openapi'],
    queryFn: () => getOpenApiIntegrationDetails(organizationUuid as string, integrationUuid as string),
    enabled: enabled && !!organizationUuid && !!integrationUuid,
  });
}

export function useRegenerateOpenApiTools(organizationUuid?: string, integrationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => regenerateOpenApiTools(organizationUuid as string, integrationUuid as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationsQueryKey });
      toast({ title: 'Tools regenerated', description: 'OpenAPI actions were refreshed.', duration: 2500 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not regenerate tools', description: error.message, variant: 'error', duration: 3500 });
    },
  });
}

export function useTestOpenApiIntegration(organizationUuid?: string) {
  return useMutation({
    mutationFn: ({ integration_uuid }: { integration_uuid: string }) =>
      testOpenApiIntegration(organizationUuid as string, integration_uuid),
    onError: (error: Error) => {
      toast({ title: 'Could not test OpenAPI', description: error.message, variant: 'error', duration: 3000 });
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
