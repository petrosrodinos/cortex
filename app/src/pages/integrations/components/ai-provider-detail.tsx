import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Coins,
  KeyRound,
  Pencil,
  Sparkles,
  Star,
  Trash2,
  XCircle,
  Zap,
} from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AiProviderType } from '@/features/integrations/constants/ai-provider-types';
import type { CatalogProvider } from '@/features/integrations/constants/catalog-provider';
import {
  CATALOG_PROVIDER_ICON_META,
  aiProviderModelOptions,
  catalogProviderLabels,
} from '@/features/integrations/constants/provider-metadata';
import type { AiProvider } from '@/features/ai-providers/interfaces/ai-providers.interfaces';
import { useDeleteAiProvider, useUpdateAiProvider } from '@/features/ai-providers/hooks/use-ai-providers';
import { Routes } from '@/routes/routes';
import { cn } from '@/lib/utils';
import { AiProviderModelSelect } from './ai-provider-form-controls';

interface AiProviderDetailProps {
  organizationUuid: string;
  provider: AiProvider;
}

function formatLimit(value: number | undefined, formatter: (n: number) => string): string {
  if (value == null) return 'Unlimited';
  return formatter(value);
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
  const catalogProvider = provider.provider as CatalogProvider;
  const iconMeta = CATALOG_PROVIDER_ICON_META[catalogProvider];
  const ProviderIcon = iconMeta?.icon;
  const loading = updateProvider.isPending || deleteProvider.isPending;

  const modelOptions = aiProviderModelOptions[providerType] ?? [];
  const modelLabel = useMemo(
    () => modelOptions.find((option) => option.value === provider.default_model)?.label ?? provider.default_model,
    [modelOptions, provider.default_model],
  );

  const connectedSince = useMemo(
    () =>
      new Date(provider.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    [provider.created_at],
  );

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
      <div className="flex flex-col gap-5">
        {!provider.has_api_key ? (
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-amber-600 dark:text-amber-300">API key required</p>
              <p className="mt-0.5 text-xs text-amber-600/80 dark:text-amber-300/80">
                Agents cannot use this provider until you add a valid API key.
              </p>
            </div>
            <button
              type="button"
              onClick={openEdit}
              disabled={loading}
              className="ml-auto shrink-0 rounded-md bg-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-500/30 dark:text-amber-200"
            >
              Add key
            </button>
          </div>
        ) : null}

        <section className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="relative border-b border-border px-5 py-5 sm:px-6">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 0% 0%, ${iconMeta?.bg ?? '#6b7280'}, transparent)`,
              }}
            />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm"
                  style={{ backgroundColor: iconMeta?.bg ?? '#6b7280' }}
                >
                  {ProviderIcon ? <ProviderIcon size={22} className="text-white" /> : null}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-foreground">
                      {catalogProviderLabels[catalogProvider] ?? provider.provider}
                    </h2>
                    {provider.is_default ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        Default
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium',
                        provider.has_api_key
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400',
                      )}
                    >
                      {provider.has_api_key ? (
                        <>
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Connected
                        </>
                      ) : (
                        <>
                          <XCircle className="h-2.5 w-2.5" />
                          Not configured
                        </>
                      )}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted">Connected since {connectedSince}</p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={openEdit}
                  title="Edit provider"
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted transition-colors hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                {!provider.is_default ? (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={toggleDefault}
                    title="Set as default"
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 text-sm text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
                  >
                    <Star className="h-4 w-4" />
                    Set default
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setConfirmRemove(true)}
                  title="Remove provider"
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 text-sm text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Sparkles}
              label="Default model"
              value={modelLabel}
              detail={provider.default_model}
            />
            <MetricCard
              icon={KeyRound}
              label="API key"
              value={provider.has_api_key ? 'Configured' : 'Missing'}
              detail={provider.has_api_key ? 'Stored securely' : 'Add to enable agents'}
              variant={provider.has_api_key ? 'success' : 'danger'}
            />
            <MetricCard
              icon={Zap}
              label="Token limit"
              value={formatLimit(provider.usage_limit_tokens, (n) => n.toLocaleString())}
              detail={provider.usage_limit_tokens ? 'Monthly cap' : 'No cap set'}
            />
            <MetricCard
              icon={Coins}
              label="Cost limit"
              value={formatLimit(provider.usage_limit_cost_usd, (n) => `$${n}`)}
              detail={provider.usage_limit_cost_usd ? 'Monthly cap' : 'No cap set'}
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Available models</h3>
              <p className="text-xs text-muted">
                Models supported by this provider. The default is used when no model is specified.
              </p>
            </div>
            <span className="mt-2 w-fit rounded-md bg-surface-secondary px-2.5 py-1 text-xs text-muted sm:mt-0">
              {modelOptions.length} model{modelOptions.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {modelOptions.map((option) => {
              const isActive = option.value === provider.default_model;
              return (
                <div
                  key={option.value}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors',
                    isActive
                      ? 'border-accent/40 bg-accent/10'
                      : 'border-border bg-background/40',
                  )}
                >
                  <div className="min-w-0">
                    <p className={cn('text-sm font-medium', isActive ? 'text-accent' : 'text-foreground')}>
                      {option.label}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs text-muted">{option.value}</p>
                  </div>
                  {isActive ? (
                    <span className="shrink-0 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                      Active
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {editOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-[color-mix(in_oklch,black_42%,transparent)]"
            onClick={() => setEditOpen(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-ai-provider-title"
            className="relative w-full max-w-lg rounded-xl border border-border bg-surface shadow-xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: iconMeta?.bg ?? '#6b7280' }}
              >
                {ProviderIcon ? <ProviderIcon size={16} className="text-white" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="edit-ai-provider-title" className="text-sm font-semibold text-foreground">
                  Edit AI provider
                </h2>
                <p className="text-xs text-muted">{catalogProviderLabels[catalogProvider]}</p>
              </div>
            </div>

            <div className="grid gap-4 p-5">
              <AiProviderModelSelect
                provider={providerType}
                value={defaultModel}
                onChange={setDefaultModel}
              />
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-foreground">New API key</span>
                <span className="text-xs text-muted">Leave blank to keep the current key</span>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder="sk-..."
                  autoComplete="off"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Token limit</span>
                  <Input
                    type="number"
                    value={usageLimitTokens}
                    onChange={(event) => setUsageLimitTokens(event.target.value)}
                    placeholder="1000000"
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Cost limit (USD)</span>
                  <Input
                    type="number"
                    value={usageLimitCostUsd}
                    onChange={(event) => setUsageLimitCostUsd(event.target.value)}
                    placeholder="50"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={saveEdit} loading={updateProvider.isPending} disabled={!defaultModel}>
                Save changes
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

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
  variant?: 'default' | 'success' | 'danger';
}

function MetricCard({ icon: Icon, label, value, detail, variant = 'default' }: MetricCardProps) {
  return (
    <div className="bg-surface px-5 py-4">
      <div className="flex items-center gap-2">
        <Icon
          className={cn(
            'h-3.5 w-3.5',
            variant === 'success' && 'text-emerald-500',
            variant === 'danger' && 'text-red-500',
            variant === 'default' && 'text-muted',
          )}
        />
        <p className="text-xs text-muted">{label}</p>
      </div>
      <p
        className={cn(
          'mt-2 text-lg font-semibold leading-tight',
          variant === 'success' && 'text-emerald-600 dark:text-emerald-300',
          variant === 'danger' && 'text-red-600 dark:text-red-400',
          variant === 'default' && 'text-foreground',
        )}
      >
        {value}
      </p>
      <p className="mt-1 truncate text-xs text-muted">{detail}</p>
    </div>
  );
}
