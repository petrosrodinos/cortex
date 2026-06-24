import { useMemo } from 'react';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import type { AiProviderType } from '@/features/integrations/constants/ai-provider-types';
import {
  CATALOG_PROVIDERS_BY_SECTION,
  type ProviderCatalogSection,
} from '@/features/integrations/constants/provider-categories';
import type { CatalogProvider } from '@/features/integrations/constants/catalog-provider';
import {
  CATALOG_PROVIDER_ICON_META,
  catalogProviderDescriptions,
  catalogProviderLabels,
} from '@/features/integrations/constants/provider-metadata';
import { isAiCatalogProvider } from '@/features/integrations/utils/integration.utils';
import type { AiProvider } from '@/features/ai-providers/interfaces/ai-providers.interfaces';
import { OrganizationPermissionGate } from '@/components/permissions/organization-permission-gate';
import { PermissionKeys } from '@/features/permissions/interfaces/permission.interfaces';
import {
  IntegrationCatalogCard,
  IntegrationCatalogCardAction,
  IntegrationCatalogConnectedBadge,
  integrationCatalogGridClassName,
} from './integration-catalog-card';

interface ProviderCatalogProps {
  integrations: Integration[];
  aiProviders: AiProvider[];
  section: ProviderCatalogSection;
  onConnect: (provider: CatalogProvider) => void;
  onManageIntegration: (integration: Integration) => void;
  onManageAiProvider: (provider: AiProvider) => void;
}

export function ProviderCatalog({
  integrations,
  aiProviders,
  section,
  onConnect,
  onManageIntegration,
  onManageAiProvider,
}: ProviderCatalogProps) {
  const providers = CATALOG_PROVIDERS_BY_SECTION[section];

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

  return (
    <ProviderGrid
      providers={providers}
      connectedByProvider={connectedByProvider}
      connectedAiByType={connectedAiByType}
      onConnect={onConnect}
      onManageIntegration={onManageIntegration}
      onManageAiProvider={onManageAiProvider}
    />
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
    <div className={integrationCatalogGridClassName}>
      {providers.map((provider) => {
        if (isAiCatalogProvider(provider)) {
          const connected = connectedAiByType.get(provider) ?? [];
          return (
            <ProviderCatalogCard
              key={provider}
              provider={provider}
              connectedCount={connected.length}
              isAiProvider
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
  isAiProvider?: boolean;
  onConnect: () => void;
  onManage: () => void;
}

function ProviderCatalogCard({
  provider,
  connectedCount,
  isAiProvider = false,
  onConnect,
  onManage,
}: ProviderCatalogCardProps) {
  const meta = CATALOG_PROVIDER_ICON_META[provider];
  const Icon = meta.icon;
  const isConnected = connectedCount > 0;
  const managePermission = isAiProvider ? PermissionKeys.AI_PROVIDERS_MANAGE : PermissionKeys.INTEGRATIONS_MANAGE;
  const connectPermission = isAiProvider ? PermissionKeys.AI_PROVIDERS_MANAGE : PermissionKeys.INTEGRATIONS_CONNECT;

  return (
    <IntegrationCatalogCard
      icon={
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: meta.bg }}
        >
          <Icon size={20} className="text-white" />
        </div>
      }
      title={catalogProviderLabels[provider]}
      description={
        <p className="line-clamp-2 text-xs text-muted">{catalogProviderDescriptions[provider]}</p>
      }
      badge={
        isConnected ? (
          <IntegrationCatalogConnectedBadge
            label={connectedCount === 1 ? 'Connected' : `${connectedCount}`}
          />
        ) : undefined
      }
      footer={
        isConnected ? (
          <OrganizationPermissionGate permission={managePermission}>
            <IntegrationCatalogCardAction variant="secondary" onClick={onManage}>
              Manage
            </IntegrationCatalogCardAction>
          </OrganizationPermissionGate>
        ) : (
          <OrganizationPermissionGate permission={connectPermission}>
            <IntegrationCatalogCardAction onClick={onConnect}>Connect</IntegrationCatalogCardAction>
          </OrganizationPermissionGate>
        )
      }
    />
  );
}
