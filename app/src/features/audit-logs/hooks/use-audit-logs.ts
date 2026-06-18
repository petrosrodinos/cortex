import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '../services/audit-logs.services';

export const auditLogsQueryKey = ['audit-logs'] as const;

export function useGetAuditLogs(orgUuid?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [...auditLogsQueryKey, orgUuid, page, limit],
    queryFn: () => getAuditLogs(orgUuid as string, page, limit),
    enabled: !!orgUuid,
  });
}
