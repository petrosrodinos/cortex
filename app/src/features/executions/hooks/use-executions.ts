import { useQuery } from '@tanstack/react-query';
import { getExecution, listExecutions } from '../services/executions.service';

export const executionsQueryKey = ['executions'] as const;

export function useGetExecution(orgUuid?: string, executionUuid?: string) {
  return useQuery({
    queryKey: [...executionsQueryKey, orgUuid, executionUuid],
    queryFn: () => getExecution(orgUuid as string, executionUuid as string),
    enabled: !!orgUuid && !!executionUuid,
  });
}

export function useGetExecutions(orgUuid?: string) {
  return useQuery({
    queryKey: [...executionsQueryKey, orgUuid],
    queryFn: () => listExecutions(orgUuid as string),
    enabled: !!orgUuid,
  });
}
