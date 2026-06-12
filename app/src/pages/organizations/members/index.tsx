import { useEffect, useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import { organizations_service } from '@/services/organizations.service';
import { useOrganizationStore } from '@/stores/organization';
import {
  OrganizationMemberStatuses,
  type OrganizationMember,
  type OrganizationRole,
} from '@/interfaces/organization/organization.interface';

export default function MembersPage() {
  const current_organization = useOrganizationStore((state) => state.current_organization);
  const [members, set_members] = useState<OrganizationMember[]>([]);
  const [roles, set_roles] = useState<OrganizationRole[]>([]);
  const [email, set_email] = useState('');
  const [organization_role_uuid, set_organization_role_uuid] = useState('');
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  async function load() {
    if (!current_organization) return;
    set_loading(true);
    set_error(null);
    try {
      const [member_items, role_items] = await Promise.all([
        organizations_service.list_members(current_organization.uuid),
        organizations_service.list_roles(current_organization.uuid),
      ]);
      set_members(member_items);
      set_roles(role_items);
      set_organization_role_uuid((current) => current || (role_items.find((role) => role.name === 'Employee')?.uuid ?? role_items[0]?.uuid ?? ''));
    } catch (err: any) {
      set_error(err?.response?.data?.message ?? 'Unable to load members');
    } finally {
      set_loading(false);
    }
  }

  useEffect(() => {
    load();
  }, [current_organization?.uuid]);

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current_organization || !email.trim() || !organization_role_uuid) return;

    set_loading(true);
    set_error(null);
    try {
      await organizations_service.invite_member(current_organization.uuid, { email: email.trim(), organization_role_uuid: organization_role_uuid });
      set_email('');
      await load();
    } catch (err: any) {
      set_error(err?.response?.data?.message ?? 'Unable to invite member');
    } finally {
      set_loading(false);
    }
  }

  async function update_member(member: OrganizationMember, next_organization_role_uuid?: string, nextStatus?: OrganizationMember['status']) {
    if (!current_organization) return;
    await organizations_service.update_member(current_organization.uuid, member.uuid, {
      organization_role_uuid: next_organization_role_uuid,
      status: nextStatus,
    });
    await load();
  }

  async function remove_member(organization_member_uuid: string) {
    if (!current_organization) return;
    await organizations_service.remove_member(current_organization.uuid, organization_member_uuid);
    await load();
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
                    onChange={(event) => update_member(member, event.target.value)}
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
                    onChange={(event) => update_member(member, undefined, event.target.value as OrganizationMember['status'])}
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
                  <button
                    type="button"
                    onClick={() => remove_member(member.uuid)}
                    title="Remove member"
                    className="inline-grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
