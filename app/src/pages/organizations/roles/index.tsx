import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { organizations_service } from '@/services/organizations.service';
import type { OrganizationRole, Permission } from '@/interfaces/organization/organization.interface';
import { useOrganizationStore } from '@/stores/organization';

export default function RolesPage() {
  const current_organization = useOrganizationStore((state) => state.current_organization);
  const [roles, set_roles] = useState<OrganizationRole[]>([]);
  const [permissions, set_permissions] = useState<Permission[]>([]);
  const [name, set_name] = useState('');
  const [selected_permissions, set_selected_permissions] = useState<string[]>([]);
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  const permissions_by_group = useMemo(() => {
    return permissions.reduce<Record<string, Permission[]>>((groups, permission) => {
      groups[permission.group] = groups[permission.group] ?? [];
      groups[permission.group].push(permission);
      return groups;
    }, {});
  }, [permissions]);

  async function load() {
    if (!current_organization) return;
    set_loading(true);
    set_error(null);
    try {
      const [role_items, permission_items] = await Promise.all([
        organizations_service.list_roles(current_organization.uuid),
        organizations_service.list_permissions(),
      ]);
      set_roles(role_items);
      set_permissions(permission_items);
    } catch (err: any) {
      set_error(err?.response?.data?.message ?? 'Unable to load roles');
    } finally {
      set_loading(false);
    }
  }

  useEffect(() => {
    load();
  }, [current_organization?.uuid]);

  async function create_role(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current_organization || !name.trim()) return;

    set_loading(true);
    set_error(null);
    try {
      await organizations_service.create_role(current_organization.uuid, {
        name: name.trim(),
        permission_keys: selected_permissions,
      });
      set_name('');
      set_selected_permissions([]);
      await load();
    } catch (err: any) {
      set_error(err?.response?.data?.message ?? 'Unable to create role');
    } finally {
      set_loading(false);
    }
  }

  async function toggle_role_permission(role: OrganizationRole, permission_key: string) {
    if (!current_organization || role.is_system) return;
    const keys = role.permissions?.map((item) => item.permission.key) ?? [];
    const next_keys = keys.includes(permission_key) ? keys.filter((key) => key !== permission_key) : [...keys, permission_key];
    await organizations_service.set_role_permissions(current_organization.uuid, role.uuid, next_keys);
    await load();
  }

  async function delete_role(organization_role_uuid: string) {
    if (!current_organization) return;
    await organizations_service.delete_role(current_organization.uuid, organization_role_uuid);
    await load();
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

      <form onSubmit={create_role} className="rounded-lg border border-border bg-surface p-4">
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
        <PermissionChecklist
          grouped_permissions={permissions_by_group}
          selected_permissions={selected_permissions}
          onToggle={(key) =>
            set_selected_permissions((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]))
          }
        />
      </form>

      {error && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      <div className="grid gap-3">
        {roles.map((role) => {
          const role_permission_keys = role.permissions?.map((item) => item.permission.key) ?? [];

          return (
            <section key={role.uuid} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{role.name}</h2>
                  <p className="text-xs text-muted">{role.is_system ? 'System role' : `${role_permission_keys.length} permissions`}</p>
                </div>
                {!role.is_system && (
                  <button
                    type="button"
                    onClick={() => delete_role(role.uuid)}
                    title="Delete role"
                    className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
                      onChange={() => toggle_role_permission(role, permission.key)}
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

function PermissionChecklist({
  grouped_permissions,
  selected_permissions,
  onToggle,
}: {
  grouped_permissions: Record<string, Permission[]>;
  selected_permissions: string[];
  onToggle: (key: string) => void;
}) {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Object.entries(grouped_permissions).map(([group, permissions]) => (
        <fieldset key={group} className="min-w-0">
          <legend className="mb-2 text-xs font-semibold uppercase text-muted">{group}</legend>
          <div className="space-y-1">
            {permissions.map((permission) => (
              <label key={permission.key} className="flex items-center gap-2 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={selected_permissions.includes(permission.key)}
                  onChange={() => onToggle(permission.key)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                <span className="min-w-0 truncate">{permission.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
