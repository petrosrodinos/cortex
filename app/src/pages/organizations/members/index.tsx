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
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const [email, setEmail] = useState('');
  const [organizationRoleUuid, setOrganizationRoleUuid] = useState('');
  const membersQuery = useGetMembers(currentOrganization?.uuid);
  const rolesQuery = useGetRoles(currentOrganization?.uuid);
  const inviteMemberMutation = useInviteMember(currentOrganization?.uuid);
  const updateMemberMutation = useUpdateMember(currentOrganization?.uuid);
  const deleteMemberMutation = useDeleteMember();
  const members = membersQuery.data ?? [];
  const roles = rolesQuery.data ?? [];
  const loading = membersQuery.isLoading || rolesQuery.isLoading || inviteMemberMutation.isPending || updateMemberMutation.isPending || deleteMemberMutation.isPending;
  const error = membersQuery.error?.message ?? rolesQuery.error?.message ?? null;

  useEffect(() => {
    setOrganizationRoleUuid((current) => {
      if (roles.some((role) => role.uuid === current)) return current;
      return roles.find((role) => role.name === 'Employee')?.uuid ?? roles[0]?.uuid ?? '';
    });
  }, [roles]);

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentOrganization || !email.trim() || !organizationRoleUuid) return;

    try {
      await inviteMemberMutation.mutateAsync({ email: email.trim(), organization_role_uuid: organizationRoleUuid });
      setEmail('');
    } catch {
      return;
    }
  }

  async function updateMember(member: OrganizationMember, nextOrganizationRoleUuid?: string, nextStatus?: OrganizationMember['status']) {
    if (!currentOrganization) return;
    await updateMemberMutation.mutateAsync({
      organization_member_uuid: member.uuid,
      payload: {
        organization_role_uuid: nextOrganizationRoleUuid,
        status: nextStatus,
      },
    });
  }

  async function removeMember(organization_member_uuid: string) {
    if (!currentOrganization) return;
    await deleteMemberMutation.mutateAsync({
      organization_uuid: currentOrganization.uuid,
      organization_member_uuid: organization_member_uuid,
    });
  }

  if (!currentOrganization) {
    return <EmptyState title="No organization selected" body="Create or select an organization from the sidebar." />;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-foreground">Members</h1>
        <p className="text-sm text-muted">{currentOrganization.name}</p>
      </header>

      <form onSubmit={invite} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 md:flex-row">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="person@example.com"
          className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
        />
        <select
          value={organizationRoleUuid}
          onChange={(event) => setOrganizationRoleUuid(event.target.value)}
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
          disabled={loading || !email.trim() || !organizationRoleUuid}
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
