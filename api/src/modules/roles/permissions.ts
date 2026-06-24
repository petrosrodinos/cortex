export const PermissionKeys = {
  ORG_READ: 'org:read',
  ORG_UPDATE: 'org:update',
  ORG_DELETE: 'org:delete',
  ORG_MEMBERS_READ: 'org:members:read',
  ORG_MEMBERS_INVITE: 'org:members:invite',
  ORG_MEMBERS_UPDATE: 'org:members:update',
  ORG_MEMBERS_REMOVE: 'org:members:remove',
  ORG_ROLES_READ: 'org:roles:read',
  ORG_ROLES_CREATE: 'org:roles:create',
  ORG_ROLES_UPDATE: 'org:roles:update',
  ORG_ROLES_DELETE: 'org:roles:delete',
  CONVERSATIONS_READ: 'conversations:read',
  CONVERSATIONS_WRITE: 'conversations:write',
  CONVERSATIONS_DELETE: 'conversations:delete',
  EXECUTIONS_READ: 'executions:read',
  EXECUTIONS_APPROVE: 'executions:approve',
  AGENTS_READ: 'agents:read',
  AGENTS_WRITE: 'agents:write',
  AGENTS_DELETE: 'agents:delete',
  DOCUMENTS_READ: 'documents:read',
  DOCUMENTS_WRITE: 'documents:write',
  DOCUMENTS_DELETE: 'documents:delete',
  INTEGRATIONS_READ: 'integrations:read',
  INTEGRATIONS_MANAGE: 'integrations:manage',
  AI_PROVIDERS_READ: 'ai:providers:read',
  AI_PROVIDERS_MANAGE: 'ai:providers:manage',
  AI_USAGE_READ: 'ai:usage:read',
  AUDIT_READ: 'audit:read',
} as const;

export type PermissionKey = (typeof PermissionKeys)[keyof typeof PermissionKeys];

export const PERMISSIONS = [
  { key: PermissionKeys.ORG_READ, label: 'View organization', group: 'org' },
  { key: PermissionKeys.ORG_UPDATE, label: 'Update organization', group: 'org' },
  { key: PermissionKeys.ORG_DELETE, label: 'Delete organization', group: 'org' },
  { key: PermissionKeys.ORG_MEMBERS_READ, label: 'View members', group: 'org' },
  { key: PermissionKeys.ORG_MEMBERS_INVITE, label: 'Invite members', group: 'org' },
  { key: PermissionKeys.ORG_MEMBERS_UPDATE, label: 'Update members', group: 'org' },
  { key: PermissionKeys.ORG_MEMBERS_REMOVE, label: 'Remove members', group: 'org' },
  { key: PermissionKeys.ORG_ROLES_READ, label: 'View roles', group: 'org' },
  { key: PermissionKeys.ORG_ROLES_CREATE, label: 'Create roles', group: 'org' },
  { key: PermissionKeys.ORG_ROLES_UPDATE, label: 'Update roles', group: 'org' },
  { key: PermissionKeys.ORG_ROLES_DELETE, label: 'Delete roles', group: 'org' },
  { key: PermissionKeys.CONVERSATIONS_READ, label: 'View conversations', group: 'conversations' },
  { key: PermissionKeys.CONVERSATIONS_WRITE, label: 'Use conversations', group: 'conversations' },
  { key: PermissionKeys.CONVERSATIONS_DELETE, label: 'Delete conversations', group: 'conversations' },
  { key: PermissionKeys.EXECUTIONS_READ, label: 'View executions', group: 'executions' },
  { key: PermissionKeys.EXECUTIONS_APPROVE, label: 'Approve tool executions', group: 'executions' },
  { key: PermissionKeys.AGENTS_READ, label: 'View agents', group: 'agents' },
  { key: PermissionKeys.AGENTS_WRITE, label: 'Manage agents', group: 'agents' },
  { key: PermissionKeys.AGENTS_DELETE, label: 'Delete agents', group: 'agents' },
  { key: PermissionKeys.DOCUMENTS_READ, label: 'View documents and boards', group: 'documents' },
  { key: PermissionKeys.DOCUMENTS_WRITE, label: 'Upload and edit documents', group: 'documents' },
  { key: PermissionKeys.DOCUMENTS_DELETE, label: 'Delete documents and boards', group: 'documents' },
  { key: PermissionKeys.INTEGRATIONS_READ, label: 'View integrations', group: 'integrations' },
  { key: PermissionKeys.INTEGRATIONS_MANAGE, label: 'Manage organization integrations', group: 'integrations' },
  { key: PermissionKeys.AI_PROVIDERS_READ, label: 'View AI providers', group: 'ai' },
  { key: PermissionKeys.AI_PROVIDERS_MANAGE, label: 'Manage AI providers', group: 'ai' },
  { key: PermissionKeys.AI_USAGE_READ, label: 'View organization usage', group: 'ai' },
  { key: PermissionKeys.AUDIT_READ, label: 'View audit logs', group: 'audit' },
] as const;

export const OrganizationRoleTypes = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
} as const;

export type OrganizationRoleType = (typeof OrganizationRoleTypes)[keyof typeof OrganizationRoleTypes];

export const SYSTEM_ROLE_NAMES = [
  OrganizationRoleTypes.OWNER,
  OrganizationRoleTypes.ADMIN,
  OrganizationRoleTypes.MANAGER,
  OrganizationRoleTypes.EMPLOYEE,
] as const;

const ALL_PERMISSION_KEYS = PERMISSIONS.map((permission) => permission.key);

export const SYSTEM_ROLE_PERMISSIONS: Record<
  (typeof SYSTEM_ROLE_NAMES)[number],
  string[]
> = {
  [OrganizationRoleTypes.OWNER]: ALL_PERMISSION_KEYS,
  [OrganizationRoleTypes.ADMIN]: ALL_PERMISSION_KEYS.filter((key) => key !== PermissionKeys.ORG_DELETE),
  [OrganizationRoleTypes.MANAGER]: [
    PermissionKeys.ORG_READ,
    PermissionKeys.ORG_MEMBERS_READ,
    PermissionKeys.ORG_MEMBERS_INVITE,
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
    PermissionKeys.INTEGRATIONS_READ,
    PermissionKeys.AI_PROVIDERS_READ,
  ],
};
