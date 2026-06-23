import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AiProviderType } from '@/features/integrations/constants/ai-provider-types';
import {
  CATALOG_PROVIDER_ICON_META,
  aiProviderDefaultModels,
  catalogProviderLabels,
} from '@/features/integrations/constants/provider-metadata';
import { useCreateAiProvider } from '@/features/ai-providers/hooks/use-ai-providers';
import {
  AiProviderApiKeyField,
  AiProviderModelSelect,
  AiProviderUsageLimitsFields,
  DefaultAiProviderToggle,
} from './ai-provider-form-controls';

interface AddAiProviderModalProps {
  organizationUuid: string;
  provider: AiProviderType;
  isFirstAiProvider: boolean;
  onClose: () => void;
}

export function AddAiProviderModal({
  organizationUuid,
  provider,
  isFirstAiProvider,
  onClose,
}: AddAiProviderModalProps) {
  const createProvider = useCreateAiProvider(organizationUuid);
  const [apiKey, setApiKey] = useState('');
  const [defaultModel, setDefaultModel] = useState(aiProviderDefaultModels[provider]);
  const [isDefault, setIsDefault] = useState(isFirstAiProvider);
  const [usageLimitTokens, setUsageLimitTokens] = useState('');
  const [usageLimitCostUsd, setUsageLimitCostUsd] = useState('');

  const iconMeta = CATALOG_PROVIDER_ICON_META[provider];
  const ModalIcon = iconMeta.icon;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await createProvider.mutateAsync({
      provider,
      api_key: apiKey.trim(),
      default_model: defaultModel,
      is_default: isFirstAiProvider || isDefault,
      usage_limit_tokens: usageLimitTokens ? Number(usageLimitTokens) : undefined,
      usage_limit_cost_usd: usageLimitCostUsd ? Number(usageLimitCostUsd) : undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
      <section className="w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-lg border border-border bg-surface shadow-xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            title="Back"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: iconMeta.bg }}
          >
            {ModalIcon ? <ModalIcon size={16} className="text-white" /> : null}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground">{catalogProviderLabels[provider]}</h2>
            <p className="text-xs text-muted">Add API credentials and default model.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-4 p-4">
          <AiProviderModelSelect provider={provider} value={defaultModel} onChange={setDefaultModel} />

          <AiProviderApiKeyField value={apiKey} onChange={setApiKey} />

          <AiProviderUsageLimitsFields
            usageLimitTokens={usageLimitTokens}
            usageLimitCostUsd={usageLimitCostUsd}
            onUsageLimitTokensChange={setUsageLimitTokens}
            onUsageLimitCostUsdChange={setUsageLimitCostUsd}
            optional
          />

          <DefaultAiProviderToggle
            checked={isDefault}
            onChange={setIsDefault}
            disabled={isFirstAiProvider}
          />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createProvider.isPending}
              disabled={!apiKey.trim() || !defaultModel}
              className="sm:w-auto"
            >
              Save
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
