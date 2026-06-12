import { useEffect, useMemo, useState } from 'react';
import { Building2, Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationStore } from '@/stores/organization';
import { useCreateOrganization, useGetOrganizations, useSwitchOrganization } from '@/features/organizations/hooks/use-organizations';

interface OrganizationSwitcherProps {
  collapsed?: boolean;
}

export default function OrganizationSwitcher({ collapsed = false }: OrganizationSwitcherProps) {
  const [open, set_open] = useState(false);
  const [new_organization_name, set_new_organization_name] = useState('');
  const { current_organization, organizations, set_current_organization, set_organizations } = useOrganizationStore();
  const update_user = useAuthStore((state) => state.update_user);
  const organizations_query = useGetOrganizations();
  const create_organization_mutation = useCreateOrganization();
  const switch_organization_mutation = useSwitchOrganization();
  const loading = organizations_query.isLoading || create_organization_mutation.isPending || switch_organization_mutation.isPending;
  const error = organizations_query.error?.message ?? create_organization_mutation.error?.message ?? switch_organization_mutation.error?.message ?? null;

  useEffect(() => {
    if (organizations_query.data) set_organizations(organizations_query.data);
  }, [organizations_query.data, set_organizations]);

  const initials = useMemo(() => {
    const source = current_organization?.name ?? 'Organization';
    return source
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [current_organization?.name]);

  async function switchOrganization(organization_uuid: string) {
    const organization = organizations.find((item) => item.uuid === organization_uuid);
    if (!organization) return;

    try {
      const scoped_auth = await switch_organization_mutation.mutateAsync({ organization_uuid: organization_uuid });
      update_user(scoped_auth);
      set_current_organization(organization);
      set_open(false);
    } catch {
      return;
    }
  }

  async function createOrg(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!new_organization_name.trim()) return;

    try {
      const organization = await create_organization_mutation.mutateAsync({ name: new_organization_name.trim() });
      const items = [...organizations, organization];
      set_organizations(items);
      set_new_organization_name('');
      await switchOrganization(organization.uuid);
    } catch {
      return;
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        title={collapsed ? current_organization?.name ?? 'Organizations' : undefined}
        onClick={() => set_open((value) => !value)}
        className={cn(
          'flex w-full items-center rounded-xl text-left transition-colors duration-200',
          'hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60',
          collapsed ? 'justify-center p-2' : 'gap-2 px-2 py-2',
        )}
      >
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px] font-semibold text-foreground"
          style={{
            background: 'color-mix(in oklch, var(--accent) 14%, transparent)',
            boxShadow: 'inset 0 0 0 1px color-mix(in oklch, var(--accent) 24%, transparent)',
          }}
        >
          {current_organization?.logo_url ? <img src={current_organization.logo_url} alt="" className="h-full w-full rounded-lg object-cover" /> : initials}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium leading-tight text-foreground">
                {current_organization?.name ?? 'No organization'}
              </span>
              <span className="block truncate text-[11px] leading-tight text-muted">
                {current_organization ? 'Organization context' : 'Create or select one'}
              </span>
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted" />
          </>
        )}
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-2 w-[min(260px,calc(100vw-32px))] rounded-xl border border-border bg-surface p-2 shadow-xl"
          style={{ boxShadow: '0 18px 44px -18px color-mix(in oklch, black 45%, transparent)' }}
        >
          <div className="max-h-56 overflow-y-auto">
            {organizations.length === 0 ? (
              <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted">
                <Building2 className="h-4 w-4" />
                No organizations yet
              </div>
            ) : (
              organizations.map((organization) => (
                <button
                  key={organization.uuid}
                  type="button"
                  disabled={loading}
                  onClick={() => switchOrganization(organization.uuid)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-foreground hover:bg-surface-secondary disabled:opacity-60"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-surface-tertiary text-[10px] font-semibold">
                    {organization.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{organization.name}</span>
                  {organization.uuid === current_organization?.uuid && <Check className="h-4 w-4 text-accent" />}
                </button>
              ))
            )}
          </div>

          <form onSubmit={createOrg} className="mt-2 flex gap-2 border-t border-border pt-2">
            <input
              value={new_organization_name}
              onChange={(event) => set_new_organization_name(event.target.value)}
              placeholder="New organization"
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={loading || !new_organization_name.trim()}
              title="Create organization"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>
          {error && <p className="mt-2 px-1 text-xs text-red-400">{error}</p>}
        </div>
      )}
    </div>
  );
}
