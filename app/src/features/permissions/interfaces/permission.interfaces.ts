export const PermissionKeys = {
  ORG_READ: "org:read",
  ORG_UPDATE: "org:update",
  ORG_DELETE: "org:delete",
  ORG_MEMBERS_READ: "org:members:read",
  ORG_MEMBERS_INVITE: "org:members:invite",
  ORG_MEMBERS_UPDATE: "org:members:update",
  ORG_MEMBERS_REMOVE: "org:members:remove",
  ORG_ROLES_READ: "org:roles:read",
  ORG_ROLES_CREATE: "org:roles:create",
  ORG_ROLES_UPDATE: "org:roles:update",
  ORG_ROLES_DELETE: "org:roles:delete",
  CONVERSATIONS_READ: "conversations:read",
  CONVERSATIONS_WRITE: "conversations:write",
  CONVERSATIONS_DELETE: "conversations:delete",
  EXECUTIONS_READ: "executions:read",
  EXECUTIONS_APPROVE: "executions:approve",
  AGENTS_READ: "agents:read",
  AGENTS_WRITE: "agents:write",
  AGENTS_DELETE: "agents:delete",
  DOCUMENTS_READ: "documents:read",
  DOCUMENTS_WRITE: "documents:write",
  DOCUMENTS_DELETE: "documents:delete",
  INTEGRATIONS_READ: "integrations:read",
  INTEGRATIONS_MANAGE: "integrations:manage",
  AI_PROVIDERS_READ: "ai:providers:read",
  AI_PROVIDERS_MANAGE: "ai:providers:manage",
  AI_USAGE_READ: "ai:usage:read",
  AUDIT_READ: "audit:read",
  AI_PROMPTS_READ: "ai:prompts:read",
  AI_PROMPTS_WRITE: "ai:prompts:write",
} as const;

export type PermissionKey = (typeof PermissionKeys)[keyof typeof PermissionKeys];

export interface Permission {
  id: number;
  uuid: string;
  key: string;
  label: string;
  group: string;
}

export interface PermissionsQuery {
  search?: string;
  page?: number;
  limit?: number;
}
