import { useEffect, useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import { useOrganizationStore } from '@/stores/organization';
import { useDeleteMember, useGetMembers, useInviteMember, useUpdateMember } from '@/features/members/hooks/use-members';
import { useGetRoles } from '@/features/roles/hooks/use-roles';
import {
  OrganizationMemberStatuses,
  type OrganizationMember,
} from '@/features/members/interfaces/member.interfaces';

export default function MembersPage() {
  const current_organization = useOrganizationStore((state) => state.current_organization);
  const [email, set_email] = useState('');
  const [organization_role_uuid, set_organization_role_uuid] = useState('');
  const members_query = useGetMembers(current_organization?.uuid);
  const roles_query = useGetRoles(current_organization?.uuid);
  const invite_member_mutation = useInviteMember(current_organization?.uuid);
  const update_member_mutation = useUpdateMember(current_organization?.uuid);
  const delete_member_mutation = useDeleteMember();
  const members = members_query.data ?? [];
  const roles = roles_query.data ?? [];
  const loading = members_query.isLoading || roles_query.isLoading || invite_member_mutation.isPending || update_member_mutation.isPending || delete_member_mutation.isPending;
  const error = members_query.error?.message ?? roles_query.error?.message ?? null;

  useEffect(() => {
    set_organization_role_uuid((current) => {
      if (roles.some((role) => role.uuid === current)) return current;
      return roles.find((role) => role.name === 'Employee')?.uuid ?? roles[0]?.uuid ?? '';
    });
  }, [roles]);

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current_organization || !email.trim() || !organization_role_uuid) return;

    try {
      await invite_member_mutation.mutateAsync({ email: email.trim(), organization_role_uuid: organization_role_uuid });
      set_email('');
    } catch {
      return;
    }
  }

  async function updateMember(member: OrganizationMember, next_organization_role_uuid?: string, nextStatus?: OrganizationMember['status']) {
    if (!current_organization) return;
    await update_member_mutation.mutateAsync({
      organization_member_uuid: member.uuid,
      payload: {
        organization_role_uuid: next_organization_role_uuid,
        status: nextStatus,
      },
    });
  }

  async function removeMember(organization_member_uuid: string) {
    if (!current_organization) return;
    await delete_member_mutation.mutateAsync({
      organization_uuid: current_organization.uuid,
      organization_member_uuid: organization_member_uuid,
    });
  }

  if (!current_organization) {
    return <EmptyState title="No organization selected" body="Create or select an organization from the sidebar." />;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-foreground">Members</h1>
        <p className="text-sm text-muted">{current_organization.name}</p>
      </header>

      <form onSubmit={invite} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 md:flex-row">
        <input
          value={email}
          onChange={(event) => set_email(event.target.value)}
          type="email"
          placeholder="person@example.com"
          className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
        />
        <select
          value={organization_role_uuid}
          onChange={(event) => set_organization_role_uuid(event.target.value)}
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
          disabled={loading || !email.trim() || !organization_role_uuid}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          Invite
        </button>
      </form>

      {error && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
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
                      onClick={() => removeMember(member.uuid)}
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
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}
