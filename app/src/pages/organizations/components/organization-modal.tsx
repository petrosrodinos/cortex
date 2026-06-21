import { useEffect, useRef, useState } from 'react';
import { Building2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useCreateOrganization,
  useRemoveOrganizationLogo,
  useUpdateOrganization,
  useUploadOrganizationLogo,
} from '@/features/organizations/hooks/use-organizations';
import type { Organization } from '@/features/organizations/interfaces/organization.interfaces';
import { OrganizationLogo } from './organization-logo';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeOrganizationSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

type OrganizationModalProps = {
  mode: 'create' | 'edit';
  organization?: Organization;
  onClose: () => void;
  onSuccess: (organization: Organization) => void;
};

export function OrganizationModal({ mode, organization, onClose, onSuccess }: OrganizationModalProps) {
  const isEdit = mode === 'edit';
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(organization?.name ?? '');
  const [slug, setSlug] = useState(organization?.slug ?? '');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(organization?.logo_url ?? null);
  const [removeExistingLogo, setRemoveExistingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrganizationMutation = useCreateOrganization();
  const updateOrganizationMutation = useUpdateOrganization();
  const uploadOrganizationLogoMutation = useUploadOrganizationLogo();
  const removeOrganizationLogoMutation = useRemoveOrganizationLogo();

  const loading =
    createOrganizationMutation.isPending ||
    updateOrganizationMutation.isPending ||
    uploadOrganizationLogoMutation.isPending ||
    removeOrganizationLogoMutation.isPending;

  const trimmedName = name.trim();
  const normalizedSlug = normalizeOrganizationSlug(slug);
  const nameChanged = isEdit && organization ? trimmedName !== organization.name : false;
  const slugChanged = isEdit && organization ? normalizedSlug !== organization.slug : false;
  const isSlugValid = !isEdit || (normalizedSlug.length >= 2 && slugPattern.test(normalizedSlug));
  const hasLogoChanges = Boolean(logoFile) || (isEdit && removeExistingLogo && organization?.logo_url);
  const canSubmit =
    trimmedName.length >= 2 &&
    isSlugValid &&
    (!isEdit || nameChanged || slugChanged || hasLogoChanges);

  useEffect(() => {
    nameInputRef.current?.focus();
    if (isEdit) {
      nameInputRef.current?.select();
    }
  }, [isEdit]);

  useEffect(() => {
    if (logoFile) {
      const previewUrl = URL.createObjectURL(logoFile);
      setLogoPreview(previewUrl);
      setRemoveExistingLogo(false);
      return () => URL.revokeObjectURL(previewUrl);
    }
    if (removeExistingLogo) {
      setLogoPreview(null);
      return;
    }
    setLogoPreview(organization?.logo_url ?? null);
  }, [logoFile, removeExistingLogo, organization?.logo_url]);

  function handleLogoUpload(file: File) {
    setLogoFile(file);
    setError(null);
  }

  function handleLogoRemove() {
    setLogoFile(null);
    setRemoveExistingLogo(true);
    setError(null);
  }

  async function applyLogoChanges(target: Organization): Promise<Organization> {
    if (logoFile) {
      return uploadOrganizationLogoMutation.mutateAsync({
        organization_uuid: target.uuid,
        file: logoFile,
      });
    }
    if (removeExistingLogo && target.logo_url) {
      return removeOrganizationLogoMutation.mutateAsync({
        organization_uuid: target.uuid,
      });
    }
    return target;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setError(null);

    try {
      if (isEdit && organization) {
        let updated = organization;
        if (nameChanged || slugChanged) {
          updated = await updateOrganizationMutation.mutateAsync({
            organization_uuid: organization.uuid,
            payload: {
              ...(nameChanged ? { name: trimmedName } : {}),
              ...(slugChanged ? { slug: normalizedSlug } : {}),
            },
          });
        }
        updated = await applyLogoChanges(updated);
        onSuccess(updated);
        onClose();
        return;
      }

      const created = await createOrganizationMutation.mutateAsync({ name: trimmedName });
      let nextOrganization = created;
      if (logoFile) {
        try {
          nextOrganization = await uploadOrganizationLogoMutation.mutateAsync({
            organization_uuid: created.uuid,
            file: logoFile,
          });
        } catch (err: any) {
          setError(err?.message ?? 'Workspace created but logo upload failed');
          onSuccess(created);
          onClose();
          return;
        }
      }
      onSuccess(nextOrganization);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? (isEdit ? 'Unable to update workspace' : 'Unable to create workspace'));
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
      <section className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent/15 text-accent">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground">
              {isEdit ? 'Edit workspace' : 'Create workspace'}
            </h2>
            <p className="text-xs text-muted">
              {isEdit ? 'Update the workspace name, slug, and logo.' : 'Add a new workspace for your team.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            title="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-4 p-4">
          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <OrganizationLogo
              name={trimmedName || 'Workspace'}
              logoUrl={logoPreview}
              size="md"
              editable
              loading={uploadOrganizationLogoMutation.isPending || removeOrganizationLogoMutation.isPending}
              onUpload={handleLogoUpload}
              onRemove={logoPreview ? handleLogoRemove : undefined}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Logo</p>
              <p className="text-xs text-muted">Optional. PNG, JPG, or WebP.</p>
            </div>
          </div>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-foreground">Workspace name</span>
            <Input
              ref={nameInputRef}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Acme Inc."
              autoComplete="off"
            />
          </label>

          {isEdit ? (
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-foreground">Slug</span>
              <Input
                value={slug}
                onChange={(event) => setSlug(normalizeOrganizationSlug(event.target.value))}
                placeholder="acme-inc"
                autoComplete="off"
                spellCheck={false}
              />
              {!isSlugValid && normalizedSlug.length > 0 ? (
                <span className="text-xs text-red-400">Use lowercase letters, numbers, and hyphens.</span>
              ) : (
                <span className="text-xs text-muted">Used in URLs and internal references.</span>
              )}
            </label>
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" loading={loading} disabled={!canSubmit} className="sm:w-auto">
              {isEdit ? 'Save changes' : 'Create workspace'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
