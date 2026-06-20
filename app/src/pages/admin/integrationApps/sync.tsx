import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useAdminIntegrationAppsSyncRuns,
  useStartAdminIntegrationAppsSync,
} from '@/features/integrationApps-admin/hooks/use-integrationApps-admin';
import type { AdminIntegrationAppsSyncRun, IntegrationAppsSyncType } from '@/features/integrationApps-admin/interfaces/integrationApps-admin.interface';

export default function AdminIntegrationAppsSyncPage() {
  const [syncType, setSyncType] = useState<IntegrationAppsSyncType>('FULL');
  const [toolkitSlug, setToolkitSlug] = useState('');
  const syncRunsQuery = useAdminIntegrationAppsSyncRuns();
  const startSync = useStartAdminIntegrationAppsSync();
  const needsToolkit = syncType !== 'FULL';

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border border-border bg-surface p-4">
        <form
          className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            startSync.mutate({
              syncType,
              toolkitSlug: needsToolkit ? toolkitSlug.trim() : undefined,
            });
          }}
        >
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-foreground">Sync type</span>
            <select
              value={syncType}
              onChange={(event) => setSyncType(event.target.value as IntegrationAppsSyncType)}
              className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="FULL">Full</option>
              <option value="TOOLKIT">Toolkit metadata</option>
              <option value="TOOLS">Toolkit tools</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-foreground">Toolkit slug</span>
            <Input
              value={toolkitSlug}
              onChange={(event) => setToolkitSlug(event.target.value)}
              disabled={!needsToolkit}
              placeholder={needsToolkit ? 'github' : 'Not required for full sync'}
            />
          </label>
          <Button type="submit" className="md:w-auto" loading={startSync.isPending} disabled={needsToolkit && !toolkitSlug.trim()}>
            Start sync
          </Button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Recent sync runs</h2>
        </div>
        {syncRunsQuery.isLoading ? (
          <div className="p-4 text-sm text-muted">Loading sync history...</div>
        ) : (syncRunsQuery.data?.data ?? []).length === 0 ? (
          <div className="p-4 text-sm text-muted">No sync runs found.</div>
        ) : (
          <div className="divide-y divide-border">
            {(syncRunsQuery.data?.data ?? []).map((run) => (
              <SyncRunRow key={run.uuid} run={run} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SyncRunRow({ run }: { run: AdminIntegrationAppsSyncRun }) {
  return (
    <div className="grid gap-2 px-4 py-3 md:grid-cols-[120px_120px_1fr_auto] md:items-center">
      <span className="text-sm font-medium text-foreground">{run.sync_type}</span>
      <span className={run.status === 'FAILED' ? 'text-sm text-red-600 dark:text-red-300' : 'text-sm text-muted'}>
        {run.status}
      </span>
      <span className="text-xs text-muted">
        {run.toolkits_upserted} toolkits, {run.tools_upserted} tools
        {run.error ? ` - ${run.error}` : ''}
      </span>
      <span className="text-xs text-muted">{new Date(run.started_at).toLocaleString()}</span>
    </div>
  );
}
