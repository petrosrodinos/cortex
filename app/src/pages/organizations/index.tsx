import { useEffect, useState } from 'react';
import { Building2, Check, Pencil, Plus, Trash2, UserPlus, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationStore } from '@/stores/organization';
import {
  useCreateOrganization,
  useDeleteOrganization,
  useGetOrganizations,
  useSwitchOrganization,
} from '@/features/organizations/hooks/use-organizations';
import type { Organization } from '@/features/organizations/interfaces/organization.interfaces';
import { useDeleteMember, useGetMembers, useInviteMember, useUpdateMember } from '@/features/members/hooks/use-members';
import {
  OrganizationMemberStatuses,
  type OrganizationMember,
} from '@/features/members/interfaces/member.interfaces';
import { useGetPermissions } from '@/features/permissions/hooks/use-permissions';
import { useCreateRole, useDeleteRole, useGetRoles, useSetRolePermissions, useUpdateRole } from '@/features/roles/hooks/use-roles';
import type { OrganizationRole } from '@/features/roles/interfaces/role.interfaces';
import { cn } from '@/lib/utils';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

type DeleteTarget =
  | { type: 'organization'; name: string }
  | { type: 'member'; uuid: string; label: string }
  | { type: 'role'; uuid: string; label: string }
  | null;

