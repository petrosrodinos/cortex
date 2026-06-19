import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [showCreate, setShowCreate] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    current_organization: currentOrganization,
    organizations,
    setCurrentOrganization,
    setOrganizations,
  } = useOrganizationStore();
  const updateUser = useAuthStore((state) => state.update_user);
  const organizationsQuery = useGetOrganizations();
  const switchOrganizationMutation = useSwitchOrganization();
  const createOrganizationMutation = useCreateOrganization();
  const loading = organizationsQuery.isLoading || switchOrganizationMutation.isPending;
  const error = organizationsQuery.error?.message ?? switchOrganizationMutation.error?.message ?? null;

  useEffect(() => {
    if (organizationsQuery.data) setOrganizations(organizationsQuery.data);
  }, [organizationsQuery.data, setOrganizations]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setShowCreate(false);
        setNewOrgName('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

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

  async function handleCreateOrganization() {
    if (!newOrgName.trim()) return;

    try {
      const created = await createOrganizationMutation.mutateAsync({ name: newOrgName.trim() });
      setNewOrgName('');
      setShowCreate(false);

      const refreshed = organizationsQuery.data ?? organizations;
      const found = [...refreshed].find((o) => o.uuid === created.uuid) ?? created;

      try {
        const scopedAuth = await switchOrganizationMutation.mutateAsync({ organization_uuid: found.uuid });
        updateUser(scopedAuth);
        setCurrentOrganization(found);
      } catch {
        setCurrentOrganization(found);
      }

      setOpen(false);
    } catch {
      return;
    }
  }

  return (
    <div ref={containerRef} className="relative">
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
                {currentOrganization ? 'Organization context' : 'Select an organization'}
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
                  <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-md bg-surface-tertiary text-[10px] font-semibold">
                    {organization.logo_url ? (
                      <img src={organization.logo_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      organization.name.slice(0, 2).toUpperCase()
                    )}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{organization.name}</span>
                  {organization.uuid === currentOrganization?.uuid && <Check className="h-4 w-4 text-accent" />}
                </button>
              ))
            )}
          </div>

          <div className="mt-1 border-t border-border pt-1">
            {showCreate ? (
              <div className="flex flex-col gap-2 px-1 py-1">
                <input
                  autoFocus
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void handleCreateOrganization();
                    if (e.key === 'Escape') { setShowCreate(false); setNewOrgName(''); }
                  }}
                  placeholder="Organization name"
                  className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    disabled={createOrganizationMutation.isPending || !newOrgName.trim()}
                    onClick={handleCreateOrganization}
                    className="flex-1 rounded-lg bg-accent px-2 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  >
                    {createOrganizationMutation.isPending ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowCreate(false); setNewOrgName(''); }}
                    className="rounded-lg border border-border px-2 py-1.5 text-xs text-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-muted hover:bg-surface-secondary hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Create organization
              </button>
            )}
          </div>

          {error && <p className="mt-2 px-1 text-xs text-red-400">{error}</p>}
        </div>
      )}
    </div>
  );
}
