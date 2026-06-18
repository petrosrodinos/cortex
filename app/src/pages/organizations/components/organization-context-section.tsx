import { useEffect, useRef, useState } from 'react';
import { Building2, Check, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { OrganizationsPageSkeleton } from '@/components/organizations/organizations-page-skeleton';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  useCreateOrganization,
  useDeleteOrganization,
  useGetOrganizations,
  useSwitchOrganization,
  useUpdateOrganization,
} from '@/features/organizations/hooks/use-organizations';
import type { Organization } from '@/features/organizations/interfaces/organization.interfaces';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationStore } from '@/stores/organization';

function organizationInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

type WorkspaceRowProps = {
  organization: Organization;
  isActive: boolean;
  isEditing: boolean;
  editName: string;
  loading: boolean;
  canDelete: boolean;
  isSaving: boolean;
  editInputRef: React.RefObject<HTMLInputElement | null>;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onEditNameChange: (value: string) => void;
  onSaveEdit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
};

function WorkspaceRow({
  organization,
  isActive,
  isEditing,
  editName,
  loading,
  canDelete,
  isSaving,
  editInputRef,
  onSelect,
  onEdit,
  onDelete,
  onEditNameChange,
  onSaveEdit,
  onCancelEdit,
}: WorkspaceRowProps) {
  if (isEditing) {
    return (
      <form
        onSubmit={onSaveEdit}
        className="flex flex-col gap-2 rounded-lg border border-accent/30 bg-accent/5 p-3 sm:flex-row sm:items-center"
      >
        <input
          ref={editInputRef}
          value={editName}
          onChange={(event) => onEditNameChange(event.target.value)}
          placeholder="Workspace name"
          className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted outline-none transition-all focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
        />
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-3 text-sm text-muted transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || editName.trim().length < 2 || editName.trim() === organization.name}
            className="inline-flex h-9 min-w-[4.5rem] items-center justify-center rounded-lg bg-accent px-3 text-sm font-medium text-accent-foreground transition-opacity disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
          </button>
        </div>
      </form>
    );
  }

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
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold',
            isActive ? 'bg-accent text-accent-foreground' : 'bg-surface-tertiary text-muted',
          )}
        >
          {organizationInitials(organization.name)}
        </span>
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
        <button
          type="button"
          disabled={loading}
          title={`Rename ${organization.name}`}
          onClick={onEdit}
          className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface-secondary hover:text-foreground disabled:opacity-40"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={loading || !canDelete}
          title={canDelete ? `Delete ${organization.name}` : 'You must keep at least one workspace'}
          onClick={onDelete}
          className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function OrganizationContextSection() {
  const {
    current_organization: currentOrganization,
    organizations,
    setCurrentOrganization,
    setOrganizations,
  } = useOrganizationStore();
  const updateUser = useAuthStore((state) => state.update_user);
  const [organizationName, setOrganizationName] = useState('');
  const [editName, setEditName] = useState('');
  const [editingOrganizationUuid, setEditingOrganizationUuid] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const organizationsQuery = useGetOrganizations();
  const createOrganizationMutation = useCreateOrganization();
  const updateOrganizationMutation = useUpdateOrganization();
  const deleteOrganizationMutation = useDeleteOrganization();
  const switchOrganizationMutation = useSwitchOrganization();
  const loading =
    isBusy ||
    organizationsQuery.isLoading ||
    createOrganizationMutation.isPending ||
    updateOrganizationMutation.isPending ||
    deleteOrganizationMutation.isPending ||
    switchOrganizationMutation.isPending;
  const canDeleteOrganization = organizations.length > 1;
  const editingOrganization = organizations.find((organization) => organization.uuid === editingOrganizationUuid) ?? null;

  useEffect(() => {
    if (organizationsQuery.data) setOrganizations(organizationsQuery.data);
  }, [organizationsQuery.data, setOrganizations]);

  useEffect(() => {
    if (editingOrganizationUuid) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editingOrganizationUuid]);

  function startEditing(organization: Organization) {
    setEditingOrganizationUuid(organization.uuid);
    setEditName(organization.name);
  }

  function cancelEditing() {
    setEditingOrganizationUuid(null);
    setEditName('');
  }

  async function renameOrganization(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingOrganization) return;
    const trimmed = editName.trim();
    if (!trimmed || trimmed === editingOrganization.name) {
      cancelEditing();
      return;
    }
    setIsBusy(true);
    setError(null);
    try {
      const updated = await updateOrganizationMutation.mutateAsync({
        organization_uuid: editingOrganization.uuid,
        payload: { name: trimmed },
      });
      setOrganizations(organizations.map((organization) => (organization.uuid === updated.uuid ? updated : organization)));
      if (currentOrganization?.uuid === updated.uuid) {
        setCurrentOrganization(updated);
      }
      cancelEditing();
    } catch (err: any) {
      setError(err?.message ?? 'Unable to rename organisation');
    } finally {
      setIsBusy(false);
    }
  }

  async function switchOrganization(organization: Organization) {
    if (organization.uuid === currentOrganization?.uuid) return;
    cancelEditing();
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
      if (deletedUuid === editingOrganizationUuid) {
        cancelEditing();
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
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">Workspace</span>
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />}
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
                isEditing={organization.uuid === editingOrganizationUuid}
                editName={editName}
                loading={loading}
                canDelete={canDeleteOrganization}
                isSaving={updateOrganizationMutation.isPending}
                editInputRef={editInputRef}
                onSelect={() => switchOrganization(organization)}
                onEdit={() => startEditing(organization)}
                onDelete={() => setDeleteTarget(organization)}
                onEditNameChange={setEditName}
                onSaveEdit={renameOrganization}
                onCancelEdit={cancelEditing}
              />
            ))}
          </div>
        )}

        <form
          onSubmit={createOrganization}
          className="flex flex-col gap-2 border-t border-border/60 pt-4 sm:flex-row"
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
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground transition-opacity disabled:opacity-50 sm:min-w-[7.5rem]"
          >
            {createOrganizationMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
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
        onConfirm={confirmDeleteOrganization}
        onOpenChange={(open) => {
          if (!open && !loading) setDeleteTarget(null);
        }}
      />
    </>
  );
}
