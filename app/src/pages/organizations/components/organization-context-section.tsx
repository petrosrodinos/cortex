import { useEffect, useState } from 'react';
import { Building2, Check, Plus, Trash2 } from 'lucide-react';
import { OrganizationsPageSkeleton } from '@/components/organizations/organizations-page-skeleton';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  useCreateOrganization,
  useDeleteOrganization,
  useGetOrganizations,
  useSwitchOrganization,
} from '@/features/organizations/hooks/use-organizations';
import type { Organization } from '@/features/organizations/interfaces/organization.interfaces';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationStore } from '@/stores/organization';

export function OrganizationContextSection() {
  const {
    current_organization: currentOrganization,
    organizations,
    setCurrentOrganization,
    setOrganizations,
  } = useOrganizationStore();
  const updateUser = useAuthStore((state) => state.update_user);
  const [organizationName, setOrganizationName] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);
  const organizationsQuery = useGetOrganizations();
  const createOrganizationMutation = useCreateOrganization();
  const deleteOrganizationMutation = useDeleteOrganization();
  const switchOrganizationMutation = useSwitchOrganization();
  const loading =
    isBusy ||
    organizationsQuery.isLoading ||
    createOrganizationMutation.isPending ||
    deleteOrganizationMutation.isPending ||
    switchOrganizationMutation.isPending;
  const canDeleteCurrentOrganization = Boolean(currentOrganization && organizations.length > 1);

  useEffect(() => {
    if (organizationsQuery.data) setOrganizations(organizationsQuery.data);
  }, [organizationsQuery.data, setOrganizations]);

  async function switchOrganization(organization: Organization) {
    setIsBusy(true);
    setError(null);
    try {
      const scopedAuth = await switchOrganizationMutation.mutateAsync({ organization_uuid: organization.uuid });
      updateUser(scopedAuth);
      setCurrentOrganization(organization);
    } catch (err: any) {
      setError(err?.message ?? 'Unable to switch organisation');
    } finally {
      setIsBusy(false);
    }
  }

  async function createOrganization(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!organizationName.trim()) return;

    setIsBusy(true);
    setError(null);
    try {
      const organization = await createOrganizationMutation.mutateAsync({ name: organizationName.trim() });
      setOrganizationName('');
      setOrganizations([...organizations, organization]);
      await switchOrganization(organization);
    } catch (err: any) {
      setError(err?.message ?? 'Unable to create organisation');
    } finally {
      setIsBusy(false);
    }
  }

  async function deleteCurrentOrganization() {
    if (!currentOrganization || organizations.length <= 1) {
      setError('You must keep at least one organisation');
      setDeleteTarget(null);
      return;
    }

    const nextOrganizations = organizations.filter((organization) => organization.uuid !== currentOrganization.uuid);

    setIsBusy(true);
    setError(null);
    try {
      await deleteOrganizationMutation.mutateAsync({ organization_uuid: currentOrganization.uuid });
      setOrganizations(nextOrganizations);
      const nextOrganization = nextOrganizations[0] ?? null;

      if (nextOrganization) {
        await switchOrganization(nextOrganization);
      } else {
        setCurrentOrganization(null);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Unable to delete organisation');
    } finally {
      setIsBusy(false);
      setDeleteTarget(null);
    }
  }

  if (organizationsQuery.isLoading) {
    return <OrganizationsPageSkeleton />;
  }

  return (
    <>
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
                    organization.uuid === currentOrganization?.uuid
                      ? 'border-accent/40 bg-surface-secondary text-foreground'
                      : 'border-border/80 text-muted hover:bg-surface-secondary hover:text-foreground',
                  )}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-surface-tertiary text-[10px] font-semibold">
                    {organization.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{organization.name}</span>
                  {organization.uuid === currentOrganization?.uuid && <Check className="h-4 w-4 shrink-0 text-accent" />}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex min-w-[260px] flex-col gap-3">
          <form onSubmit={createOrganization} className="flex gap-2">
            <input
              value={organizationName}
              onChange={(event) => setOrganizationName(event.target.value)}
              placeholder="New organisation"
              className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={loading || !organizationName.trim()}
              title="Create organisation"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>

          <button
            type="button"
            disabled={loading || !canDeleteCurrentOrganization}
            title={canDeleteCurrentOrganization ? 'Delete current organisation' : 'You must keep at least one organisation'}
            onClick={() => currentOrganization && setDeleteTarget(currentOrganization)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete current
          </button>
        </div>
      </section>

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        title="Delete organisation"
        description={deleteTarget ? `Delete ${deleteTarget.name}? Members, roles, and permissions for this organisation will be removed.` : ''}
        confirmLabel="Delete organisation"
        loading={loading}
        onConfirm={deleteCurrentOrganization}
        onOpenChange={(open) => {
          if (!open && !loading) setDeleteTarget(null);
        }}
      />
    </>
  );
}