export default function OrganizationsPage() {
  const { current_organization, organizations, set_current_organization, set_organizations } = useOrganizationStore();
  const update_user = useAuthStore((state) => state.update_user);
  const [organization_name, set_organization_name] = useState('');
  const [email, set_email] = useState('');
  const [member_role_uuid, set_member_role_uuid] = useState('');
  const [role_name, set_role_name] = useState('');
  const [editing_role_uuid, set_editing_role_uuid] = useState<string | null>(null);
  const [editing_role_name, set_editing_role_name] = useState('');
  const [local_loading, set_loading] = useState(false);
  const [error, set_error] = useState<string | null>(null);
  const [delete_target, set_delete_target] = useState<DeleteTarget>(null);
  const organizations_query = useGetOrganizations();
  const members_query = useGetMembers(current_organization?.uuid);
  const roles_query = useGetRoles(current_organization?.uuid);
  const permissions_query = useGetPermissions();
  const create_organization_mutation = useCreateOrganization();
  const delete_organization_mutation = useDeleteOrganization();
  const switch_organization_mutation = useSwitchOrganization();
  const invite_member_mutation = useInviteMember(current_organization?.uuid);
  const update_member_mutation = useUpdateMember(current_organization?.uuid);
  const delete_member_mutation = useDeleteMember();
  const create_role_mutation = useCreateRole(current_organization?.uuid);
  const update_role_mutation = useUpdateRole(current_organization?.uuid);
  const set_role_permissions_mutation = useSetRolePermissions(current_organization?.uuid);
  const delete_role_mutation = useDeleteRole();
  const members = members_query.data ?? [];
  const roles = roles_query.data ?? [];
  const permissions = permissions_query.data ?? [];
  const loading =
    local_loading ||
    organizations_query.isLoading ||
    members_query.isLoading ||
    roles_query.isLoading ||
    permissions_query.isLoading ||
    create_organization_mutation.isPending ||
    delete_organization_mutation.isPending ||
    switch_organization_mutation.isPending ||
    invite_member_mutation.isPending ||
    update_member_mutation.isPending ||
    delete_member_mutation.isPending ||
    create_role_mutation.isPending ||
    update_role_mutation.isPending ||
    set_role_permissions_mutation.isPending ||
    delete_role_mutation.isPending;

  const can_delete_current_organization = Boolean(current_organization && organizations.length > 1);

  useEffect(() => {
    if (organizations_query.data) set_organizations(organizations_query.data);
  }, [organizations_query.data, set_organizations]);

  useEffect(() => {
    set_member_role_uuid((current) => {
      if (roles.some((role) => role.uuid === current)) return current;
      return roles.find((role) => role.name === 'Employee')?.uuid ?? roles[0]?.uuid ?? '';
    });
  }, [roles]);

  async function refreshManagementData() {
    await Promise.all([members_query.refetch(), roles_query.refetch(), permissions_query.refetch()]);
  }

  async function switchOrganization(organization: Organization) {
    set_loading(true);
    set_error(null);
    try {
      const scoped_auth = await switch_organization_mutation.mutateAsync({ organization_uuid: organization.uuid });
      update_user(scoped_auth);
      set_current_organization(organization);
    } catch (err: any) {
      set_error(err?.message ?? 'Unable to switch organisation');
    } finally {
      set_loading(false);
    }
  }

  async function createOrganization(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!organization_name.trim()) return;

    set_loading(true);
    set_error(null);
    try {
      const organization = await create_organization_mutation.mutateAsync({ name: organization_name.trim() });
      set_organization_name('');
      set_organizations([...organizations, organization]);
      await switchOrganization(organization);
    } catch (err: any) {
      set_error(err?.message ?? 'Unable to create organisation');
    } finally {
      set_loading(false);
    }
  }

  async function deleteCurrentOrganization() {
    if (!current_organization || organizations.length <= 1) {
      set_error('You must keep at least one organisation');
      set_delete_target(null);
      return;
    }
    const next_organizations = organizations.filter((organization) => organization.uuid !== current_organization.uuid);

    set_loading(true);
    set_error(null);
    try {
      await delete_organization_mutation.mutateAsync({ organization_uuid: current_organization.uuid });
      set_organizations(next_organizations);
      const next_organization = next_organizations[0] ?? null;
      if (next_organization) {
        await switchOrganization(next_organization);
      } else {
        set_current_organization(null);
      }
    } catch (err: any) {
      set_error(err?.message ?? 'Unable to delete organisation');
    } finally {
      set_loading(false);
      set_delete_target(null);
    }
  }

  async function inviteMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current_organization || !email.trim() || !member_role_uuid) return;

    set_loading(true);
    set_error(null);
    try {
      await invite_member_mutation.mutateAsync({
        email: email.trim(),
        organization_role_uuid: member_role_uuid,
      });
      set_email('');
      await refreshManagementData();
    } catch (err: any) {
      set_error(err?.message ?? 'Unable to invite member');
    } finally {
      set_loading(false);
    }
  }

  async function updateMember(member: OrganizationMember, next_role_uuid?: string, next_status?: OrganizationMember['status']) {
    if (!current_organization) return;
    await update_member_mutation.mutateAsync({
      organization_member_uuid: member.uuid,
      payload: {
        organization_role_uuid: next_role_uuid,
        status: next_status,
      },
    });
    await refreshManagementData();
  }

  async function removeMember(member_uuid: string) {
    if (!current_organization) return;
    set_loading(true);
    set_error(null);
    try {
      await delete_member_mutation.mutateAsync({
        organization_uuid: current_organization.uuid,
        organization_member_uuid: member_uuid,
      });
      await refreshManagementData();
    } catch (err: any) {
      set_error(err?.message ?? 'Unable to remove member');
    } finally {
      set_loading(false);
      set_delete_target(null);
    }
  }

  async function createRole(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current_organization || !role_name.trim()) return;

    set_loading(true);
    set_error(null);
    try {
      await create_role_mutation.mutateAsync({
        name: role_name.trim(),
        permission_keys: [],
      });
      set_role_name('');
      await refreshManagementData();
    } catch (err: any) {
      set_error(err?.message ?? 'Unable to create role');
    } finally {
      set_loading(false);
    }
  }

  function startEditingRole(role: OrganizationRole) {
    set_editing_role_uuid(role.uuid);
    set_editing_role_name(role.name);
  }

  async function saveRoleName(role: OrganizationRole) {
    if (!current_organization || !editing_role_name.trim()) return;

    set_loading(true);
    set_error(null);
    try {
      await update_role_mutation.mutateAsync({
        organization_role_uuid: role.uuid,
        payload: { name: editing_role_name.trim() },
      });
      set_editing_role_uuid(null);
      set_editing_role_name('');
      await refreshManagementData();
    } catch (err: any) {
      set_error(err?.message ?? 'Unable to update role');
    } finally {
      set_loading(false);
    }
  }

  async function toggleRolePermission(role: OrganizationRole, permission_key: string) {
    if (!current_organization || role.is_system) return;
    const keys = role.permissions?.map((item) => item.permission.key) ?? [];
    const next_keys = keys.includes(permission_key) ? keys.filter((key) => key !== permission_key) : [...keys, permission_key];
    await set_role_permissions_mutation.mutateAsync({ organization_role_uuid: role.uuid, permission_keys: next_keys });
    await refreshManagementData();
  }

  async function deleteRole(role_uuid: string) {
    if (!current_organization) return;
    set_loading(true);
    set_error(null);
    try {
      await delete_role_mutation.mutateAsync({
        organization_uuid: current_organization.uuid,
        organization_role_uuid: role_uuid,
      });
      await refreshManagementData();
    } catch (err: any) {
      set_error(err?.message ?? 'Unable to delete role');
    } finally {
      set_loading(false);
      set_delete_target(null);
    }
  }

  async function confirmDelete() {
    if (!delete_target) return;

    if (delete_target.type === 'organization') {
      await deleteCurrentOrganization();
      return;
    }

    if (delete_target.type === 'member') {
      await removeMember(delete_target.uuid);
      return;
    }

    await deleteRole(delete_target.uuid);
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-foreground">Organisations</h1>
        <p className="text-sm text-muted">Create organisations, switch context, and manage members, roles, and permissions.</p>
      </header>

      {error && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      <section className="grid gap-4 rounded-lg border border-border bg-surface p-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">Organisation context</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {organizations.length === 0 ? (
              <div className="flex items-center gap-2 rounded-md border border-border/80 px-3 py-3 text-sm text-muted">
                <Building2 className="h-4 w-4" />
                No organisations yet
              </div>
            ) : (
              organizations.map((organization) => (
                <button
                  key={organization.uuid}
                  type="button"
                  disabled={loading}
                  onClick={() => switchOrganization(organization)}
                  className={cn(
                    'flex min-w-0 items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors disabled:opacity-60',
                    organization.uuid === current_organization?.uuid
                      ? 'border-accent/40 bg-surface-secondary text-foreground'
                      : 'border-border/80 text-muted hover:bg-surface-secondary hover:text-foreground',
                  )}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-surface-tertiary text-[10px] font-semibold">
                    {organization.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{organization.name}</span>
                  {organization.uuid === current_organization?.uuid && <Check className="h-4 w-4 shrink-0 text-accent" />}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex min-w-[260px] flex-col gap-3">
          <form onSubmit={createOrganization} className="flex gap-2">
            <input
              value={organization_name}
              onChange={(event) => set_organization_name(event.target.value)}
              placeholder="New organisation"
              className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={loading || !organization_name.trim()}
              title="Create organisation"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>

          <button
            type="button"
            disabled={loading || !can_delete_current_organization}
            title={can_delete_current_organization ? 'Delete current organisation' : 'You must keep at least one organisation'}
            onClick={() =>
              current_organization &&
              set_delete_target({
                type: 'organization',
                name: current_organization.name,
              })
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete current
          </button>
        </div>
      </section>

      {!current_organization ? (
        <EmptyState title="No organisation selected" body="Create or select an organisation to manage members, roles, and permissions." />
      ) : (
        <>
          <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Members</h2>
              <p className="text-xs text-muted">{current_organization.name}</p>
            </div>

            <form onSubmit={inviteMember} className="flex flex-col gap-3 md:flex-row">
              <input
                value={email}
                onChange={(event) => set_email(event.target.value)}
                type="email"
                placeholder="person@example.com"
                className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
              />
              <select
                value={member_role_uuid}
                onChange={(event) => set_member_role_uuid(event.target.value)}
                className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
              >
                {roles.map((role) => (
                  <option key={role.uuid} value={role.uuid}>
                    {role.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={loading || !email.trim() || !member_role_uuid}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground disabled:opacity-50"
              >
                <UserPlus className="h-4 w-4" />
                Invite
              </button>
            </form>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.uuid} className="border-b border-border/70 last:border-0">
                      <td className="px-4 py-3 text-foreground">{member.user?.email ?? member.user_uuid}</td>
                      <td className="px-4 py-3">
                        <select
                          value={member.role_uuid}
                          onChange={(event) => updateMember(member, event.target.value)}
                          className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
                        >
                          {roles.map((role) => (
                            <option key={role.uuid} value={role.uuid}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={member.status}
                          onChange={(event) => updateMember(member, undefined, event.target.value as OrganizationMember['status'])}
                          className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
                        >
                          {Object.values(OrganizationMemberStatuses).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {member.role?.name === 'Owner' ? (
                          <span className="text-xs text-muted">Owner</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              set_delete_target({
                                type: 'member',
                                uuid: member.uuid,
                                label: member.user?.email ?? member.user_uuid,
                              })
                            }
                            title="Remove member"
                            className="inline-grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Roles and permissions</h2>
              <p className="text-xs text-muted">Create custom roles and adjust permission access.</p>
            </div>

            <form onSubmit={createRole}>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  value={role_name}
                  onChange={(event) => set_role_name(event.target.value)}
                  placeholder="Custom role name"
                  className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
                />
                <button
                  type="submit"
                  disabled={loading || !role_name.trim()}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Create role
                </button>
              </div>
            </form>

            <div className="grid gap-3">
              {roles.map((role) => {
                const role_permission_keys = role.permissions?.map((item) => item.permission.key) ?? [];

                return (
                  <section key={role.uuid} className="rounded-lg border border-border/80 bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {editing_role_uuid === role.uuid ? (
                          <input
                            value={editing_role_name}
                            onChange={(event) => set_editing_role_name(event.target.value)}
                            className="h-9 w-full max-w-sm rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
                          />
                        ) : (
                          <h3 className="text-sm font-semibold text-foreground">{role.name}</h3>
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
                                disabled={loading || !editing_role_name.trim()}
                                className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
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
                                onClick={() =>
                                  set_delete_target({
                                    type: 'role',
                                    uuid: role.uuid,
                                    label: role.name,
                                  })
                                }
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
          </section>
        </>
      )}
      <ConfirmationDialog
        open={Boolean(delete_target)}
        title={getDeleteTitle(delete_target)}
        description={getDeleteDescription(delete_target)}
        confirmLabel={getDeleteConfirmLabel(delete_target)}
        loading={loading}
        onConfirm={confirmDelete}
        onOpenChange={(open) => {
          if (!open && !loading) set_delete_target(null);
        }}
      />
    </div>
  );
}

function getDeleteTitle(target: DeleteTarget) {
  if (target?.type === 'organization') return 'Delete organisation';
  if (target?.type === 'member') return 'Remove member';
  if (target?.type === 'role') return 'Delete role';
  return 'Confirm deletion';
}

function getDeleteDescription(target: DeleteTarget) {
  if (target?.type === 'organization') {
    return `Delete ${target.name}? Members, roles, and permissions for this organisation will be removed.`;
  }

  if (target?.type === 'member') {
    return `Remove ${target.label} from this organisation?`;
  }

  if (target?.type === 'role') {
    return `Delete the ${target.label} role? Members using this role may need to be updated first.`;
  }

  return 'This action cannot be undone.';
}

function getDeleteConfirmLabel(target: DeleteTarget) {
  if (target?.type === 'member') return 'Remove member';
  if (target?.type === 'role') return 'Delete role';
  return 'Delete organisation';
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}
