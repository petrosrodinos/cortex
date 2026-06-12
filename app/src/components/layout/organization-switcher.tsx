import { useEffect, useMemo, useState } from 'react';
import { Building2, Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationStore } from '@/stores/organization';
import { organizations_service } from '@/services/organizations.service';

interface OrganizationSwitcherProps {
  collapsed?: boolean;
}

export default function OrganizationSwitcher({ collapsed = false }: OrganizationSwitcherProps) {
  const [open, set_open] = useState(false);
  const [new_organization_name, set_new_organization_name] = useState('');
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState<string | null>(null);
  const { current_organization, organizations, set_current_organization, set_organizations } = useOrganizationStore();
  const update_user = useAuthStore((state) => state.update_user);

  useEffect(() => {
    let mounted = true;

    organizations_service
      .list_organizations()
      .then((items) => {
        if (mounted) set_organizations(items);
      })
      .catch(() => {
        if (mounted) set_error('Unable to load organizations');
      });

    return () => {
      mounted = false;
    };
  }, [set_organizations]);

  const initials = useMemo(() => {
    const source = current_organization?.name ?? 'Organization';
    return source
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [current_organization?.name]);

  async function switch_organization(organization_uuid: string) {
    const organization = organizations.find((item) => item.uuid === organization_uuid);
    if (!organization) return;

    set_loading(true);
    set_error(null);
    try {
      const scoped_auth = await organizations_service.switch_organization(organization_uuid);
      update_user(scoped_auth);
      set_current_organization(organization);
      set_open(false);
    } catch (err: any) {
      set_error(err?.response?.data?.message ?? 'Unable to switch organization');
    } finally {
      set_loading(false);
    }
  }

  async function createOrg(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!new_organization_name.trim()) return;

    set_loading(true);
    set_error(null);
    try {
      const organization = await organizations_service.create_organization({ name: new_organization_name.trim() });
      const items = [...organizations, organization];
      set_organizations(items);
      set_new_organization_name('');
      await switch_organization(organization.uuid);
    } catch (err: any) {
      set_error(err?.response?.data?.message ?? 'Unable to create organization');
    } finally {
      set_loading(false);
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
          className="absolute bottom-full left-0 z-50 mb-2 w-[260px] rounded-xl border border-border bg-surface p-2 shadow-xl"
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
                  onClick={() => switch_organization(organization.uuid)}
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
