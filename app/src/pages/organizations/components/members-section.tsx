import { useEffect, useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useDeleteMember, useGetMembers, useInviteMember, useUpdateMember } from '@/features/members/hooks/use-members';
import {
  OrganizationMemberStatuses,
  type OrganizationMember,
} from '@/features/members/interfaces/member.interfaces';
import { useGetRoles } from '@/features/roles/hooks/use-roles';
import { useOrganizationStore } from '@/stores/organization';

type DeleteMemberTarget = {
  uuid: string;
  label: string;
} | null;

export function MembersSection() {
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const [email, setEmail] = useState('');
  const [memberRoleUuid, setMemberRoleUuid] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteMemberTarget>(null);
  const membersQuery = useGetMembers(currentOrganization?.uuid);
  const rolesQuery = useGetRoles(currentOrganization?.uuid);
  const inviteMemberMutation = useInviteMember(currentOrganization?.uuid);
  const updateMemberMutation = useUpdateMember(currentOrganization?.uuid);
  const deleteMemberMutation = useDeleteMember();
  const members = membersQuery.data ?? [];
  const roles = rolesQuery.data ?? [];
  const loading =
    isBusy ||
    membersQuery.isLoading ||
    rolesQuery.isLoading ||
    inviteMemberMutation.isPending ||
    updateMemberMutation.isPending ||
    deleteMemberMutation.isPending;
  const queryError = membersQuery.error?.message ?? rolesQuery.error?.message ?? null;

  useEffect(() => {
    setMemberRoleUuid((current) => {
      if (roles.some((role) => role.uuid === current)) return current;
      return roles.find((role) => role.name === 'Employee')?.uuid ?? roles[0]?.uuid ?? '';
    });
  }, [roles]);

  async function inviteMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentOrganization || !email.trim() || !memberRoleUuid) return;

    setIsBusy(true);
    setError(null);
    try {
      await inviteMemberMutation.mutateAsync({
        email: email.trim(),
        organization_role_uuid: memberRoleUuid,
      });
      setEmail('');
    } catch (err: any) {
      setError(err?.message ?? 'Unable to invite member');
    } finally {
      setIsBusy(false);
    }
  }

  async function updateMember(member: OrganizationMember, nextRoleUuid?: string, nextStatus?: OrganizationMember['status']) {
    if (!currentOrganization) return;

    setIsBusy(true);
    setError(null);
    try {
      await updateMemberMutation.mutateAsync({
        organization_member_uuid: member.uuid,
        payload: {
          organization_role_uuid: nextRoleUuid,
          status: nextStatus,
        },
      });
    } catch (err: any) {
      setError(err?.message ?? 'Unable to update member');
    } finally {
      setIsBusy(false);
    }
  }

  async function removeMember() {
    if (!currentOrganization || !deleteTarget) return;

    setIsBusy(true);
    setError(null);
    try {
      await deleteMemberMutation.mutateAsync({
        organization_uuid: currentOrganization.uuid,
        organization_member_uuid: deleteTarget.uuid,
      });
    } catch (err: any) {
      setError(err?.message ?? 'Unable to remove member');
    } finally {
      setIsBusy(false);
      setDeleteTarget(null);
    }
  }

  if (!currentOrganization) return null;

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Members</h2>
        <p className="text-xs text-muted">{currentOrganization.name}</p>
      </div>

      {(error || queryError) && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error ?? queryError}</p>}

      <form onSubmit={inviteMember} className="flex flex-col gap-3 md:flex-row">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="person@example.com"
          className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
        />
        <select
          value={memberRoleUuid}
          onChange={(event) => setMemberRoleUuid(event.target.value)}
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
          disabled={loading || !email.trim() || !memberRoleUuid}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          Invite
        </button>
      </form>

      {membersQuery.isLoading || rolesQuery.isLoading ? <MembersTableSkeleton /> : null}
      {!membersQuery.isLoading && !rolesQuery.isLoading ? (
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
                        onClick={() => setDeleteTarget({ uuid: member.uuid, label: member.user?.email ?? member.user_uuid })}
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
      ) : null}

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        title="Remove member"
        description={deleteTarget ? `Remove ${deleteTarget.label} from this organisation?` : ''}
        confirmLabel="Remove member"
        loading={loading}
        onConfirm={removeMember}
        onOpenChange={(open) => {
          if (!open && !loading) setDeleteTarget(null);
        }}
      />
    </section>
  );
}

function MembersTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border" aria-hidden="true">
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className="grid min-w-[720px] grid-cols-[1.4fr_1fr_1fr_0.6fr] items-center border-b border-border/70 px-4 py-3 last:border-0">
          <SkeletonLine className="h-4 w-44" />
          <SkeletonLine className="h-8 w-32 rounded-md" />
          <SkeletonLine className="h-8 w-28 rounded-md" />
          <SkeletonLine className="ml-auto h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}

function SkeletonLine({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-surface-secondary ${className}`} />;
}
