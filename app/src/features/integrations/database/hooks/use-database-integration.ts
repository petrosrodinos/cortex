import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { CreateDatabaseIntegrationDto, TestDatabaseConnectionDto } from '../interfaces/database.interface';
import {
  createDatabaseIntegration,
  getDatabaseIntegrationDetails,
  syncDatabaseSchema,
  testDatabaseConnection,
  testSavedDatabaseConnection,
} from '../services/database.service';
import { integrationsQueryKey } from '../../common/hooks/use-integrations';

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

export function useTestSavedDatabaseConnection(organizationUuid?: string) {
  return useMutation({
    mutationFn: ({ integration_uuid }: { integration_uuid: string }) =>
      testSavedDatabaseConnection(organizationUuid as string, integration_uuid),
    onError: (error: Error) => {
      toast({ title: 'Could not test database', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}
