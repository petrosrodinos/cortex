import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { CreateOpenApiIntegrationDto, ParseOpenApiSpecDto } from '../interfaces/openapi.interface';
import {
  createOpenApiIntegration,
  getOpenApiIntegrationDetails,
  parseOpenApiSpec,
  regenerateOpenApiTools,
  testOpenApiIntegration,
} from '../services/openapi.service';
import { integrationsQueryKey } from '../../common/hooks/use-integrations';

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
