import { useEffect, useRef, useState } from 'react';
import { Copy, Mail, MoreHorizontal, Trash2, UserPlus, X } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  useCopyMemberInvitationUrl,
  useDeleteMember,
  useGetMembers,
  useInviteMember,
  useResendMemberInvitation,
  useUpdateMember,
} from '@/features/members/hooks/use-members';
import {
  OrganizationMemberStatuses,
  type OrganizationMember,
} from '@/features/members/interfaces/member.interfaces';
import { useGetRoles } from '@/features/roles/hooks/use-roles';
import { cn } from '@/lib/utils';
import { useOrganizationStore } from '@/stores/organization';

type MemberActionTarget = { uuid: string; label: string } | null;

function memberInitials(email: string) {
  const local = email.split('@')[0];
  const parts = local.split(/[._-]/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || local.slice(0, 2).toUpperCase();
}

export function MembersSection() {
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [email, setEmail] = useState('');
  const [memberRoleUuid, setMemberRoleUuid] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MemberActionTarget>(null);
  const [resendTarget, setResendTarget] = useState<MemberActionTarget>(null);
  const [menuOpenUuid, setMenuOpenUuid] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const membersQuery = useGetMembers(currentOrganization?.uuid);
  const rolesQuery = useGetRoles(currentOrganization?.uuid);
  const inviteMemberMutation = useInviteMember(currentOrganization?.uuid);
  const updateMemberMutation = useUpdateMember(currentOrganization?.uuid);
  const deleteMemberMutation = useDeleteMember();
  const resendInvitationMutation = useResendMemberInvitation(currentOrganization?.uuid);
  const copyInvitationUrlMutation = useCopyMemberInvitationUrl(currentOrganization?.uuid);
  const members = membersQuery.data ?? [];
  const roles = rolesQuery.data ?? [];
  const loading =
    isBusy ||
    membersQuery.isLoading ||
    rolesQuery.isLoading ||
    inviteMemberMutation.isPending ||
    updateMemberMutation.isPending ||
    deleteMemberMutation.isPending ||
    resendInvitationMutation.isPending ||
    copyInvitationUrlMutation.isPending;
  const queryError = membersQuery.error?.message ?? rolesQuery.error?.message ?? null;

  useEffect(() => {
    setMemberRoleUuid((current) => {
      if (roles.some((role) => role.uuid === current)) return current;
      return roles.find((role) => role.name === 'Employee')?.uuid ?? roles[0]?.uuid ?? '';
    });
  }, [roles]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenUuid(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function inviteMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentOrganization || !email.trim() || !memberRoleUuid) return;
    setIsBusy(true);
    setError(null);
    try {
      await inviteMemberMutation.mutateAsync({ email: email.trim(), organization_role_uuid: memberRoleUuid });
      setEmail('');
      setShowInviteForm(false);
    } catch (err: any) {
      setError(err?.message ?? 'Unable to invite member');
    } finally {
      setIsBusy(false);
    }
  }

  async function updateMember(
    member: OrganizationMember,
    nextRoleUuid?: string,
    nextStatus?: OrganizationMember['status'],
  ) {
    if (!currentOrganization) return;
    setIsBusy(true);
    setError(null);
    try {
      await updateMemberMutation.mutateAsync({
        organization_member_uuid: member.uuid,
        payload: { organization_role_uuid: nextRoleUuid, status: nextStatus },
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

  async function confirmResendInvitation() {
    if (!resendTarget) return;
    setIsBusy(true);
    setError(null);
    try {
      await resendInvitationMutation.mutateAsync(resendTarget.uuid);
    } catch (err: any) {
      setError(err?.message ?? 'Unable to resend invitation');
    } finally {
      setIsBusy(false);
      setResendTarget(null);
    }
  }

  if (!currentOrganization) return null;

  const memberCount = !membersQuery.isLoading ? members.length : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {memberCount !== null
            ? `${memberCount} member${memberCount === 1 ? '' : 's'}`
            : 'Members'}
        </span>
        <button
          type="button"
          onClick={() => setShowInviteForm((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          <UserPlus className="h-4 w-4" />
          Invite member
        </button>
      </div>

      {showInviteForm && (
        <form
          onSubmit={inviteMember}
          className="flex flex-col gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Invite a member</span>
            <button
              type="button"
              onClick={() => setShowInviteForm(false)}
              className="grid h-7 w-7 place-items-center rounded-md text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="colleague@company.com"
              className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted outline-none transition-all focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
            />
            <select
              value={memberRoleUuid}
              onChange={(event) => setMemberRoleUuid(event.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-all focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
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
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />
              Send invite
            </button>
          </div>
        </form>
      )}

      {(error || queryError) && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
          {error ?? queryError}
        </p>
      )}

      {membersQuery.isLoading || rolesQuery.isLoading ? (
        <MembersTableSkeleton />
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
          <UserPlus className="h-8 w-8 text-muted" />
          <p className="text-sm font-medium text-foreground">No members yet</p>
          <p className="text-sm text-muted">Invite a colleague to collaborate in this workspace.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[580px] text-left text-sm">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">
                  Member
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">
                  Role
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const memberEmail = member.user?.email ?? member.user_uuid;
                const isOwner = member.role?.name === 'Owner';
                const canResendInvitation = member.status === OrganizationMemberStatuses.INVITED;

                return (
                  <tr
                    key={member.uuid}
                    className="border-b border-border/50 transition-colors hover:bg-surface last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-tertiary text-xs font-semibold text-foreground">
                          {memberInitials(memberEmail)}
                        </span>
                        <span className="text-sm text-foreground">{memberEmail}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {isOwner ? (
                        <span className="rounded-md border border-border px-2 py-1 text-xs font-medium text-muted">
                          Owner
                        </span>
                      ) : (
                        <select
                          value={member.role_uuid}
                          onChange={(event) => updateMember(member, event.target.value)}
                          disabled={loading}
                          className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none transition-all focus:ring-1 focus:ring-accent disabled:opacity-60"
                        >
                          {roles.map((role) => (
                            <option key={role.uuid} value={role.uuid}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isOwner ? (
                        <StatusBadge status={member.status} />
                      ) : (
                        <select
                          value={member.status}
                          onChange={(event) =>
                            updateMember(
                              member,
                              undefined,
                              event.target.value as OrganizationMember['status'],
                            )
                          }
                          disabled={loading}
                          className={cn(
                            'h-7 rounded-md border bg-background px-2 text-xs font-medium outline-none transition-all focus:ring-1 focus:ring-accent disabled:opacity-60',
                            member.status === 'ACTIVE' && 'border-accent/30 text-accent',
                            member.status === 'INVITED' && 'border-amber-500/30 text-amber-400',
                            member.status === 'SUSPENDED' && 'border-red-500/30 text-red-400',
                          )}
                        >
                          {Object.values(OrganizationMemberStatuses).map((status) => (
                            <option key={status} value={status} className="bg-background text-foreground">
                              {status}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!isOwner && (
                        <div
                          className="relative inline-flex justify-end"
                          ref={menuOpenUuid === member.uuid ? menuRef : undefined}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setMenuOpenUuid(menuOpenUuid === member.uuid ? null : member.uuid)
                            }
                            disabled={loading}
                            aria-label="Member actions"
                            className="inline-grid h-7 w-7 place-items-center rounded-md text-muted transition-colors hover:bg-surface-secondary hover:text-foreground disabled:opacity-60"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {menuOpenUuid === member.uuid && (
                            <div className="absolute right-0 top-full z-20 mt-1 min-w-[180px] overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg">
                              {canResendInvitation && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMenuOpenUuid(null);
                                      copyInvitationUrlMutation.mutate(member.uuid);
                                    }}
                                    disabled={copyInvitationUrlMutation.isPending}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-surface-secondary disabled:opacity-60"
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                    Copy invitation link
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMenuOpenUuid(null);
                                      setResendTarget({ uuid: member.uuid, label: memberEmail });
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-surface-secondary"
                                  >
                                    <Mail className="h-3.5 w-3.5" />
                                    Resend invitation
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setMenuOpenUuid(null);
                                  setDeleteTarget({ uuid: member.uuid, label: memberEmail });
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-400 hover:bg-surface-secondary"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove member
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationDialog
        open={Boolean(resendTarget)}
        title="Resend invitation"
        description={
          resendTarget
            ? `Send a new invitation email to ${resendTarget.label}? They will receive a fresh link to join this workspace.`
            : ''
        }
        confirmLabel="Resend invitation"
        variant="confirm"
        loading={loading}
        onConfirm={confirmResendInvitation}
        onOpenChange={(open) => {
          if (!open && !loading) setResendTarget(null);
        }}
      />

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        title="Remove member"
        description={deleteTarget ? `Remove ${deleteTarget.label} from this workspace?` : ''}
        confirmLabel="Remove member"
        loading={loading}
        onConfirm={removeMember}
        onOpenChange={(open) => {
          if (!open && !loading) setDeleteTarget(null);
        }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        status === 'ACTIVE' && 'border-accent/30 bg-accent/8 text-accent',
        status === 'INVITED' && 'border-amber-500/20 bg-amber-500/8 text-amber-400',
        status === 'SUSPENDED' && 'border-red-500/20 bg-red-500/8 text-red-400',
      )}
    >
      {status}
    </span>
  );
}

function MembersTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="grid min-w-[580px] grid-cols-[2fr_1fr_1fr_52px] items-center border-b border-border/50 px-4 py-3 last:border-0"
        >
          <div className="flex items-center gap-3">
            <SkeletonLine className="h-8 w-8 rounded-lg" />
            <SkeletonLine className="h-4 w-40" />
          </div>
          <SkeletonLine className="h-7 w-24 rounded-md" />
          <SkeletonLine className="h-7 w-20 rounded-md" />
          <SkeletonLine className="ml-auto h-7 w-7 rounded-md" />
        </div>
      ))}
    </div>
  );
}

function SkeletonLine({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-surface-secondary ${className}`} />;
}
