import { useState } from 'react';
import { Check, ChevronDown, Pencil, Plus, Trash2, X } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useGetPermissions } from '@/features/permissions/hooks/use-permissions';
import { useCreateRole, useDeleteRole, useGetRoles, useSetRolePermissions, useUpdateRole } from '@/features/roles/hooks/use-roles';
import type { OrganizationRole } from '@/features/roles/interfaces/role.interfaces';
import { useOrganizationStore } from '@/stores/organization';

type DeleteRoleTarget = {
  uuid: string;
  label: string;
} | null;

export function RolesPermissionsSection() {
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const [roleName, setRoleName] = useState('');
  const [editingRoleUuid, setEditingRoleUuid] = useState<string | null>(null);
  const [editingRoleName, setEditingRoleName] = useState('');
  const [openRoleUuid, setOpenRoleUuid] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteRoleTarget>(null);
  const rolesQuery = useGetRoles(currentOrganization?.uuid);
  const permissionsQuery = useGetPermissions();
  const createRoleMutation = useCreateRole(currentOrganization?.uuid);
  const updateRoleMutation = useUpdateRole(currentOrganization?.uuid);
  const setRolePermissionsMutation = useSetRolePermissions(currentOrganization?.uuid);
  const deleteRoleMutation = useDeleteRole();
  const roles = rolesQuery.data ?? [];
  const permissions = permissionsQuery.data ?? [];
  const loading =
    isBusy ||
    rolesQuery.isLoading ||
    permissionsQuery.isLoading ||
    createRoleMutation.isPending ||
    updateRoleMutation.isPending ||
    setRolePermissionsMutation.isPending ||
    deleteRoleMutation.isPending;
  const queryError = rolesQuery.error?.message ?? permissionsQuery.error?.message ?? null;

  async function createRole(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentOrganization || !roleName.trim()) return;

    setIsBusy(true);
    setError(null);
    try {
      await createRoleMutation.mutateAsync({
        name: roleName.trim(),
        permission_keys: [],
      });
      setRoleName('');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to create role'));
    } finally {
      setIsBusy(false);
    }
  }

  function startEditingRole(role: OrganizationRole) {
    setEditingRoleUuid(role.uuid);
    setEditingRoleName(role.name);
  }

  async function saveRoleName(role: OrganizationRole) {
    if (!currentOrganization || !editingRoleName.trim()) return;

    setIsBusy(true);
    setError(null);
    try {
      await updateRoleMutation.mutateAsync({
        organization_role_uuid: role.uuid,
        payload: { name: editingRoleName.trim() },
      });
      setEditingRoleUuid(null);
      setEditingRoleName('');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to update role'));
    } finally {
      setIsBusy(false);
    }
  }

  async function toggleRolePermission(role: OrganizationRole, permissionKey: string) {
    if (!currentOrganization) return;

    const keys = role.permissions?.map((item) => item.permission.key) ?? [];
    const nextKeys = keys.includes(permissionKey) ? keys.filter((key) => key !== permissionKey) : [...keys, permissionKey];

    setIsBusy(true);
    setError(null);
    try {
      await setRolePermissionsMutation.mutateAsync({ organization_role_uuid: role.uuid, permission_keys: nextKeys });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to update role permissions'));
    } finally {
      setIsBusy(false);
    }
  }

  async function deleteRole() {
    if (!currentOrganization || !deleteTarget) return;

    setIsBusy(true);
    setError(null);
    try {
      await deleteRoleMutation.mutateAsync({
        organization_uuid: currentOrganization.uuid,
        organization_role_uuid: deleteTarget.uuid,
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to delete role'));
    } finally {
      setIsBusy(false);
      setDeleteTarget(null);
    }
  }

  if (!currentOrganization) return null;

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Roles and permissions</h2>
        <p className="text-xs text-muted">Create custom roles and adjust permission access.</p>
      </div>

      {(error || queryError) && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error ?? queryError}</p>}

      <form onSubmit={createRole}>
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={roleName}
            onChange={(event) => setRoleName(event.target.value)}
            placeholder="Custom role name"
            className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={loading || !roleName.trim()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Create role
          </button>
        </div>
      </form>

      {rolesQuery.isLoading || permissionsQuery.isLoading ? <RolesSkeleton /> : null}
      {!rolesQuery.isLoading && !permissionsQuery.isLoading ? (
        <div className="grid gap-3">
          {roles.map((role) => {
            const rolePermissionKeys = role.permissions?.map((item) => item.permission.key) ?? [];
            const isOpen = openRoleUuid === role.uuid;

            return (
              <section key={role.uuid} className="rounded-lg border border-border/80 bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {editingRoleUuid === role.uuid ? (
                      <input
                        value={editingRoleName}
                        onChange={(event) => setEditingRoleName(event.target.value)}
                        className="h-9 w-full max-w-sm rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
                      />
                    ) : (
                      <h3 className="text-sm font-semibold text-foreground">{role.name}</h3>
                    )}
                    <p className="text-xs text-muted">{role.is_system ? 'System role' : `${rolePermissionKeys.length} permissions`}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {editingRoleUuid === role.uuid ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveRoleName(role)}
                          title="Save role"
                          disabled={loading || !editingRoleName.trim()}
                          className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
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
                            onClick={() => setOpenRoleUuid((current) => (current === role.uuid ? null : role.uuid))}
                            title={isOpen ? 'Collapse role' : 'Expand role'}
                            className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
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
                          onClick={() => setDeleteTarget({ uuid: role.uuid, label: role.name })}
                          title="Delete role"
                          className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs text-muted hover:bg-surface-secondary hover:text-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {permissions.map((permission) => (
                      <label
                        key={`${role.uuid}-${permission.key}`}
                        className="flex items-center gap-2 rounded-md border border-border/80 px-2 py-2 text-xs text-foreground"
                      >
                        <input
                          type="checkbox"
                          checked={rolePermissionKeys.includes(permission.key)}
                          disabled={loading}
                          onChange={() => toggleRolePermission(role, permission.key)}
                          className="h-4 w-4 accent-[var(--accent)]"
                        />
                        <span className="min-w-0 truncate">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : null}

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        title="Delete role"
        description={deleteTarget ? `Delete the ${deleteTarget.label} role? Members using this role may need to be updated first.` : ''}
        confirmLabel="Delete role"
        loading={loading}
        onConfirm={deleteRole}
        onOpenChange={(open) => {
          if (!open && !loading) setDeleteTarget(null);
        }}
      />
    </section>
  );
}

function RolesSkeleton() {
  return (
    <div className="grid gap-3" aria-hidden="true">
      {[0, 1].map((role) => (
        <div key={role} className="rounded-lg border border-border/80 bg-background p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <SkeletonLine className="h-4 w-32" />
              <SkeletonLine className="mt-2 h-3 w-24" />
            </div>
            <div className="flex gap-2">
              <SkeletonLine className="h-8 w-16 rounded-md" />
              <SkeletonLine className="h-8 w-20 rounded-md" />
            </div>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((permission) => (
              <SkeletonLine key={permission} className="h-9 rounded-md" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonLine({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-surface-secondary ${className}`} />;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
