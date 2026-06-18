import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGetIntegrations } from '@/features/integrations/common/hooks/use-integrations';
import type { Integration, IntegrationProvider } from '@/features/integrations/common/interfaces/integration.interface';
import { providerLabels, PROVIDER_ICON_META } from '@/features/integrations/constants/provider-metadata';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes/routes';
import { useOrganizationStore } from '@/stores/organization';
import AiProvidersPage from './ai-providers';
import { IntegrationDetail } from './components/integration-detail';
import { IntegrationsSkeleton } from './components/integrations-skeleton';
import { NoOrgPanel } from './components/no-org-panel';
import { ProviderCatalog } from './components/provider-catalog';
import { AddIntegrationModal } from './components/add-integration-modal';

type IntegrationsTab = 'integrations' | 'ai-providers';

export default function IntegrationsPage() {
  const { integrationUuid } = useParams();
  const navigate = useNavigate();
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const [activeTab, setActiveTab] = useState<IntegrationsTab>('integrations');
  const [connectingProvider, setConnectingProvider] = useState<IntegrationProvider | null>(null);
  const integrationsQuery = useGetIntegrations(currentOrganization?.uuid);
  const integrations = integrationsQuery.data ?? [];
  const selectedIntegration = useMemo(
    () => integrations.find((integration) => integration.uuid === integrationUuid) ?? null,
    [integrationUuid, integrations],
  );

  function handleManage(integration: Integration) {
    navigate(Routes.dashboard.integration(integration.uuid));
  }

  const isDetailView = !!(integrationUuid && selectedIntegration);
  const detailIconMeta = selectedIntegration ? PROVIDER_ICON_META[selectedIntegration.provider] : null;
  const DetailIcon = detailIconMeta?.icon;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      {isDetailView && selectedIntegration ? (
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
            <p className="text-xs text-muted">{providerLabels[selectedIntegration.provider]}</p>
            <h1 className="text-base font-semibold leading-tight text-foreground">{selectedIntegration.name}</h1>
          </div>
        </header>
      ) : (
        <header>
          <h1 className="text-xl font-semibold text-foreground">Integrations</h1>
          <p className="mt-1 text-sm text-muted">Connect systems and choose which actions the agent can use.</p>
        </header>
      )}

      {!isDetailView ? (
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1 w-fit">
          {(['integrations', 'ai-providers'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'bg-surface-secondary text-foreground'
                  : 'text-muted hover:text-foreground',
              )}
            >
              {tab === 'integrations' ? 'Integrations' : 'AI Providers'}
            </button>
          ))}
        </div>
      ) : null}

      {activeTab === 'ai-providers' && !isDetailView ? (
        <AiProvidersPage />
      ) : !currentOrganization ? (
        <NoOrgPanel />
      ) : integrationsQuery.isLoading ? (
        <IntegrationsSkeleton />
      ) : isDetailView && selectedIntegration ? (
        <IntegrationDetail organizationUuid={currentOrganization.uuid} integration={selectedIntegration} />
      ) : (
        <ProviderCatalog
          integrations={integrations}
          onConnect={(provider) => setConnectingProvider(provider)}
          onManage={handleManage}
        />
      )}

      {connectingProvider && currentOrganization ? (
        <AddIntegrationModal
          organizationUuid={currentOrganization.uuid}
          provider={connectingProvider}
          onClose={() => setConnectingProvider(null)}
        />
      ) : null}
    </div>
  );
}
