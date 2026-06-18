import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGetIntegrations } from '@/features/integrations/common/hooks/use-integrations';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import type { CatalogProvider } from '@/features/integrations/constants/catalog-provider';
import {
  CATALOG_PROVIDER_ICON_META,
  catalogProviderLabels,
  PROVIDER_ICON_META,
  providerLabels,
} from '@/features/integrations/constants/provider-metadata';
import { isAiCatalogProvider } from '@/features/integrations/utils/integration.utils';
import { useGetAiProviders } from '@/features/settings/hooks/use-settings';
import type { AiProvider } from '@/features/settings/services/settings.service';
import { Routes } from '@/routes/routes';
import { useOrganizationStore } from '@/stores/organization';
import { AiProviderDetail } from './components/ai-provider-detail';
import { IntegrationDetail } from './components/integration-detail';
import { IntegrationsSkeleton } from './components/integrations-skeleton';
import { NoOrgPanel } from './components/no-org-panel';
import { ProviderCatalog } from './components/provider-catalog';
import { AddIntegrationModal } from './components/add-integration-modal';
import { AddAiProviderModal } from './components/add-ai-provider-modal';

export default function IntegrationsPage() {
  const { integrationUuid, aiProviderUuid } = useParams();
  const navigate = useNavigate();
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const [connectingProvider, setConnectingProvider] = useState<CatalogProvider | null>(null);
  const integrationsQuery = useGetIntegrations(currentOrganization?.uuid);
  const aiProvidersQuery = useGetAiProviders(currentOrganization?.uuid);
  const integrations = integrationsQuery.data ?? [];
  const aiProviders = aiProvidersQuery.data ?? [];

  const selectedIntegration = useMemo(
    () => integrations.find((integration) => integration.uuid === integrationUuid) ?? null,
    [integrationUuid, integrations],
  );

  const selectedAiProvider = useMemo(
    () => aiProviders.find((provider) => provider.uuid === aiProviderUuid) ?? null,
    [aiProviderUuid, aiProviders],
  );

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
      ? selectedAiProvider.default_model
      : '';

  const loading = integrationsQuery.isLoading || aiProvidersQuery.isLoading;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      {isDetailView ? (
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(Routes.dashboard.integrations)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: detailIconMeta?.bg ?? '#6b7280' }}
          >
            {DetailIcon ? <DetailIcon size={16} className="text-white" /> : null}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted">{detailSubtitle}</p>
            <h1 className="text-base font-semibold leading-tight text-foreground">{detailTitle}</h1>
          </div>
        </header>
      ) : (
        <header>
          <h1 className="text-xl font-semibold text-foreground">Integrations</h1>
          <p className="mt-1 text-sm text-muted">Connect systems and choose which actions the agent can use.</p>
        </header>
      )}

      {!currentOrganization ? (
        <NoOrgPanel />
      ) : loading ? (
        <IntegrationsSkeleton />
      ) : isIntegrationDetail && selectedIntegration ? (
        <IntegrationDetail organizationUuid={currentOrganization.uuid} integration={selectedIntegration} />
      ) : isAiProviderDetail && selectedAiProvider ? (
        <AiProviderDetail organizationUuid={currentOrganization.uuid} provider={selectedAiProvider} />
      ) : (
        <ProviderCatalog
          integrations={integrations}
          aiProviders={aiProviders}
          onConnect={(provider) => setConnectingProvider(provider)}
          onManageIntegration={handleManageIntegration}
          onManageAiProvider={handleManageAiProvider}
        />
      )}

      {connectingProvider && currentOrganization && isAiCatalogProvider(connectingProvider) ? (
        <AddAiProviderModal
          organizationUuid={currentOrganization.uuid}
          provider={connectingProvider}
          onClose={() => setConnectingProvider(null)}
        />
      ) : null}

      {connectingProvider && currentOrganization && !isAiCatalogProvider(connectingProvider) ? (
        <AddIntegrationModal
          organizationUuid={currentOrganization.uuid}
          provider={connectingProvider}
          onClose={() => setConnectingProvider(null)}
        />
      ) : null}
    </div>
  );
}
