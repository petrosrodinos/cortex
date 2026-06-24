import { OrganizationRoleTypes } from '@/modules/roles/permissions';

export function hasOrganizationPermission(
  permissions: string[] | undefined,
  organizationRole: string | undefined | null,
  requiredKey: string,
): boolean {
  if (organizationRole === OrganizationRoleTypes.OWNER) {
    return true;
  }

  return permissions?.includes(requiredKey) ?? false;
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
