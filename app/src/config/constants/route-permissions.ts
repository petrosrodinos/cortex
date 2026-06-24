import { PermissionKeys, type PermissionKey } from '@/features/permissions/interfaces/permission.interfaces';

export type RoutePermissionRule = {
  permission?: PermissionKey;
  permissions?: PermissionKey[];
  mode?: 'any' | 'all';
};

export const DASHBOARD_ROUTE_PERMISSIONS: Record<string, RoutePermissionRule> = {
  organizations: { permission: PermissionKeys.ORG_READ },
  conversations: { permission: PermissionKeys.CONVERSATIONS_READ },
  agents: { permission: PermissionKeys.AGENTS_READ },
  boards: { permission: PermissionKeys.DOCUMENTS_READ },
  integrations: { permission: PermissionKeys.INTEGRATIONS_READ },
  'settings/usage': { permission: PermissionKeys.AI_USAGE_READ },
  'settings/audit-logs': { permission: PermissionKeys.AUDIT_READ },
  executions: { permission: PermissionKeys.EXECUTIONS_READ },
};

export function getDashboardRoutePermission(path: string): RoutePermissionRule | undefined {
  if (path in DASHBOARD_ROUTE_PERMISSIONS) {
    return DASHBOARD_ROUTE_PERMISSIONS[path];
  }

  if (path.startsWith('conversations/')) {
    return DASHBOARD_ROUTE_PERMISSIONS.conversations;
  }

  if (path.startsWith('boards/')) {
    return DASHBOARD_ROUTE_PERMISSIONS.boards;
  }

  if (path.startsWith('integrations/')) {
    return DASHBOARD_ROUTE_PERMISSIONS.integrations;
  }

  if (path.startsWith('executions/')) {
    return DASHBOARD_ROUTE_PERMISSIONS.executions;
  }

  return undefined;
}
