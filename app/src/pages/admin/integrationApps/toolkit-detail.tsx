import { useParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useAdminIntegrationAppsToolkit,
  useAdminIntegrationAppsToolkitStats,
  useRefreshAdminIntegrationAppsToolkit,
  useSyncAdminIntegrationAppsToolkitTools,
  useUpdateAdminIntegrationAppsTool,
  useUpdateAdminIntegrationAppsToolkit,
} from '@/features/integrationApps-admin/hooks/use-integrationApps-admin';
import type { AdminIntegrationAppsTool } from '@/features/integrationApps-admin/interfaces/integrationApps-admin.interface';
import type { IntegrationAppsConnectionTier } from '@/features/integrationApps/interfaces/integrationApps.interface';
import { cn } from '@/lib/utils';

export default function AdminIntegrationAppsToolkitDetailPage() {
  const { toolkitSlug } = useParams<{ toolkitSlug: string }>();
  const toolkitQuery = useAdminIntegrationAppsToolkit(toolkitSlug);
  const statsQuery = useAdminIntegrationAppsToolkitStats(toolkitSlug);
  const updateToolkit = useUpdateAdminIntegrationAppsToolkit(toolkitSlug);
  const refreshToolkit = useRefreshAdminIntegrationAppsToolkit(toolkitSlug);
  const syncTools = useSyncAdminIntegrationAppsToolkitTools(toolkitSlug);
  const toolkit = toolkitQuery.data;

  if (toolkitQuery.isLoading || !toolkit) {
    return <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted">Loading toolkit...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {toolkit.logo_url ? (
            <img src={toolkit.logo_url} alt="" className="h-10 w-10 rounded-lg border border-border bg-background object-contain p-1" />
          ) : null}
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground">{toolkit.name}</h2>
            <p className="mt-1 text-sm text-muted">{toolkit.description || toolkit.slug}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" className="sm:w-auto" loading={refreshToolkit.isPending} onClick={() => refreshToolkit.mutate()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button type="button" className="sm:w-auto" loading={syncTools.isPending} onClick={() => syncTools.mutate()}>
            Sync tools
          </Button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <Metric label="Platform status" value={toolkit.is_enabled ? 'Enabled' : 'Disabled'} />
        <Metric label="Tools" value={String(toolkit.tools.length)} />
        <Metric label="Connected accounts" value={String(statsQuery.data?.connected_accounts_count ?? 0)} />
        <Metric label="Active triggers" value={String(statsQuery.data?.active_triggers_count ?? 0)} />
      </div>

      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-foreground">Connection tier</span>
            <select
              value={toolkit.connection_tier}
              onChange={(event) =>
                updateToolkit.mutate({ connection_tier: event.target.value as IntegrationAppsConnectionTier })
              }
              className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="USER_PERSONAL">User personal</option>
              <option value="ORG_SHARED">Organization shared</option>
            </select>
          </label>
          <Button
            type="button"
            variant="outline"
            className="md:w-auto"
            loading={updateToolkit.isPending}
            onClick={() => updateToolkit.mutate({ is_enabled: !toolkit.is_enabled })}
          >
            {toolkit.is_enabled ? 'Disable toolkit' : 'Enable toolkit'}
          </Button>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Tools</h3>
        </div>
        <div className="divide-y divide-border">
          {toolkit.tools.map((tool) => (
            <AdminToolRow key={tool.uuid} toolkitSlug={toolkit.slug} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function AdminToolRow({ toolkitSlug, tool }: { toolkitSlug: string; tool: AdminIntegrationAppsTool }) {
  const updateTool = useUpdateAdminIntegrationAppsTool(toolkitSlug);

  return (
    <div className="grid gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{tool.name}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted">{tool.description || tool.slug}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={tool.is_enabled}
        disabled={updateTool.isPending}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-xs text-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:w-32"
        onClick={() => updateTool.mutate({ toolSlug: tool.slug, isEnabled: !tool.is_enabled })}
      >
        <span>{tool.is_enabled ? 'Enabled' : 'Disabled'}</span>
        <span className={cn('relative h-5 w-9 rounded-full', tool.is_enabled ? 'bg-accent' : 'bg-surface-secondary')}>
          <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform', tool.is_enabled ? 'translate-x-4' : 'translate-x-0.5')} />
        </span>
      </button>
    </div>
  );
}
