import { useMemo } from 'react';
import { useAuthStore } from '@/stores/auth';
import {
  hasAllOrganizationPermissions,
  hasAnyOrganizationPermission,
  hasOrganizationPermission,
  type OrganizationPermissionContext,
  type PermissionKey,
} from '@/lib/organization-permissions';

export function useOrganizationPermissions() {
  const organizationRole = useAuthStore((state) => state.organization_role ?? null);
  const organizationPermissions = useAuthStore((state) => state.organization_permissions ?? []);

  const context = useMemo<OrganizationPermissionContext>(
    () => ({
      organizationRole,
      organizationPermissions,
    }),
    [organizationRole, organizationPermissions],
  );

  return useMemo(
    () => ({
      organizationRole,
      organizationPermissions,
      hasPermission: (requiredKey: PermissionKey) => hasOrganizationPermission(context, requiredKey),
      hasAnyPermission: (requiredKeys: PermissionKey[]) => hasAnyOrganizationPermission(context, requiredKeys),
      hasAllPermissions: (requiredKeys: PermissionKey[]) => hasAllOrganizationPermissions(context, requiredKeys),
    }),
    [context, organizationPermissions, organizationRole],
  );
}

export function useOrganizationPermission(requiredKey: PermissionKey): boolean {
  return useOrganizationPermissions().hasPermission(requiredKey);
}
