import { useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useGetPermissions } from '@/features/permissions/hooks/use-permissions';
import { useCreateRole, useDeleteRole, useGetRoles, useSetRolePermissions, useUpdateRole } from '@/features/roles/hooks/use-roles';
import type { OrganizationRole } from '@/features/roles/interfaces/role.interfaces';
import { useOrganizationStore } from '@/stores/organization';

export default function RolesPage() {
  const current_organization = useOrganizationStore((state) => state.current_organization);
  const [name, set_name] = useState('');
  const [editing_role_uuid, set_editing_role_uuid] = useState<string | null>(null);
  const [editing_role_name, set_editing_role_name] = useState('');
  const roles_query = useGetRoles(current_organization?.uuid);
  const permissions_query = useGetPermissions();
  const create_role_mutation = useCreateRole(current_organization?.uuid);
  const update_role_mutation = useUpdateRole(current_organization?.uuid);
  const set_role_permissions_mutation = useSetRolePermissions(current_organization?.uuid);
  const delete_role_mutation = useDeleteRole();
  const roles = roles_query.data ?? [];
  const permissions = permissions_query.data ?? [];
  const loading =
    roles_query.isLoading ||
    permissions_query.isLoading ||
    create_role_mutation.isPending ||
    update_role_mutation.isPending ||
    set_role_permissions_mutation.isPending ||
    delete_role_mutation.isPending;
  const error = roles_query.error?.message ?? permissions_query.error?.message ?? null;

  async function createRole(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current_organization || !name.trim()) return;

    try {
      await create_role_mutation.mutateAsync({
        name: name.trim(),
        permission_keys: [],
      });
      set_name('');
    } catch {
      return;
    }
  }

  function startEditingRole(role: OrganizationRole) {
    set_editing_role_uuid(role.uuid);
    set_editing_role_name(role.name);
  }

  async function saveRoleName(role: OrganizationRole) {
    if (!current_organization || !editing_role_name.trim()) return;

    try {
      await update_role_mutation.mutateAsync({
        organization_role_uuid: role.uuid,
        payload: { name: editing_role_name.trim() },
      });
      set_editing_role_uuid(null);
      set_editing_role_name('');
    } catch {
      return;
    }
  }

  async function toggleRolePermission(role: OrganizationRole, permission_key: string) {
    if (!current_organization || role.is_system) return;
    const keys = role.permissions?.map((item) => item.permission.key) ?? [];
    const next_keys = keys.includes(permission_key) ? keys.filter((key) => key !== permission_key) : [...keys, permission_key];
    await set_role_permissions_mutation.mutateAsync({ organization_role_uuid: role.uuid, permission_keys: next_keys });
  }

  async function deleteRole(organization_role_uuid: string) {
    if (!current_organization) return;
    await delete_role_mutation.mutateAsync({
      organization_uuid: current_organization.uuid,
      organization_role_uuid: organization_role_uuid,
    });
  }

  if (!current_organization) {
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
        <p className="text-sm text-muted">{current_organization.name}</p>
      </header>

      <form onSubmit={createRole} className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={name}
            onChange={(event) => set_name(event.target.value)}
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
          const role_permission_keys = role.permissions?.map((item) => item.permission.key) ?? [];

          return (
            <section key={role.uuid} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {editing_role_uuid === role.uuid ? (
                    <input
                      value={editing_role_name}
                      onChange={(event) => set_editing_role_name(event.target.value)}
                      className="h-9 w-full max-w-sm rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
                    />
                  ) : (
                    <h2 className="text-sm font-semibold text-foreground">{role.name}</h2>
                  )}
                  <p className="text-xs text-muted">{role.is_system ? 'System role' : `${role_permission_keys.length} permissions`}</p>
                </div>
                {!role.is_system && (
                  <div className="flex shrink-0 items-center gap-1">
                    {editing_role_uuid === role.uuid ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveRoleName(role)}
                          title="Save role"
                          className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
                          disabled={loading || !editing_role_name.trim()}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            set_editing_role_uuid(null);
                            set_editing_role_name('');
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
                      checked={role_permission_keys.includes(permission.key)}
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
