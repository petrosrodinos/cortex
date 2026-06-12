import { useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useGetPermissions } from '@/features/permissions/hooks/use-permissions';
import { useCreateRole, useDeleteRole, useGetRoles, useSetRolePermissions, useUpdateRole } from '@/features/roles/hooks/use-roles';
import type { OrganizationRole } from '@/features/roles/interfaces/role.interfaces';
import { useOrganizationStore } from '@/stores/organization';

export default function RolesPage() {
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const [name, setName] = useState('');
  const [editingRoleUuid, setEditingRoleUuid] = useState<string | null>(null);
  const [editingRoleName, setEditingRoleName] = useState('');
  const rolesQuery = useGetRoles(currentOrganization?.uuid);
  const permissionsQuery = useGetPermissions();
  const createRoleMutation = useCreateRole(currentOrganization?.uuid);
  const updateRoleMutation = useUpdateRole(currentOrganization?.uuid);
  const setRolePermissionsMutation = useSetRolePermissions(currentOrganization?.uuid);
  const deleteRoleMutation = useDeleteRole();
  const roles = rolesQuery.data ?? [];
  const permissions = permissionsQuery.data ?? [];
  const loading =
    rolesQuery.isLoading ||
    permissionsQuery.isLoading ||
    createRoleMutation.isPending ||
    updateRoleMutation.isPending ||
    setRolePermissionsMutation.isPending ||
    deleteRoleMutation.isPending;
  const error = rolesQuery.error?.message ?? permissionsQuery.error?.message ?? null;

  async function createRole(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentOrganization || !name.trim()) return;

    try {
      await createRoleMutation.mutateAsync({
        name: name.trim(),
        permission_keys: [],
      });
      setName('');
    } catch {
      return;
    }
  }

  function startEditingRole(role: OrganizationRole) {
    setEditingRoleUuid(role.uuid);
    setEditingRoleName(role.name);
  }

  async function saveRoleName(role: OrganizationRole) {
    if (!currentOrganization || !editingRoleName.trim()) return;

    try {
      await updateRoleMutation.mutateAsync({
        organization_role_uuid: role.uuid,
        payload: { name: editingRoleName.trim() },
      });
      setEditingRoleUuid(null);
      setEditingRoleName('');
    } catch {
      return;
    }
  }

  async function toggleRolePermission(role: OrganizationRole, permissionKey: string) {
    if (!currentOrganization || role.is_system) return;
    const keys = role.permissions?.map((item) => item.permission.key) ?? [];
    const nextKeys = keys.includes(permissionKey) ? keys.filter((key) => key !== permissionKey) : [...keys, permissionKey];
    await setRolePermissionsMutation.mutateAsync({ organization_role_uuid: role.uuid, permission_keys: nextKeys });
  }

  async function deleteRole(organization_role_uuid: string) {
    if (!currentOrganization) return;
    await deleteRoleMutation.mutateAsync({
      organization_uuid: currentOrganization.uuid,
      organization_role_uuid: organization_role_uuid,
    });
  }

  if (!currentOrganization) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <h1 className="text-lg font-semibold text-foreground">No organization selected</h1>
        <p className="mt-1 text-sm text-muted">Create or select an organization from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-foreground">Roles</h1>
        <p className="text-sm text-muted">{currentOrganization.name}</p>
      </header>

      <form onSubmit={createRole} className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Custom role name"
            className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Create role
          </button>
        </div>
      </form>

      {error && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      <div className="grid gap-3">
        {roles.map((role) => {
          const rolePermissionKeys = role.permissions?.map((item) => item.permission.key) ?? [];

          return (
            <section key={role.uuid} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {editingRoleUuid === role.uuid ? (
                    <input
                      value={editingRoleName}
                      onChange={(event) => setEditingRoleName(event.target.value)}
                      className="h-9 w-full max-w-sm rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
                    />
                  ) : (
                    <h2 className="text-sm font-semibold text-foreground">{role.name}</h2>
                  )}
                  <p className="text-xs text-muted">{role.is_system ? 'System role' : `${rolePermissionKeys.length} permissions`}</p>
                </div>
                {!role.is_system && (
                  <div className="flex shrink-0 items-center gap-1">
                    {editingRoleUuid === role.uuid ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveRoleName(role)}
                          title="Save role"
                          className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
                          disabled={loading || !editingRoleName.trim()}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRoleUuid(null);
                            setEditingRoleName('');
                          }}
                          title="Cancel edit"
                          className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEditingRole(role)}
                          title="Edit role"
                          className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs text-muted hover:bg-surface-secondary hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRole(role.uuid)}
                          title="Delete role"
                          className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs text-muted hover:bg-surface-secondary hover:text-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {permissions.map((permission) => (
                  <label
                    key={`${role.uuid}-${permission.key}`}
                    className="flex items-center gap-2 rounded-md border border-border/80 px-2 py-2 text-xs text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={rolePermissionKeys.includes(permission.key)}
                      disabled={role.is_system}
                      onChange={() => toggleRolePermission(role, permission.key)}
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    <span className="min-w-0 truncate">{permission.label}</span>
                  </label>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
