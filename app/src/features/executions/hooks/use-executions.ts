import { useQuery } from '@tanstack/react-query';
import type { UsageQuery } from '../interfaces/usage.interfaces';
import { getExecution, getUsage, getUsageRecords, listExecutions } from '../services/executions.service';

export const executionsQueryKey = ['executions'] as const;
export const usageQueryKey = ['usage'] as const;

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

export function useGetUsage(orgUuid?: string, query?: UsageQuery) {
  return useQuery({
    queryKey: [...usageQueryKey, orgUuid, query],
    queryFn: () => getUsage(orgUuid as string, query),
    enabled: !!orgUuid,
  });
}

export function useGetUsageRecords(orgUuid?: string, query?: UsageQuery) {
  return useQuery({
    queryKey: [...usageQueryKey, 'records', orgUuid, query],
    queryFn: () => getUsageRecords(orgUuid as string, query),
    enabled: !!orgUuid,
  });
}
