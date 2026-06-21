import { Link } from 'react-router-dom';
import { RefreshCw, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useAdminIntegrationAppsOverviewStats,
  useStartAdminIntegrationAppsSync,
} from '@/features/integrationApps-admin/hooks/use-integrationApps-admin';
import { Routes } from '@/routes/routes';

export default function AdminIntegrationAppsDashboardPage() {
  const overviewQuery = useAdminIntegrationAppsOverviewStats();
  const startSync = useStartAdminIntegrationAppsSync();
  const overview = overviewQuery.data;

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric
          label="Synced toolkits"
          value={overviewQuery.isLoading ? '—' : String(overview?.synced_toolkits ?? 0)}
        />
        <Metric
          label="Enabled"
          value={overviewQuery.isLoading ? '—' : String(overview?.enabled_toolkits ?? 0)}
        />
        <Metric
          label="Latest sync"
          value={overviewQuery.isLoading ? '—' : overview?.latest_sync?.status ?? 'None'}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Toolkit catalog</h2>
              <p className="mt-1 text-xs text-muted">Enable platform-approved apps and inspect synced tools.</p>
            </div>
            <Wrench className="h-4 w-4 text-muted" />
          </div>
          <Link
            to={Routes.admin.integrationAppsToolkits}
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Open toolkits
          </Link>
        </section>

        <section className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Sync integrations</h2>
              <p className="mt-1 text-xs text-muted">Refresh integration metadata from the configured provider.</p>
            </div>
            <RefreshCw className="h-4 w-4 text-muted" />
          </div>
          <Button
            type="button"
            className="mt-4"
            loading={startSync.isPending}
            onClick={() => startSync.mutate({ syncType: 'FULL' })}
          >
            Run full sync
          </Button>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
