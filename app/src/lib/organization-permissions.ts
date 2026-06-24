import { PermissionKeys, type PermissionKey } from '@/features/permissions/interfaces/permission.interfaces';
import { OrganizationRoleTypes } from '@/features/roles/interfaces/role.interfaces';

export const PERMISSION_KEY_ALIASES: Record<string, readonly string[]> = {
  [PermissionKeys.DOCUMENTS_READ]: [PermissionKeys.FILES_READ],
  [PermissionKeys.DOCUMENTS_WRITE]: [PermissionKeys.FILES_WRITE],
  [PermissionKeys.DOCUMENTS_DELETE]: [PermissionKeys.FILES_DELETE],
  [PermissionKeys.INTEGRATIONS_MANAGE]: [PermissionKeys.ORG_INTEGRATIONS_MANAGE],
  [PermissionKeys.INTEGRATIONS_CONNECT]: [PermissionKeys.ORG_INTEGRATIONS_USE],
  [PermissionKeys.AGENTS_READ]: [PermissionKeys.AI_PROMPTS_READ],
  [PermissionKeys.AGENTS_WRITE]: [PermissionKeys.AI_PROMPTS_WRITE],
};

export type OrganizationPermissionContext = {
  organizationRole: string | null;
  organizationPermissions: string[];
};

export function resolvePermissionKeys(requiredKey: string): string[] {
  return [requiredKey, ...(PERMISSION_KEY_ALIASES[requiredKey] ?? [])];
}

export function hasOrganizationPermission(
  context: OrganizationPermissionContext,
  requiredKey: string,
): boolean {
  if (context.organizationRole === OrganizationRoleTypes.OWNER) {
    return true;
  }

  const keys = resolvePermissionKeys(requiredKey);
  return keys.some((key) => context.organizationPermissions.includes(key));
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
