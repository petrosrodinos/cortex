import { useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGetIntegrations } from '@/features/integrations/common/hooks/use-integrations';
import {
  IntegrationStatuses,
  type Integration,
} from '@/features/integrations/common/interfaces/integration.interface';
import type { CatalogProvider } from '@/features/integrations/constants/catalog-provider';
import {
  CATALOG_PROVIDER_ICON_META,
  catalogProviderDescriptions,
  catalogProviderLabels,
  PROVIDER_ICON_META,
  providerLabels,
} from '@/features/integrations/constants/provider-metadata';
import { isAiCatalogProvider } from '@/features/integrations/utils/integration.utils';
import { useGetAiProviders } from '@/features/ai-providers/hooks/use-ai-providers';
import type { AiProvider } from '@/features/ai-providers/interfaces/ai-providers.interfaces';
import { ToolkitCatalog } from './components/integration-apps/toolkit-catalog';
import { useGetIntegrationAppsToolkitsCount } from '@/features/integration-apps/hooks/use-integrationApps';
import { Routes } from '@/routes/routes';
import { useOrganizationStore } from '@/stores/organization';
import { OrganizationPermissionGate } from '@/components/permissions/organization-permission-gate';
import { PermissionKeys } from '@/features/permissions/interfaces/permission.interfaces';
import { cn } from '@/lib/utils';
import { AiProviderDetail } from './components/ai-providers/ai-provider-detail';
import { IntegrationDetail } from './components/connections/integration-detail';
import { IntegrationsSkeleton } from './components/shared/integrations-skeleton';
import { NoOrgPanel } from './components/shared/no-org-panel';
import { ProviderCatalog } from './components/shared/provider-catalog';
import { AddIntegrationModal } from './components/connections/add-integration-modal';
import { AddAiProviderModal } from './components/ai-providers/add-ai-provider-modal';

type IntegrationSection = 'integrationApps' | 'databases' | 'externalConnections' | 'ai';

const INTEGRATION_SECTIONS = new Set<IntegrationSection>([
  'integrationApps',
  'databases',
  'externalConnections',
  'ai',
]);

function resolveIntegrationSection(value: string | null): IntegrationSection {
  if (value && INTEGRATION_SECTIONS.has(value as IntegrationSection)) {
    return value as IntegrationSection;
  }

  return 'integrationApps';
}

