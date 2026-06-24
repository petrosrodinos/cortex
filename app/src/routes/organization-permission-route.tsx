import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { PermissionKey } from '@/features/permissions/interfaces/permission.interfaces';
import { useOrganizationPermissions } from '@/hooks/use-organization-permissions';
import { Routes } from '@/routes/routes';

type OrganizationPermissionRouteProps = {
  permission?: PermissionKey;
  permissions?: PermissionKey[];
  mode?: 'any' | 'all';
  fallbackPath?: string;
  children: ReactNode;
};

export default function OrganizationPermissionRoute({
  permission,
  permissions,
  mode = 'any',
  fallbackPath = Routes.dashboard.root,
  children,
}: OrganizationPermissionRouteProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useOrganizationPermissions();

  const allowed = permissions?.length
    ? mode === 'all'
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
    : permission
      ? hasPermission(permission)
      : true;

  if (!allowed) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
