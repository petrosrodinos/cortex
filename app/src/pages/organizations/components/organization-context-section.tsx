import { useEffect, useState } from 'react';
import { Building2, Check, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { OrganizationsPageSkeleton } from '@/components/organizations/organizations-page-skeleton';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  useDeleteOrganization,
  useGetOrganizations,
  useSwitchOrganization,
} from '@/features/organizations/hooks/use-organizations';
import type { Organization } from '@/features/organizations/interfaces/organization.interfaces';
import { cn } from '@/lib/utils';
import { OrganizationPermissionGate } from '@/components/permissions/organization-permission-gate';
import { PermissionKeys } from '@/features/permissions/interfaces/permission.interfaces';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationStore } from '@/stores/organization';
import { OrganizationLogo } from './organization-logo';
import { OrganizationModal } from './organization-modal';

type WorkspaceRowProps = {
  organization: Organization;
  isActive: boolean;
  loading: boolean;
  canDeleteOrganization: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function WorkspaceRow({
  organization,
  isActive,
  loading,
  canDeleteOrganization,
  onSelect,
  onEdit,
  onDelete,
}: WorkspaceRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors',
        isActive ? 'bg-accent/8 ring-1 ring-inset ring-accent/25' : 'hover:bg-surface-secondary/80',
      )}
    >
      <button
        type="button"
        disabled={loading || isActive}
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-1.5 py-1 text-left disabled:cursor-default"
      >
        <OrganizationLogo name={organization.name} logoUrl={organization.logo_url} active={isActive} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">{organization.name}</span>
          <span className="block truncate text-xs text-muted">{organization.slug}</span>
        </span>
        {isActive ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
            <Check className="h-3 w-3" strokeWidth={2.5} />
            Active
          </span>
        ) : (
          <span className="shrink-0 text-xs text-muted">Switch</span>
        )}
      </button>
      <div className="flex shrink-0 items-center gap-0.5">
        <OrganizationPermissionGate permission={PermissionKeys.ORG_UPDATE}>
          <button
            type="button"
            disabled={loading}
            title={`Edit ${organization.name}`}
            onClick={onEdit}
            className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface-secondary hover:text-foreground disabled:opacity-40"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </OrganizationPermissionGate>
        {canDeleteOrganization ? (
          <OrganizationPermissionGate permission={PermissionKeys.ORG_DELETE}>
            <button
              type="button"
              disabled={loading}
              title={`Delete ${organization.name}`}
              onClick={onDelete}
              className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </OrganizationPermissionGate>
        ) : null}
      </div>
    </div>
  );
}

type OrganizationModalState =
  | { mode: 'create' }
  | { mode: 'edit'; organization: Organization };

export function OrganizationContextSection() {
  const {
    current_organization: currentOrganization,
    organizations,
    setCurrentOrganization,
    setOrganizations,
  } = useOrganizationStore();
  const updateUser = useAuthStore((state) => state.update_user);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);
  const [modalState, setModalState] = useState<OrganizationModalState | null>(null);
  const organizationsQuery = useGetOrganizations();
  const deleteOrganizationMutation = useDeleteOrganization();
  const switchOrganizationMutation = useSwitchOrganization();
  const loading =
    isBusy || organizationsQuery.isLoading || deleteOrganizationMutation.isPending || switchOrganizationMutation.isPending;
  const canDeleteOrganization = organizations.length > 1;

  useEffect(() => {
    if (organizationsQuery.data) setOrganizations(organizationsQuery.data);
  }, [organizationsQuery.data, setOrganizations]);

  function syncOrganization(updated: Organization) {
    setOrganizations(organizations.map((organization) => (organization.uuid === updated.uuid ? updated : organization)));
    if (currentOrganization?.uuid === updated.uuid) {
      setCurrentOrganization(updated);
    }
  }

  function handleOrganizationSaved(organization: Organization) {
    if (modalState?.mode === 'create') {
      setOrganizations([...organizations, organization]);
      void switchOrganization(organization);
      return;
    }
    syncOrganization(organization);
  }

  async function switchOrganization(organization: Organization) {
    if (organization.uuid === currentOrganization?.uuid) return;
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

  async function confirmDeleteOrganization() {
    if (!deleteTarget || organizations.length <= 1) {
      setError('You must keep at least one organisation');
      setDeleteTarget(null);
      return;
    }
    const deletedUuid = deleteTarget.uuid;
    const nextOrganizations = organizations.filter((organization) => organization.uuid !== deletedUuid);
    setIsBusy(true);
    setError(null);
    try {
      await deleteOrganizationMutation.mutateAsync({ organization_uuid: deletedUuid });
      setOrganizations(nextOrganizations);
      if (modalState?.mode === 'edit' && modalState.organization.uuid === deletedUuid) {
        setModalState(null);
      }
      if (deletedUuid === currentOrganization?.uuid) {
        const nextOrganization = nextOrganizations[0] ?? null;
        if (nextOrganization) {
          await switchOrganization(nextOrganization);
        } else {
          setCurrentOrganization(null);
        }
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
        <div className="flex min-w-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">Workspace</span>
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />}
          </div>
          <OrganizationPermissionGate permission={PermissionKeys.ORG_UPDATE}>
            <button
              type="button"
              onClick={() => setModalState({ mode: 'create' })}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-accent px-3 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              New workspace
            </button>
          </OrganizationPermissionGate>
        </div>

        {organizations.length === 0 ? (
          <div className="flex items-center gap-2 py-2 text-sm text-muted">
            <Building2 className="h-4 w-4 shrink-0" />
            No workspaces yet
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {organizations.map((organization) => (
              <WorkspaceRow
                key={organization.uuid}
                organization={organization}
                isActive={organization.uuid === currentOrganization?.uuid}
                loading={loading}
                canDeleteOrganization={canDeleteOrganization}
                onSelect={() => switchOrganization(organization)}
                onEdit={() => setModalState({ mode: 'edit', organization })}
                onDelete={() => setDeleteTarget(organization)}
              />
            ))}
          </div>
        )}
      </section>

      {modalState && (
        <OrganizationModal
          mode={modalState.mode}
          organization={modalState.mode === 'edit' ? modalState.organization : undefined}
          onClose={() => setModalState(null)}
          onSuccess={handleOrganizationSaved}
        />
      )}

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
        onConfirm={confirmDeleteOrganization}
        onOpenChange={(open) => {
          if (!open && !loading) setDeleteTarget(null);
        }}
      />
    </>
  );
}
