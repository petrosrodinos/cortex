import { PermissionKeys, type PermissionKey } from '@/features/permissions/interfaces/permission.interfaces';
import { OrganizationRoleTypes } from '@/features/roles/interfaces/role.interfaces';

export type OrganizationPermissionContext = {
  organizationRole: string | null;
  organizationPermissions: string[];
};

export function hasOrganizationPermission(
  context: OrganizationPermissionContext,
  requiredKey: string,
): boolean {
  if (context.organizationRole === OrganizationRoleTypes.OWNER) {
    return true;
  }

  return context.organizationPermissions.includes(requiredKey);
}

export function hasAnyOrganizationPermission(
  context: OrganizationPermissionContext,
  requiredKeys: string[],
): boolean {
  return requiredKeys.some((key) => hasOrganizationPermission(context, key));
}

export function hasAllOrganizationPermissions(
  context: OrganizationPermissionContext,
  requiredKeys: string[],
): boolean {
  return requiredKeys.every((key) => hasOrganizationPermission(context, key));
}

export function canAccessByRole(
  userRole: string | null,
  allowedRoles: readonly string[] | undefined,
): boolean {
  if (!allowedRoles?.length) {
    return true;
  }

  return Boolean(userRole && allowedRoles.includes(userRole));
}

export function canAccessNavItem(
  item: { roles?: readonly string[]; permission?: PermissionKey },
  context: OrganizationPermissionContext & { userRole: string | null },
): boolean {
  if (!canAccessByRole(context.userRole, item.roles)) {
    return false;
  }

  if (item.permission && !hasOrganizationPermission(context, item.permission)) {
    return false;
  }

  return true;
}

export { PermissionKeys, type PermissionKey };
