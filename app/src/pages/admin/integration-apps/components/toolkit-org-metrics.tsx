import type {
  IntegrationAppsToolkitDetail,
  IntegrationAppsTrigger,
} from '@/features/integration-apps/interfaces/integrationApps.interface';
import { MetricCard } from './metric-card';

interface ToolkitOrgMetricsProps {
  detail: IntegrationAppsToolkitDetail;
  triggers: IntegrationAppsTrigger[];
}

export function ToolkitOrgMetrics({ detail, triggers }: ToolkitOrgMetricsProps) {
  const toolkit = detail.toolkit;
  const connections = detail.connections;
  const tools = detail.tools;
  const enabledTools = tools.filter((tool) => tool.enabled).length;
  const activeTriggers = triggers.filter((trigger) => trigger.is_enabled).length;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard label="Status" value={toolkit.is_org_enabled ? 'Enabled' : 'Disabled'} />
      <MetricCard label="Connections" value={String(connections.length)} />
      <MetricCard label="Tools" value={`${enabledTools}/${tools.length}`} />
      <MetricCard label="Triggers" value={`${activeTriggers}/${triggers.length}`} />
    </div>
  );
}
