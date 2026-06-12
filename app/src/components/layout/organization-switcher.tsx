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
  const [open, setOpen] = useState(false);
  const [newOrganizationName, setNewOrganizationName] = useState('');
  const {
    current_organization: currentOrganization,
    organizations,
    setCurrentOrganization,
    setOrganizations,
  } = useOrganizationStore();
  const updateUser = useAuthStore((state) => state.update_user);
  const organizationsQuery = useGetOrganizations();
  const createOrganizationMutation = useCreateOrganization();
  const switchOrganizationMutation = useSwitchOrganization();
  const loading = organizationsQuery.isLoading || createOrganizationMutation.isPending || switchOrganizationMutation.isPending;
  const error = organizationsQuery.error?.message ?? createOrganizationMutation.error?.message ?? switchOrganizationMutation.error?.message ?? null;

  useEffect(() => {
    if (organizationsQuery.data) setOrganizations(organizationsQuery.data);
  }, [organizationsQuery.data, setOrganizations]);

  const initials = useMemo(() => {
    const source = currentOrganization?.name ?? 'Organization';
    return source
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [currentOrganization?.name]);

  async function switchOrganization(organizationUuid: string) {
    const organization = organizations.find((item) => item.uuid === organizationUuid);
    if (!organization) return;

    try {
      const scopedAuth = await switchOrganizationMutation.mutateAsync({ organization_uuid: organizationUuid });
      updateUser(scopedAuth);
      setCurrentOrganization(organization);
      setOpen(false);
    } catch {
      return;
    }
  }

  async function createOrg(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newOrganizationName.trim()) return;

    try {
      const organization = await createOrganizationMutation.mutateAsync({ name: newOrganizationName.trim() });
      const items = [...organizations, organization];
      setOrganizations(items);
      setNewOrganizationName('');
      await switchOrganization(organization.uuid);
    } catch {
      return;
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        title={collapsed ? currentOrganization?.name ?? 'Organizations' : undefined}
        onClick={() => setOpen((value) => !value)}
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
          {currentOrganization?.logo_url ? <img src={currentOrganization.logo_url} alt="" className="h-full w-full rounded-lg object-cover" /> : initials}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium leading-tight text-foreground">
                {currentOrganization?.name ?? 'No organization'}
              </span>
              <span className="block truncate text-[11px] leading-tight text-muted">
                {currentOrganization ? 'Organization context' : 'Create or select one'}
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
                  {organization.uuid === currentOrganization?.uuid && <Check className="h-4 w-4 text-accent" />}
                </button>
              ))
            )}
          </div>

          <form onSubmit={createOrg} className="mt-2 flex gap-2 border-t border-border pt-2">
            <input
              value={newOrganizationName}
              onChange={(event) => setNewOrganizationName(event.target.value)}
              placeholder="New organization"
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={loading || !newOrganizationName.trim()}
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
