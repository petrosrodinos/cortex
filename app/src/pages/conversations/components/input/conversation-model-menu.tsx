import { useMemo, type FC } from 'react';
import type { Selection } from '@heroui/react';
import { Dropdown, Label } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes/routes';
import type { AiProvider } from '@/features/ai-providers/interfaces/ai-providers.interfaces';
import {
  AiProviderTypes,
  type AiProviderType,
} from '@/features/integrations/constants/ai-provider-types';
import {
  aiProviderModelOptions,
  catalogProviderLabels,
  CATALOG_PROVIDER_ICON_META,
} from '@/features/integrations/constants/provider-metadata';

const PROVIDER_ORDER: AiProviderType[] = [
  AiProviderTypes.OPENAI,
  AiProviderTypes.CLAUDE,
  AiProviderTypes.GROK,
];

const selectedItemClassName =
  'border border-accent-border bg-accent-bg font-medium text-foreground';

interface ConversationModelMenuProps {
  aiProviders: AiProvider[];
  selectedProvider?: string | null;
  selectedModel?: string | null;
  onSelect: (provider: AiProviderType, model: string) => void;
}

export const ConversationModelMenu: FC<ConversationModelMenuProps> = ({
  aiProviders,
  selectedProvider,
  selectedModel,
  onSelect,
}) => {
  const navigate = useNavigate();
  const connectedProviders = useMemo(
    () => new Set(aiProviders.filter((provider) => provider.has_api_key).map((provider) => provider.provider)),
    [aiProviders],
  );

  return (
    <div className="max-h-[min(220px,38dvh)] w-[240px] overflow-y-auto overscroll-y-contain p-1">
      <Dropdown.Menu
        aria-label="Select model"
        onAction={(key) => {
          const value = String(key);
          if (value.startsWith('connect:')) {
            navigate(Routes.dashboard.settingsAiProviders);
          }
        }}
      >
        {PROVIDER_ORDER.map((provider) => {
          const meta = CATALOG_PROVIDER_ICON_META[provider];
          const Icon = meta.icon;
          const label = catalogProviderLabels[provider];
          const models = aiProviderModelOptions[provider];

          if (!connectedProviders.has(provider)) {
            return (
              <Dropdown.Item
                key={provider}
                id={`connect:${provider}`}
                textValue={`${label} (not connected)`}
                className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-muted"
              >
                <Icon size={16} className="shrink-0 opacity-60" />
                <Label className="min-w-0 flex-1 truncate text-sm">{label}</Label>
                <span className="shrink-0 text-[11px] font-medium text-primary">Connect</span>
              </Dropdown.Item>
            );
          }

          const isActiveProvider = selectedProvider === provider;
          const modelSelectedKeys: Selection =
            isActiveProvider && selectedModel ? new Set([selectedModel]) : new Set<string>();

          return (
            <Dropdown.SubmenuTrigger key={provider}>
              <Dropdown.Item
                id={provider}
                textValue={label}
                className={cn(
                  'gap-2.5 rounded-lg border border-transparent px-2 py-2 pe-9',
                  isActiveProvider && selectedItemClassName,
                )}
              >
                <Icon size={16} className="shrink-0" />
                <Label className="min-w-0 flex-1 truncate text-sm">{label}</Label>
                <Dropdown.SubmenuIndicator className="h-4 w-4 shrink-0 text-muted" />
              </Dropdown.Item>
              <Dropdown.Popover className="z-50 min-w-[200px] overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                <div className="max-h-[min(200px,32dvh)] overflow-y-auto overscroll-y-contain p-1">
                  <Dropdown.Menu
                  aria-label={`${label} models`}
                  selectionMode="single"
                  selectedKeys={modelSelectedKeys}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string | undefined;
                    if (!key) return;
                    onSelect(provider, key);
                  }}
                >
                  {models.map((model) => {
                    const isSelectedModel = isActiveProvider && selectedModel === model.value;
                    return (
                      <Dropdown.Item
                        key={model.value}
                        id={model.value}
                        textValue={model.label}
                        className={cn(
                          'flex items-center gap-2 rounded-lg border border-transparent px-2 py-2',
                          isSelectedModel && selectedItemClassName,
                        )}
                      >
                        <Label className="min-w-0 flex-1 truncate text-sm">{model.label}</Label>
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
                </div>
              </Dropdown.Popover>
            </Dropdown.SubmenuTrigger>
          );
        })}
      </Dropdown.Menu>
    </div>
  );
};
