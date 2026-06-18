import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGetIntegrations } from '@/features/integrations/hooks/use-integrations';
import type { Integration, IntegrationProvider } from '@/features/integrations/interfaces/integration.interface';
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

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-foreground">Integrations</h1>
        <p className="mt-1 text-sm text-muted">Connect systems and choose which actions the agent can use.</p>
      </header>

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

      {activeTab === 'ai-providers' ? (
        <AiProvidersPage />
      ) : !currentOrganization ? (
        <NoOrgPanel />
      ) : integrationsQuery.isLoading ? (
        <IntegrationsSkeleton />
      ) : integrationUuid && selectedIntegration ? (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => navigate(Routes.dashboard.integrations)}
            className="inline-flex w-fit items-center gap-2 text-sm text-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All integrations
          </button>
          <IntegrationDetail organizationUuid={currentOrganization.uuid} integration={selectedIntegration} />
        </div>
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
