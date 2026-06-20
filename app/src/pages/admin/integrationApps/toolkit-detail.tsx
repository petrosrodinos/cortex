import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
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
import { Routes } from '@/routes/routes';
import { AdminToolkitDetailSkeleton } from './components/toolkit-detail-skeleton';
import { ToggleSwitch } from './components/toggle-switch';

export default function AdminIntegrationAppsToolkitDetailPage() {
  const { toolkitSlug } = useParams<{ toolkitSlug: string }>();
  const toolkitQuery = useAdminIntegrationAppsToolkit(toolkitSlug);
  const statsQuery = useAdminIntegrationAppsToolkitStats(toolkitSlug);
  const updateToolkit = useUpdateAdminIntegrationAppsToolkit(toolkitSlug);
  const refreshToolkit = useRefreshAdminIntegrationAppsToolkit(toolkitSlug);
  const syncTools = useSyncAdminIntegrationAppsToolkitTools(toolkitSlug);
  const toolkit = toolkitQuery.data;

  if (toolkitQuery.isLoading || !toolkit) {
    return <AdminToolkitDetailSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Link
            to={Routes.admin.integrationAppsToolkits}
            className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
            aria-label="Back to toolkits"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
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
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
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
          <ToggleSwitch
            checked={toolkit.is_enabled}
            disabled={updateToolkit.isPending}
            ariaLabel={`${toolkit.is_enabled ? 'Disable' : 'Enable'} ${toolkit.name} toolkit`}
            onChange={(is_enabled) => updateToolkit.mutate({ is_enabled })}
          />
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
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{tool.name}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted">{tool.description || tool.slug}</p>
      </div>
      <ToggleSwitch
        checked={tool.is_enabled}
        disabled={updateTool.isPending}
        ariaLabel={`${tool.is_enabled ? 'Disable' : 'Enable'} ${tool.name}`}
        onChange={(isEnabled) => updateTool.mutate({ toolSlug: tool.slug, isEnabled })}
      />
    </div>
  );
}
