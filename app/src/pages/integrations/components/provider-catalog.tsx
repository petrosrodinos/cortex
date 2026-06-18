import { useMemo, useState } from 'react';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import type { AiProviderType } from '@/features/integrations/constants/ai-provider-types';
import { INTEGRATION_CATALOG_TABS } from '@/features/integrations/constants/provider-categories';
import type { CatalogProvider } from '@/features/integrations/constants/catalog-provider';
import {
  CATALOG_PROVIDER_ICON_META,
  catalogProviderDescriptions,
  catalogProviderLabels,
} from '@/features/integrations/constants/provider-metadata';
import { isAiCatalogProvider } from '@/features/integrations/utils/integration.utils';
import type { AiProvider } from '@/features/ai-providers/interfaces/ai-providers.interfaces';
import { cn } from '@/lib/utils';

interface ProviderCatalogProps {
  integrations: Integration[];
  aiProviders: AiProvider[];
  onConnect: (provider: CatalogProvider) => void;
  onManageIntegration: (integration: Integration) => void;
  onManageAiProvider: (provider: AiProvider) => void;
}

export function ProviderCatalog({
  integrations,
  aiProviders,
  onConnect,
  onManageIntegration,
  onManageAiProvider,
}: ProviderCatalogProps) {
  const [activeTabId, setActiveTabId] = useState(INTEGRATION_CATALOG_TABS[0].id);

  const connectedByProvider = useMemo(() => {
    const map = new Map<CatalogProvider, Integration[]>();
    for (const integration of integrations) {
      const list = map.get(integration.provider) ?? [];
      list.push(integration);
      map.set(integration.provider, list);
    }
    return map;
  }, [integrations]);

  const connectedAiByType = useMemo(() => {
    const map = new Map<AiProviderType, AiProvider[]>();
    for (const provider of aiProviders) {
      const type = provider.provider as AiProviderType;
      const list = map.get(type) ?? [];
      list.push(provider);
      map.set(type, list);
    }
    return map;
  }, [aiProviders]);

  const activeTab = INTEGRATION_CATALOG_TABS.find((tab) => tab.id === activeTabId) ?? INTEGRATION_CATALOG_TABS[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="-mx-1 overflow-x-auto px-1">
        <div className="flex w-max gap-1 rounded-lg border border-border bg-surface p-1">
          {INTEGRATION_CATALOG_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={cn(
                'shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeTabId === tab.id
                  ? 'bg-surface-secondary text-foreground'
                  : 'text-muted hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <ProviderGrid
        providers={activeTab.providers}
        connectedByProvider={connectedByProvider}
        connectedAiByType={connectedAiByType}
        onConnect={onConnect}
        onManageIntegration={onManageIntegration}
        onManageAiProvider={onManageAiProvider}
      />
    </div>
  );
}

interface ProviderGridProps {
  providers: CatalogProvider[];
  connectedByProvider: Map<CatalogProvider, Integration[]>;
  connectedAiByType: Map<AiProviderType, AiProvider[]>;
  onConnect: (provider: CatalogProvider) => void;
  onManageIntegration: (integration: Integration) => void;
  onManageAiProvider: (provider: AiProvider) => void;
}

function ProviderGrid({
  providers,
  connectedByProvider,
  connectedAiByType,
  onConnect,
  onManageIntegration,
  onManageAiProvider,
}: ProviderGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {providers.map((provider) => {
        if (isAiCatalogProvider(provider)) {
          const connected = connectedAiByType.get(provider) ?? [];
          return (
            <ProviderCatalogCard
              key={provider}
              provider={provider}
              connectedCount={connected.length}
              onConnect={() => onConnect(provider)}
              onManage={() => onManageAiProvider(connected[0])}
            />
          );
        }

        const connected = connectedByProvider.get(provider) ?? [];
        return (
          <ProviderCatalogCard
            key={provider}
            provider={provider}
            connectedCount={connected.length}
            onConnect={() => onConnect(provider)}
            onManage={() => onManageIntegration(connected[0])}
          />
        );
      })}
    </div>
  );
}

interface ProviderCatalogCardProps {
  provider: CatalogProvider;
  connectedCount: number;
  onConnect: () => void;
  onManage: () => void;
}

function ProviderCatalogCard({ provider, connectedCount, onConnect, onManage }: ProviderCatalogCardProps) {
  const meta = CATALOG_PROVIDER_ICON_META[provider];
  const Icon = meta.icon;
  const isConnected = connectedCount > 0;

  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface transition-colors hover:bg-surface-secondary">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: meta.bg }}
          >
            <Icon size={20} className="text-white" />
          </div>
          {isConnected ? (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-300">
              {connectedCount === 1 ? 'Connected' : `${connectedCount}`}
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground">{catalogProviderLabels[provider]}</p>
        <p className="mt-1 line-clamp-2 text-xs text-muted">{catalogProviderDescriptions[provider]}</p>
      </div>
      <div className="border-t border-border px-5 py-3">
        {isConnected ? (
          <button
            type="button"
            onClick={onManage}
            className="w-full rounded-md bg-surface-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-tertiary"
          >
            Manage
          </button>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="w-full rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
