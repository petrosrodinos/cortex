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
    const nextOrganizations = organizations.filter((o) => o.uuid !== currentOrganization.uuid);
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
      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">{error}</p>
      )}

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">Workspace</span>
          <button
            type="button"
            disabled={loading || !canDeleteCurrentOrganization}
            title={
              canDeleteCurrentOrganization
                ? 'Delete current workspace'
                : 'You must keep at least one organisation'
            }
            onClick={() => currentOrganization && setDeleteTarget(currentOrganization)}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:text-red-400 disabled:pointer-events-none disabled:opacity-40"
          >
            <Trash2 className="h-3 w-3" />
            Delete current
          </button>
        </div>

        {organizations.length === 0 ? (
          <div className="flex items-center gap-2 py-1 text-sm text-muted">
            <Building2 className="h-4 w-4" />
            No workspaces yet
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {organizations.map((organization) => (
              <button
                key={organization.uuid}
                type="button"
                disabled={loading}
                onClick={() => switchOrganization(organization)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all disabled:opacity-60',
                  organization.uuid === currentOrganization?.uuid
                    ? 'border-accent/40 bg-accent/8 text-foreground'
                    : 'border-border bg-background text-muted hover:border-border/80 hover:text-foreground',
                )}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[9px] font-bold bg-surface-tertiary">
                  {organization.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="max-w-[160px] truncate">{organization.name}</span>
                {organization.uuid === currentOrganization?.uuid && (
                  <Check className="ml-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                )}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={createOrganization}
          className="flex gap-2 border-t border-border/60 pt-4"
        >
          <input
            value={organizationName}
            onChange={(event) => setOrganizationName(event.target.value)}
            placeholder="New workspace name"
            className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted outline-none transition-all focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="submit"
            disabled={loading || !organizationName.trim()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3 text-sm font-medium text-accent-foreground transition-opacity disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
        </form>
      </section>

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        title="Delete workspace"
        description={
          deleteTarget
            ? `Delete ${deleteTarget.name}? All members, roles, and permissions will be permanently removed.`
            : ''
        }
        confirmLabel="Delete workspace"
        loading={loading}
        onConfirm={deleteCurrentOrganization}
        onOpenChange={(open) => {
          if (!open && !loading) setDeleteTarget(null);
        }}
      />
    </>
  );
}
