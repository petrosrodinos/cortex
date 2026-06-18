import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useOrganizationStore } from '@/stores/organization';
import {
  useCreateAiProvider,
  useDeleteAiProvider,
  useGetAiProviders,
  useUpdateAiProvider,
} from '@/features/settings/hooks/use-settings';
import type { CreateAiProviderDto } from '@/features/settings/services/settings.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PROVIDERS = ['OPENAI', 'CLAUDE', 'GROK'];

const emptyForm: CreateAiProviderDto = {
  provider: 'OPENAI',
  api_key: '',
  default_model: '',
  is_default: false,
  usage_limit_tokens: undefined,
  usage_limit_cost_usd: undefined,
};

export default function AiProvidersPage() {
  const orgUuid = useOrganizationStore((s) => s.current_organization?.uuid);
  const { data: providers = [], isLoading } = useGetAiProviders(orgUuid);
  const createProvider = useCreateAiProvider(orgUuid);
  const updateProvider = useUpdateAiProvider(orgUuid);
  const deleteProvider = useDeleteAiProvider(orgUuid);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateAiProviderDto>(emptyForm);

  const handleCreate = async () => {
    await createProvider.mutateAsync(form);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleToggleDefault = (providerUuid: string, currentValue: boolean) => {
    updateProvider.mutate({ providerUuid, payload: { is_default: !currentValue } });
  };

  const handleDelete = (providerUuid: string) => {
    deleteProvider.mutate(providerUuid);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">AI Providers</h2>
          <p className="mt-0.5 text-xs text-muted">Configure AI provider credentials and defaults.</p>
        </div>
        <Button className="h-8 px-3 text-xs" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add provider'}
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3">
          <h3 className="text-sm font-medium text-foreground">New AI provider</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted">Provider</label>
              <select
                value={form.provider}
                onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {PROVIDERS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted">Default model</label>
              <Input
                value={form.default_model}
                onChange={(e) => setForm((f) => ({ ...f, default_model: e.target.value }))}
                placeholder="e.g. gpt-4o"
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs text-muted">API key</label>
              <Input
                type="password"
                value={form.api_key}
                onChange={(e) => setForm((f) => ({ ...f, api_key: e.target.value }))}
                placeholder="sk-..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted">Token limit (optional)</label>
              <Input
                type="number"
                value={form.usage_limit_tokens ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, usage_limit_tokens: e.target.value ? Number(e.target.value) : undefined }))
                }
                placeholder="e.g. 1000000"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted">Cost limit USD (optional)</label>
              <Input
                type="number"
                value={form.usage_limit_cost_usd ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, usage_limit_cost_usd: e.target.value ? Number(e.target.value) : undefined }))
                }
                placeholder="e.g. 50"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                id="is_default"
                type="checkbox"
                checked={!!form.is_default}
                onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
                className="h-4 w-4 accent-accent"
              />
              <label htmlFor="is_default" className="text-sm text-foreground">Set as default provider</label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleCreate}
              disabled={createProvider.isPending || !form.api_key.trim() || !form.default_model.trim()}
            >
              {createProvider.isPending ? 'Adding...' : 'Add provider'}
            </Button>
          </div>
        </div>
      )}

      {isLoading && <p className="text-sm text-muted">Loading...</p>}

      <div className="flex flex-col gap-3">
        {providers.map((provider) => (
          <div
            key={provider.uuid}
            className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4"
          >
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{provider.provider}</span>
                {provider.is_default && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
                    Default
                  </span>
                )}
              </div>
              <span className="text-xs text-muted">Model: {provider.default_model}</span>
              {provider.usage_limit_tokens && (
                <span className="text-xs text-muted">Token limit: {provider.usage_limit_tokens.toLocaleString()}</span>
              )}
              {provider.usage_limit_cost_usd && (
                <span className="text-xs text-muted">Cost limit: ${provider.usage_limit_cost_usd}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!provider.is_default && (
                <Button
                  variant="outline"
                  className="h-8 px-3 text-xs"
                  onClick={() => handleToggleDefault(provider.uuid, provider.is_default)}
                  disabled={updateProvider.isPending}
                >
                  Set default
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => handleDelete(provider.uuid)}
                disabled={deleteProvider.isPending}
                className="h-9 w-9 p-0 shrink-0 text-red-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {!isLoading && providers.length === 0 && (
          <p className="text-sm text-muted">No AI providers configured yet.</p>
        )}
      </div>
    </div>
  );
}
