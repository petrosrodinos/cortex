import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AiProviderType } from '@/features/integrations/constants/ai-provider-types';
import { catalogProviderLabels } from '@/features/integrations/constants/provider-metadata';
import type { AiProvider } from '@/features/settings/services/settings.service';
import { useDeleteAiProvider, useUpdateAiProvider } from '@/features/settings/hooks/use-settings';
import { Routes } from '@/routes/routes';
import { AiProviderModelSelect } from './ai-provider-form-controls';

interface AiProviderDetailProps {
  organizationUuid: string;
  provider: AiProvider;
}

export function AiProviderDetail({ organizationUuid, provider }: AiProviderDetailProps) {
  const navigate = useNavigate();
  const updateProvider = useUpdateAiProvider(organizationUuid);
  const deleteProvider = useDeleteAiProvider(organizationUuid);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [defaultModel, setDefaultModel] = useState(provider.default_model);
  const [apiKey, setApiKey] = useState('');
  const [usageLimitTokens, setUsageLimitTokens] = useState(
    provider.usage_limit_tokens != null ? String(provider.usage_limit_tokens) : '',
  );
  const [usageLimitCostUsd, setUsageLimitCostUsd] = useState(
    provider.usage_limit_cost_usd != null ? String(provider.usage_limit_cost_usd) : '',
  );

  const providerType = provider.provider as AiProviderType;
  const loading = updateProvider.isPending || deleteProvider.isPending;

  function openEdit() {
    setDefaultModel(provider.default_model);
    setApiKey('');
    setUsageLimitTokens(provider.usage_limit_tokens != null ? String(provider.usage_limit_tokens) : '');
    setUsageLimitCostUsd(provider.usage_limit_cost_usd != null ? String(provider.usage_limit_cost_usd) : '');
    setEditOpen(true);
  }

  async function saveEdit() {
    await updateProvider.mutateAsync({
      providerUuid: provider.uuid,
      payload: {
        default_model: defaultModel,
        api_key: apiKey.trim() || undefined,
        usage_limit_tokens: usageLimitTokens ? Number(usageLimitTokens) : undefined,
        usage_limit_cost_usd: usageLimitCostUsd ? Number(usageLimitCostUsd) : undefined,
      },
    });
    setEditOpen(false);
  }

  async function removeProvider() {
    await deleteProvider.mutateAsync(provider.uuid);
    setConfirmRemove(false);
    navigate(Routes.dashboard.integrations);
  }

  function toggleDefault() {
    updateProvider.mutate({
      providerUuid: provider.uuid,
      payload: { is_default: !provider.is_default },
    });
  }

  return (
    <>
      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-semibold text-foreground">
                {catalogProviderLabels[provider.provider as keyof typeof catalogProviderLabels] ?? provider.provider}
              </h2>
              {provider.is_default ? (
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
                  Default
                </span>
              ) : null}
              <button
                type="button"
                onClick={openEdit}
                disabled={loading}
                title="Edit provider"
                className="grid h-5 w-5 place-items-center rounded text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-40"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted">Model: {provider.default_model}</p>
            <p className="mt-1 text-xs text-muted">
              API key: {provider.has_api_key ? 'Configured' : 'Missing'}
            </p>
            {provider.usage_limit_tokens ? (
              <p className="mt-1 text-xs text-muted">
                Token limit: {provider.usage_limit_tokens.toLocaleString()}
              </p>
            ) : null}
            {provider.usage_limit_cost_usd ? (
              <p className="mt-1 text-xs text-muted">Cost limit: ${provider.usage_limit_cost_usd}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {!provider.is_default ? (
              <Button
                type="button"
                variant="outline"
                onClick={toggleDefault}
                disabled={loading}
                className="h-9 px-3 text-sm"
              >
                Set default
              </Button>
            ) : null}
            <button
              type="button"
              disabled={loading}
              onClick={() => setConfirmRemove(true)}
              title="Remove provider"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 text-sm text-red-600 hover:bg-red-500/20 dark:text-red-400 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      </section>

      {editOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
          <section className="w-full max-w-lg rounded-lg border border-border bg-surface p-4 shadow-xl">
            <h3 className="text-sm font-semibold text-foreground">Edit AI provider</h3>
            <div className="mt-4 grid gap-3">
              <AiProviderModelSelect
                provider={providerType}
                value={defaultModel}
                onChange={setDefaultModel}
              />
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-foreground">New API key (optional)</span>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder="Leave blank to keep current key"
                  autoComplete="off"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  <span className="font-medium text-foreground">Token limit</span>
                  <Input
                    type="number"
                    value={usageLimitTokens}
                    onChange={(event) => setUsageLimitTokens(event.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="font-medium text-foreground">Cost limit USD</span>
                  <Input
                    type="number"
                    value={usageLimitCostUsd}
                    onChange={(event) => setUsageLimitCostUsd(event.target.value)}
                  />
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={saveEdit} loading={updateProvider.isPending} disabled={!defaultModel}>
                Save
              </Button>
            </div>
          </section>
        </div>
      ) : null}

      <ConfirmationDialog
        open={confirmRemove}
        onOpenChange={setConfirmRemove}
        title="Remove AI provider?"
        description="Agents will no longer be able to use this provider until you connect it again."
        confirmLabel="Remove"
        onConfirm={removeProvider}
        loading={deleteProvider.isPending}
        variant="danger"
      />
    </>
  );
}
