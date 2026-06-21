import {
  useGetIntegrationAppsToolkit,
  useGetIntegrationAppsTriggers,
} from '@/features/integrationApps/hooks/use-integrationApps';
import { useOrganizationStore } from '@/stores/organization';
import { ToolkitConnectedAccounts } from './toolkit-connected-accounts';
import { ToolkitOrgMetrics } from './toolkit-org-metrics';
import { ToolkitTriggers } from './toolkit-triggers';

interface ToolkitOrgSectionsProps {
  toolkitSlug: string;
  toolkitName: string;
}

export function ToolkitOrgSections({ toolkitSlug, toolkitName }: ToolkitOrgSectionsProps) {
  const organizationUuid = useOrganizationStore((state) => state.current_organization?.uuid);
  const detailQuery = useGetIntegrationAppsToolkit(organizationUuid, toolkitSlug);
  const triggersQuery = useGetIntegrationAppsTriggers(organizationUuid);
  const detail = detailQuery.data;
  const triggers = (triggersQuery.data?.data ?? []).filter((trigger) => trigger.toolkit.slug === toolkitSlug);

  if (!organizationUuid) {
    return (
      <section className="rounded-lg border border-border bg-surface px-4 py-4">
        <p className="text-sm text-muted">Select an organization to inspect org-level connections and triggers.</p>
      </section>
    );
  }

  if (detailQuery.isLoading || triggersQuery.isLoading || !detail) {
    return (
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-lg border border-border bg-surface" />
          ))}
        </div>
        <div className="h-40 animate-pulse rounded-lg border border-border bg-surface" />
        <div className="h-56 animate-pulse rounded-lg border border-border bg-surface" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ToolkitOrgMetrics detail={detail} triggers={triggers} />
      <ToolkitConnectedAccounts
        organizationUuid={organizationUuid}
        toolkitSlug={toolkitSlug}
        toolkitName={toolkitName}
        detail={detail}
      />
      <ToolkitTriggers
        organizationUuid={organizationUuid}
        toolkitSlug={toolkitSlug}
        detail={detail}
        triggers={triggers}
      />
    </div>
  );
}
