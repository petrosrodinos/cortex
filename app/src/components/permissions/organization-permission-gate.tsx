import type { ReactNode } from 'react';
import type { PermissionKey } from '@/features/permissions/interfaces/permission.interfaces';
import { useOrganizationPermissions } from '@/hooks/use-organization-permissions';

type OrganizationPermissionGateProps = {
  permission?: PermissionKey;
  permissions?: PermissionKey[];
  mode?: 'any' | 'all';
  fallback?: ReactNode;
  children: ReactNode | ((allowed: boolean) => ReactNode);
};

export function OrganizationPermissionGate({
  permission,
  permissions,
  mode = 'any',
  fallback = null,
  children,
}: OrganizationPermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useOrganizationPermissions();

  const allowed = permissions?.length
    ? mode === 'all'
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
    : permission
      ? hasPermission(permission)
      : true;

  if (typeof children === 'function') {
    return <>{children(allowed)}</>;
  }

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
