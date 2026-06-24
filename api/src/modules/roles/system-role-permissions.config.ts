import { OrganizationRoleTypes, PermissionKeys } from './permissions';

export const SYSTEM_ROLE_DEFAULT_PERMISSIONS = {
  [OrganizationRoleTypes.ADMIN]: [
    PermissionKeys.ORG_READ,
    PermissionKeys.ORG_UPDATE,
    PermissionKeys.ORG_MEMBERS_READ,
    PermissionKeys.ORG_MEMBERS_INVITE,
    PermissionKeys.ORG_MEMBERS_UPDATE,
    PermissionKeys.ORG_MEMBERS_REMOVE,
    PermissionKeys.ORG_ROLES_READ,
    PermissionKeys.ORG_ROLES_CREATE,
    PermissionKeys.ORG_ROLES_UPDATE,
    PermissionKeys.ORG_ROLES_DELETE,
    PermissionKeys.CONVERSATIONS_READ,
    PermissionKeys.CONVERSATIONS_WRITE,
    PermissionKeys.CONVERSATIONS_DELETE,
    PermissionKeys.EXECUTIONS_READ,
    PermissionKeys.EXECUTIONS_APPROVE,
    PermissionKeys.AGENTS_READ,
    PermissionKeys.AGENTS_WRITE,
    PermissionKeys.AGENTS_DELETE,
    PermissionKeys.DOCUMENTS_READ,
    PermissionKeys.DOCUMENTS_WRITE,
    PermissionKeys.DOCUMENTS_DELETE,
    PermissionKeys.INTEGRATIONS_READ,
    PermissionKeys.INTEGRATIONS_MANAGE,
    PermissionKeys.AI_PROVIDERS_READ,
    PermissionKeys.AI_PROVIDERS_MANAGE,
    PermissionKeys.AI_USAGE_READ,
    PermissionKeys.AUDIT_READ,
  ],
  [OrganizationRoleTypes.MANAGER]: [
    PermissionKeys.ORG_READ,
    PermissionKeys.ORG_MEMBERS_READ,
    PermissionKeys.ORG_MEMBERS_INVITE,
    PermissionKeys.ORG_MEMBERS_UPDATE,
    PermissionKeys.ORG_ROLES_READ,
    PermissionKeys.CONVERSATIONS_READ,
    PermissionKeys.CONVERSATIONS_WRITE,
    PermissionKeys.CONVERSATIONS_DELETE,
    PermissionKeys.EXECUTIONS_READ,
    PermissionKeys.EXECUTIONS_APPROVE,
    PermissionKeys.AGENTS_READ,
    PermissionKeys.AGENTS_WRITE,
    PermissionKeys.DOCUMENTS_READ,
    PermissionKeys.DOCUMENTS_WRITE,
    PermissionKeys.INTEGRATIONS_READ,
    PermissionKeys.INTEGRATIONS_MANAGE,
    PermissionKeys.AI_PROVIDERS_READ,
    PermissionKeys.AI_USAGE_READ,
    PermissionKeys.AUDIT_READ,
  ],
  [OrganizationRoleTypes.EMPLOYEE]: [
    PermissionKeys.ORG_READ,
    PermissionKeys.ORG_MEMBERS_READ,
    PermissionKeys.CONVERSATIONS_READ,
    PermissionKeys.CONVERSATIONS_WRITE,
    PermissionKeys.EXECUTIONS_READ,
    PermissionKeys.AGENTS_READ,
    PermissionKeys.DOCUMENTS_READ,
    PermissionKeys.DOCUMENTS_WRITE,
    PermissionKeys.INTEGRATIONS_READ,
    PermissionKeys.AI_PROVIDERS_READ,
  ],
} as const;

export type SystemRoleDefaultPermissionKey =
  (typeof SYSTEM_ROLE_DEFAULT_PERMISSIONS)[keyof typeof SYSTEM_ROLE_DEFAULT_PERMISSIONS][number];

export function getInitialRolePermissionKeys(roleName: string, allPermissionKeys: string[]): string[] {
  if (roleName === OrganizationRoleTypes.OWNER) {
    return allPermissionKeys;
  }

  return [...(SYSTEM_ROLE_DEFAULT_PERMISSIONS[roleName as keyof typeof SYSTEM_ROLE_DEFAULT_PERMISSIONS] ?? [])];
}
