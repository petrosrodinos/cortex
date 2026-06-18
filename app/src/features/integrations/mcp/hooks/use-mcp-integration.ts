import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { CreateMcpIntegrationDto, TestMcpConnectionDto } from '../interfaces/mcp.interface';
import {
  createMcpIntegration,
  getMcpIntegrationDetails,
  syncMcpTools,
  testMcpConnection,
  testMcpIntegration,
} from '../services/mcp.service';
import { integrationsQueryKey } from '../../common/hooks/use-integrations';

export function useTestMcpConnection(organizationUuid?: string) {
  return useMutation({
    mutationFn: (payload: TestMcpConnectionDto) => testMcpConnection(organizationUuid as string, payload),
    onError: (error: Error) => {
      toast({ title: 'MCP test failed', description: error.message, variant: 'error', duration: 3500 });
    },
  });
}

export function useCreateMcpIntegration(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMcpIntegrationDto) => createMcpIntegration(organizationUuid as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationsQueryKey });
      toast({ title: 'MCP connected', description: 'Tools were discovered from the server.', duration: 2500 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not connect MCP', description: error.message, variant: 'error', duration: 3500 });
    },
  });
}

export function useGetMcpIntegrationDetails(organizationUuid?: string, integrationUuid?: string, enabled = true) {
  return useQuery({
    queryKey: [...integrationsQueryKey, organizationUuid, integrationUuid, 'mcp'],
    queryFn: () => getMcpIntegrationDetails(organizationUuid as string, integrationUuid as string),
    enabled: enabled && !!organizationUuid && !!integrationUuid,
  });
}

export function useSyncMcpTools(organizationUuid?: string, integrationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => syncMcpTools(organizationUuid as string, integrationUuid as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationsQueryKey });
      toast({ title: 'Tools synced', description: 'MCP actions were refreshed.', duration: 2500 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not sync tools', description: error.message, variant: 'error', duration: 3500 });
    },
  });
}

export function useTestMcpIntegration(organizationUuid?: string) {
  return useMutation({
    mutationFn: ({ integration_uuid }: { integration_uuid: string }) =>
      testMcpIntegration(organizationUuid as string, integration_uuid),
    onError: (error: Error) => {
      toast({ title: 'Could not test MCP', description: error.message, variant: 'error', duration: 3000 });
    },
  });
}
