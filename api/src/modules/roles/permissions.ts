export const PERMISSIONS = [
  { key: 'org:read', label: 'View organization', group: 'org' },
  { key: 'org:update', label: 'Update organization', group: 'org' },
  { key: 'org:delete', label: 'Delete organization', group: 'org' },
  { key: 'org:members:read', label: 'View members', group: 'org' },
  { key: 'org:members:invite', label: 'Invite members', group: 'org' },
  { key: 'org:members:update', label: 'Update members', group: 'org' },
  { key: 'org:members:remove', label: 'Remove members', group: 'org' },
  { key: 'org:roles:read', label: 'View roles', group: 'org' },
  { key: 'org:roles:create', label: 'Create roles', group: 'org' },
  { key: 'org:roles:update', label: 'Update roles', group: 'org' },
  { key: 'org:roles:delete', label: 'Delete roles', group: 'org' },
  { key: 'integrations:github:read_repos', label: 'Read GitHub repositories', group: 'integrations' },
  { key: 'integrations:github:connect', label: 'Connect GitHub', group: 'integrations' },
  { key: 'integrations:stripe:manage', label: 'Manage Stripe', group: 'integrations' },
  { key: 'ai:prompts:read', label: 'View AI prompts', group: 'ai' },
  { key: 'ai:prompts:write', label: 'Manage AI prompts', group: 'ai' },
  { key: 'ai:usage:read', label: 'View AI usage', group: 'ai' },
  { key: 'files:read', label: 'View files', group: 'files' },
  { key: 'files:write', label: 'Upload and edit files', group: 'files' },
  { key: 'files:delete', label: 'Delete files', group: 'files' },
] as const;

export const SYSTEM_ROLE_NAMES = ['Owner', 'Admin', 'Manager', 'Employee'] as const;

export const SYSTEM_ROLE_PERMISSIONS: Record<(typeof SYSTEM_ROLE_NAMES)[number], string[]> = {
  Owner: PERMISSIONS.map((permission) => permission.key),
  Admin: PERMISSIONS.filter((permission) => permission.key !== 'org:delete').map((permission) => permission.key),
  Manager: [
    'org:read',
    'org:members:read',
    'org:roles:read',
    'integrations:github:read_repos',
    'ai:prompts:read',
    'ai:usage:read',
    'files:read',
    'files:write',
  ],
  Employee: ['org:read', 'integrations:github:read_repos', 'ai:prompts:read', 'files:read'],
};
