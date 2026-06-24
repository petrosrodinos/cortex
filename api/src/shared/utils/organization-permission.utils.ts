import { OrganizationRoleTypes, PermissionKeys } from '@/modules/roles/permissions';

export const PERMISSION_KEY_ALIASES: Record<string, readonly string[]> = {
  [PermissionKeys.DOCUMENTS_READ]: [PermissionKeys.FILES_READ],
  [PermissionKeys.DOCUMENTS_WRITE]: [PermissionKeys.FILES_WRITE],
  [PermissionKeys.DOCUMENTS_DELETE]: [PermissionKeys.FILES_DELETE],
  [PermissionKeys.INTEGRATIONS_MANAGE]: [PermissionKeys.ORG_INTEGRATIONS_MANAGE],
  [PermissionKeys.INTEGRATIONS_CONNECT]: [PermissionKeys.ORG_INTEGRATIONS_USE],
  [PermissionKeys.AGENTS_READ]: [PermissionKeys.AI_PROMPTS_READ],
  [PermissionKeys.AGENTS_WRITE]: [PermissionKeys.AI_PROMPTS_WRITE],
};

export const DEPRECATED_TO_NEW_PERMISSION_KEYS: Record<string, string> = {
  [PermissionKeys.ORG_INTEGRATIONS_MANAGE]: PermissionKeys.INTEGRATIONS_MANAGE,
  [PermissionKeys.AI_PROMPTS_READ]: PermissionKeys.AGENTS_READ,
  [PermissionKeys.AI_PROMPTS_WRITE]: PermissionKeys.AGENTS_WRITE,
  [PermissionKeys.FILES_READ]: PermissionKeys.DOCUMENTS_READ,
  [PermissionKeys.FILES_WRITE]: PermissionKeys.DOCUMENTS_WRITE,
  [PermissionKeys.FILES_DELETE]: PermissionKeys.DOCUMENTS_DELETE,
  [PermissionKeys.ORG_INTEGRATIONS_USE]: PermissionKeys.INTEGRATIONS_CONNECT,
};

export function resolvePermissionKeys(requiredKey: string): string[] {
  return [requiredKey, ...(PERMISSION_KEY_ALIASES[requiredKey] ?? [])];
}

export function hasOrganizationPermission(
  permissions: string[] | undefined,
  organizationRole: string | undefined | null,
  requiredKey: string,
): boolean {
  if (organizationRole === OrganizationRoleTypes.OWNER) {
    return true;
  }

  const keys = resolvePermissionKeys(requiredKey);
  return keys.some((key) => permissions?.includes(key));
}

export function getMembershipPermissions(membership: {
  role: {
    name: string;
    permissions?: Array<{ permission: { key: string } }>;
  };
}): string[] {
  return membership.role.permissions?.map((rolePermission) => rolePermission.permission.key) ?? [];
}

export function membershipHasPermission(
  membership: {
    role: {
      name: string;
      permissions?: Array<{ permission: { key: string } }>;
    };
  },
  requiredKey: string,
): boolean {
  return hasOrganizationPermission(
    getMembershipPermissions(membership),
    membership.role.name,
    requiredKey,
  );
}
