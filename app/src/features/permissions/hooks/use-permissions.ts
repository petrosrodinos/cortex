import { useQuery } from '@tanstack/react-query';
import type { PermissionsQuery } from '../interfaces/permission.interfaces';
import { getPermissions } from '../services/permissions.services';

export const permissionsQueryKey = ['permissions'] as const;

export function useGetPermissions(query?: PermissionsQuery) {
  return useQuery({
    queryKey: [...permissionsQueryKey, query],
    queryFn: () => getPermissions(query),
  });
}