export default function IntegrationsPage() {
  const { integrationUuid, aiProviderUuid } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const [connectingProvider, setConnectingProvider] = useState<CatalogProvider | null>(null);
  const activeSection = resolveIntegrationSection(searchParams.get('section'));

  const handleSectionChange = useCallback(
    (section: IntegrationSection) => {
      navigate(Routes.dashboard.integrationsSection(section));
    },
    [navigate],
  );
  const integrationsQuery = useGetIntegrations(currentOrganization?.uuid);
  const aiProvidersQuery = useGetAiProviders(currentOrganization?.uuid);
  const connectedToolkitsQuery = useGetIntegrationAppsToolkitsCount(currentOrganization?.uuid, {
    connected: true,
  });
  const integrations = integrationsQuery.data ?? [];
  const aiProviders = aiProvidersQuery.data ?? [];
  const connectedToolkitsCount = connectedToolkitsQuery.data?.count ?? 0;

  const selectedIntegration = useMemo(
    () => integrations.find((integration) => integration.uuid === integrationUuid) ?? null,
    [integrationUuid, integrations],
  );

  const selectedAiProvider = useMemo(
    () => aiProviders.find((provider) => provider.uuid === aiProviderUuid) ?? null,
    [aiProviderUuid, aiProviders],
  );

  const activeIntegrationsCount = useMemo(() => {
    const activeIntegrations = integrations.filter(
      (integration) => integration.status === IntegrationStatuses.ACTIVE,
    ).length;
    return activeIntegrations + aiProviders.length + connectedToolkitsCount;
  }, [integrations, aiProviders, connectedToolkitsCount]);

  function handleManageIntegration(integration: Integration) {
    navigate(Routes.dashboard.integration(integration.uuid));
  }

  function handleManageAiProvider(provider: AiProvider) {
    navigate(Routes.dashboard.aiProvider(provider.uuid));
  }

  const isIntegrationDetail = !!(integrationUuid && selectedIntegration);
  const isAiProviderDetail = !!(aiProviderUuid && selectedAiProvider);
  const isDetailView = isIntegrationDetail || isAiProviderDetail;

  const detailIconMeta = isIntegrationDetail
    ? PROVIDER_ICON_META[selectedIntegration.provider]
    : isAiProviderDetail
      ? CATALOG_PROVIDER_ICON_META[selectedAiProvider.provider as CatalogProvider]
      : null;
  const DetailIcon = detailIconMeta?.icon;

  const detailTitle = isIntegrationDetail
    ? selectedIntegration.name
    : isAiProviderDetail
      ? catalogProviderLabels[selectedAiProvider.provider as CatalogProvider] ?? selectedAiProvider.provider
      : '';

  const detailSubtitle = isIntegrationDetail
    ? providerLabels[selectedIntegration.provider]
    : isAiProviderDetail
      ? catalogProviderDescriptions[selectedAiProvider.provider as CatalogProvider] ?? selectedAiProvider.default_model
      : '';

  const loading = integrationsQuery.isLoading || aiProvidersQuery.isLoading;
  const countsLoading = loading || connectedToolkitsQuery.isLoading;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      {isDetailView ? (
        <header className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate(Routes.dashboard.integrations)}
            className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm"
            style={{ backgroundColor: detailIconMeta?.bg ?? '#6b7280' }}
          >
            {DetailIcon ? <DetailIcon size={18} className="text-white" /> : null}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold leading-tight text-foreground">{detailTitle}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted">{detailSubtitle}</p>
          </div>
        </header>
      ) : (
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">Integrations</h1>
            {!countsLoading ? (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {activeIntegrationsCount} active
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted">Connect systems and choose which actions the agent can use.</p>
        </header>
      )}

      {!currentOrganization ? (
        <NoOrgPanel />
      ) : loading ? (
        <IntegrationsSkeleton />
      ) : isIntegrationDetail && selectedIntegration ? (
        <IntegrationDetail
          organizationUuid={currentOrganization.uuid}
          integration={selectedIntegration}
        />
      ) : isAiProviderDetail && selectedAiProvider ? (
        <AiProviderDetail
          organizationUuid={currentOrganization.uuid}
          provider={selectedAiProvider}
        />
      ) : (
        <div className="flex flex-col gap-5">
          <IntegrationSectionTabs activeSection={activeSection} onSectionChange={handleSectionChange} />
          {activeSection === 'integrationApps' ? (
            <ToolkitCatalog
              organizationUuid={currentOrganization.uuid}
              onSelectToolkit={(toolkitSlug) => navigate(Routes.dashboard.integrationApp(toolkitSlug))}
            />
          ) : (
            <ProviderCatalog
              integrations={integrations}
              aiProviders={activeSection === 'ai' ? aiProviders : []}
              onConnect={(provider) => setConnectingProvider(provider)}
              onManageIntegration={handleManageIntegration}
              onManageAiProvider={handleManageAiProvider}
              section={activeSection}
            />
          )}
        </div>
      )}

      {connectingProvider && currentOrganization && isAiCatalogProvider(connectingProvider) ? (
        <OrganizationPermissionGate permission={PermissionKeys.AI_PROVIDERS_MANAGE}>
          <AddAiProviderModal
            organizationUuid={currentOrganization.uuid}
            provider={connectingProvider}
            isFirstAiProvider={aiProviders.length === 0}
            onClose={() => setConnectingProvider(null)}
          />
        </OrganizationPermissionGate>
      ) : null}

      {connectingProvider && currentOrganization && !isAiCatalogProvider(connectingProvider) ? (
        <OrganizationPermissionGate permission={PermissionKeys.INTEGRATIONS_MANAGE}>
          <AddIntegrationModal
            organizationUuid={currentOrganization.uuid}
            provider={connectingProvider}
            onClose={() => setConnectingProvider(null)}
          />
        </OrganizationPermissionGate>
      ) : null}
    </div>
  );
}

function IntegrationSectionTabs({
  activeSection,
  onSectionChange,
}: {
  activeSection: IntegrationSection;
  onSectionChange: (section: IntegrationSection) => void;
}) {
  const tabs = [
    { id: 'integrationApps', label: 'Integrations' },
    { id: 'databases', label: 'Databases' },
    { id: 'externalConnections', label: 'External connections' },
    { id: 'ai', label: 'AI providers' },
  ] as const;

  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <div className="flex w-max gap-1 rounded-lg border border-border bg-surface p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSectionChange(tab.id)}
            className={cn(
              'shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeSection === tab.id
                ? 'bg-surface-secondary text-foreground'
                : 'text-muted hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
