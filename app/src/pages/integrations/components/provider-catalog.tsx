import { useMemo } from 'react';
import { IntegrationProviders, type Integration, type IntegrationProvider } from '@/features/integrations/common/interfaces/integration.interface';
import { PROVIDER_ICON_META, providerLabels, providerDescriptions } from '@/features/integrations/constants/provider-metadata';

interface ProviderCatalogProps {
  integrations: Integration[];
  onConnect: (provider: IntegrationProvider) => void;
  onManage: (integration: Integration) => void;
}

const PROVIDER_CATEGORIES: { label: string; providers: IntegrationProvider[] }[] = [
  {
    label: 'SaaS',
    providers: [
      IntegrationProviders.GITHUB,
      IntegrationProviders.SLACK,
      IntegrationProviders.STRIPE,
      IntegrationProviders.HUBSPOT,
      IntegrationProviders.LINEAR,
      IntegrationProviders.NOTION,
      IntegrationProviders.GOOGLE_DRIVE,
      IntegrationProviders.GMAIL,
      IntegrationProviders.SMTP,
      IntegrationProviders.RESEND,
      IntegrationProviders.SENDGRID,
      IntegrationProviders.POSTHOG,
      IntegrationProviders.INTERCOM,
    ],
  },
  {
    label: 'Databases',
    providers: [
      IntegrationProviders.DATABASE_PG,
      IntegrationProviders.DATABASE_MYSQL,
      IntegrationProviders.DATABASE_MONGO,
    ],
  },
  {
    label: 'Custom',
    providers: [
      IntegrationProviders.OPENAPI,
      IntegrationProviders.MCP,
    ],
  },
];

export function ProviderCatalog({ integrations, onConnect, onManage }: ProviderCatalogProps) {
  const connectedByProvider = useMemo(() => {
    const map = new Map<IntegrationProvider, Integration[]>();
    for (const integration of integrations) {
      const list = map.get(integration.provider) ?? [];
      list.push(integration);
      map.set(integration.provider, list);
    }
    return map;
  }, [integrations]);

  return (
    <div className="flex flex-col gap-8">
      {PROVIDER_CATEGORIES.map((category) => (
        <div key={category.label}>
          <h2 className="mb-3 text-sm font-semibold text-foreground">{category.label}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.providers.map((provider) => {
              const connected = connectedByProvider.get(provider) ?? [];
              return (
                <ProviderCatalogCard
                  key={provider}
                  provider={provider}
                  connected={connected}
                  onConnect={() => onConnect(provider)}
                  onManage={() => onManage(connected[0])}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ProviderCatalogCardProps {
  provider: IntegrationProvider;
  connected: Integration[];
  onConnect: () => void;
  onManage: () => void;
}

function ProviderCatalogCard({ provider, connected, onConnect, onManage }: ProviderCatalogCardProps) {
  const meta = PROVIDER_ICON_META[provider];
  const Icon = meta.icon;
  const isConnected = connected.length > 0;

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
              {connected.length === 1 ? 'Connected' : `${connected.length}`}
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground">{providerLabels[provider]}</p>
        <p className="mt-1 line-clamp-2 text-xs text-muted">{providerDescriptions[provider]}</p>
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
