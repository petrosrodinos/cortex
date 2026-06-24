import { useMemo, useState } from 'react';
import { Check, Pencil, Plus, Shield, Trash2, X } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useGetPermissions } from '@/features/permissions/hooks/use-permissions';
import type { Permission } from '@/features/permissions/interfaces/permission.interfaces';
import { useCreateRole, useDeleteRole, useGetRoles, useSetRolePermissions, useUpdateRole } from '@/features/roles/hooks/use-roles';
import { OrganizationRoleTypes, type OrganizationRole } from '@/features/roles/interfaces/role.interfaces';
import { cn } from '@/lib/utils';
import { OrganizationPermissionGate } from '@/components/permissions/organization-permission-gate';
import { PermissionKeys } from '@/features/permissions/interfaces/permission.interfaces';
import { useOrganizationStore } from '@/stores/organization';

type DeleteRoleTarget = { uuid: string; label: string } | null;

export function RolesPermissionsSection() {
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const [roleName, setRoleName] = useState('');
  const [editingRoleUuid, setEditingRoleUuid] = useState<string | null>(null);
  const [editingRoleName, setEditingRoleName] = useState('');
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

  const permissionGroups = useMemo(() => {
    const map: Record<string, Permission[]> = {};
    for (const permission of permissions) {
      const group = permission.group ?? 'General';
      (map[group] ??= []).push(permission);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [permissions]);

  async function createRole(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentOrganization || !roleName.trim()) return;
    setIsBusy(true);
    setError(null);
    try {
      await createRoleMutation.mutateAsync({ name: roleName.trim(), permission_keys: [] });
      setRoleName('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to create role');
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
      setError(err instanceof Error ? err.message : 'Unable to update role');
    } finally {
      setIsBusy(false);
    }
  }

  async function toggleRolePermission(role: OrganizationRole, permissionKey: string) {
    if (!currentOrganization || role.name === OrganizationRoleTypes.OWNER) return;
    const keys = role.permissions?.map((item) => item.permission.key) ?? [];
    const nextKeys = keys.includes(permissionKey)
      ? keys.filter((k) => k !== permissionKey)
      : [...keys, permissionKey];
    setIsBusy(true);
    setError(null);
    try {
      await setRolePermissionsMutation.mutateAsync({
        organization_role_uuid: role.uuid,
        permission_keys: nextKeys,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to update permissions');
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
      setError(err instanceof Error ? err.message : 'Unable to delete role');
    } finally {
      setIsBusy(false);
      setDeleteTarget(null);
    }
  }

  if (!currentOrganization) return null;

  return (
    <div className="flex flex-col gap-4">
      <OrganizationPermissionGate permission={PermissionKeys.ORG_ROLES_CREATE}>
        <form onSubmit={createRole} className="flex gap-2">
          <input
            value={roleName}
            onChange={(event) => setRoleName(event.target.value)}
            placeholder="New role name"
            className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted outline-none transition-all focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="submit"
            disabled={loading || !roleName.trim()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3 text-sm font-medium text-accent-foreground disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Create role
          </button>
        </form>
      </OrganizationPermissionGate>

      {(error || queryError) && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
          {error ?? queryError}
        </p>
      )}

      {rolesQuery.isLoading || permissionsQuery.isLoading ? (
        <MatrixSkeleton />
      ) : roles.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
          <Shield className="h-8 w-8 text-muted" />
          <p className="text-sm font-medium text-foreground">No roles yet</p>
          <p className="text-sm text-muted">Create a role to manage member access.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="sticky left-0 z-10 min-w-[200px] bg-surface px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                  Permission
                </th>
                {roles.map((role) => (
                  <th
                    key={role.uuid}
                    className="min-w-[130px] px-3 py-3 text-center align-top"
                  >
                    {editingRoleUuid === role.uuid ? (
                      <OrganizationPermissionGate permission={PermissionKeys.ORG_ROLES_UPDATE}>
                        <div className="flex items-center justify-center gap-1">
                          <input
                            value={editingRoleName}
                            onChange={(e) => setEditingRoleName(e.target.value)}
                            autoFocus
                            className="h-7 w-24 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-accent"
                          />
                          <button
                            type="button"
                            onClick={() => saveRoleName(role)}
                            disabled={loading || !editingRoleName.trim()}
                            title="Save"
                            className="grid h-7 w-7 place-items-center rounded text-muted hover:text-foreground disabled:opacity-50"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => { setEditingRoleUuid(null); setEditingRoleName(''); }}
                            title="Cancel"
                            className="grid h-7 w-7 place-items-center rounded text-muted hover:text-foreground"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </OrganizationPermissionGate>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-xs font-semibold text-foreground">{role.name}</span>
                        {!role.is_system ? (
                          <div className="flex items-center gap-0.5">
                            <OrganizationPermissionGate permission={PermissionKeys.ORG_ROLES_UPDATE}>
                              <button
                                type="button"
                                onClick={() => startEditingRole(role)}
                                title="Rename role"
                                className="grid h-6 w-6 place-items-center rounded text-muted hover:bg-surface-secondary hover:text-foreground"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                            </OrganizationPermissionGate>
                            <OrganizationPermissionGate permission={PermissionKeys.ORG_ROLES_DELETE}>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget({ uuid: role.uuid, label: role.name })}
                                title="Delete role"
                                className="grid h-6 w-6 place-items-center rounded text-muted hover:bg-surface-secondary hover:text-red-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </OrganizationPermissionGate>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <OrganizationPermissionGate permission={PermissionKeys.ORG_ROLES_UPDATE}>
              {(allowed) => (
                <tbody>
              {permissionGroups.map(([group, groupPermissions]) => (
                <>
                  <tr key={`group-${group}`}>
                    <td
                      colSpan={roles.length + 1}
                      className="sticky left-0 border-b border-border/50 bg-surface-secondary px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-muted"
                    >
                      {group}
                    </td>
                  </tr>
                  {groupPermissions.map((permission, permIndex) => (
                    <tr
                      key={permission.key}
                      className={cn(
                        'group transition-colors hover:bg-surface',
                        permIndex < groupPermissions.length - 1 && 'border-b border-border/40',
                      )}
                    >
                      <td className="sticky left-0 z-10 bg-background px-4 py-3 text-sm text-foreground group-hover:bg-surface">
                        {permission.label}
                      </td>
                      {roles.map((role) => {
                        const isOwnerRole = role.name === OrganizationRoleTypes.OWNER;
                        const checked =
                          role.permissions?.some((p) => p.permission.key === permission.key) ?? false;
                        return (
                          <td key={role.uuid} className="px-3 py-3 text-center">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={checked}
                              aria-label={`${permission.label} for ${role.name}`}
                              disabled={loading || !allowed || isOwnerRole}
                              onClick={() => toggleRolePermission(role, permission.key)}
                              className={cn(
                                'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors',
                                checked ? 'bg-accent' : 'bg-border',
                                (loading || isOwnerRole) && 'cursor-not-allowed opacity-60',
                              )}
                            >
                              <span
                                className={cn(
                                  'pointer-events-none block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform',
                                  checked && 'translate-x-4',
                                )}
                              />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              ))}
                </tbody>
              )}
            </OrganizationPermissionGate>
          </table>
        </div>
      )}

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        title="Delete role"
        description={
          deleteTarget
            ? `Delete the "${deleteTarget.label}" role? Members assigned this role may need to be updated.`
            : ''
        }
        confirmLabel="Delete role"
        loading={loading}
        onConfirm={deleteRole}
        onOpenChange={(open) => {
          if (!open && !loading) setDeleteTarget(null);
        }}
      />
    </div>
  );
}

function MatrixSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-[200px_repeat(3,_1fr)] border-b border-border bg-surface px-4 py-3 gap-4">
        <SkeletonLine className="h-4 w-24" />
        {[0, 1, 2].map((i) => <SkeletonLine key={i} className="h-4 w-16 mx-auto" />)}
      </div>
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="grid grid-cols-[200px_repeat(3,_1fr)] items-center border-b border-border/40 px-4 py-3 gap-4 last:border-0">
          <SkeletonLine className="h-4 w-36" />
          {[0, 1, 2].map((col) => <SkeletonLine key={col} className="h-5 w-9 mx-auto rounded-full" />)}
        </div>
      ))}
    </div>
  );
}

function SkeletonLine({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-surface-secondary ${className}`} />;
}
