import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { conversationsQueryKey } from '@/features/conversations/hooks/use-conversations';
import type { CreateAgentDto, UpdateAgentDto } from '../interfaces/agents.interfaces';
import {
  createAgent,
  deleteAgent,
  getAgent,
  getAgents,
  updateAgent,
} from '../services/agents.services';

export const agentsQueryKey = ['agents'] as const;

export function useGetAgents(organizationUuid?: string) {
  return useQuery({
    queryKey: [...agentsQueryKey, organizationUuid],
    queryFn: () => getAgents(organizationUuid!),
    enabled: !!organizationUuid,
  });
}

export function useGetAgent(organizationUuid?: string, agentUuid?: string) {
  return useQuery({
    queryKey: [...agentsQueryKey, organizationUuid, agentUuid],
    queryFn: () => getAgent(organizationUuid!, agentUuid!),
    enabled: !!organizationUuid && !!agentUuid,
  });
}

export function useCreateAgent(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAgentDto) => createAgent(organizationUuid!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentsQueryKey });
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
      toast({
        title: 'Agent created',
        description: 'Your agent will run on the configured schedule.',
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Could not create agent',
        description: error.message,
        variant: 'error',
        duration: 3000,
      });
    },
  });
}

export function useUpdateAgent(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentUuid,
      payload,
    }: {
      agentUuid: string;
      payload: UpdateAgentDto;
    }) => updateAgent(organizationUuid!, agentUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentsQueryKey });
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
      toast({
        title: 'Agent updated',
        description: 'Your changes were saved.',
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Could not update agent',
        description: error.message,
        variant: 'error',
        duration: 3000,
      });
    },
  });
}

export function useDeleteAgent(organizationUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentUuid: string) => deleteAgent(organizationUuid!, agentUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentsQueryKey });
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
      toast({
        title: 'Agent deleted',
        description: 'The agent and its conversation were removed.',
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Could not delete agent',
        description: error.message,
        variant: 'error',
        duration: 3000,
      });
    },
  });
}

export function useToggleAgent(organizationUuid?: string) {
  const updateMutation = useUpdateAgent(organizationUuid);

  return useMutation({
    mutationFn: ({
      agentUuid,
      is_enabled,
    }: {
      agentUuid: string;
      is_enabled: boolean;
    }) =>
      updateMutation.mutateAsync({
        agentUuid,
        payload: { is_enabled },
      }),
  });
}
