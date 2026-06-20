import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useAdminIntegrationAppsToolkits,
  useCreateAdminIntegrationAppsToolkit,
  useUpdateAdminIntegrationAppsToolkit,
} from '@/features/integrationApps-admin/hooks/use-integrationApps-admin';
import type { AdminIntegrationAppsToolkit } from '@/features/integrationApps-admin/interfaces/integrationApps-admin.interface';
import { Routes } from '@/routes/routes';
import { ToggleSwitch } from './components/toggle-switch';

export default function AdminIntegrationAppsToolkitsPage() {
  const [search, setSearch] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const toolkitsQuery = useAdminIntegrationAppsToolkits({ search, limit: 100 });
  const createToolkit = useCreateAdminIntegrationAppsToolkit();
  const toolkits = toolkitsQuery.data?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search toolkits" />
        </div>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const slug = newSlug.trim();
            if (!slug) return;
            createToolkit.mutate(slug, { onSuccess: () => setNewSlug('') });
          }}
        >
          <Input value={newSlug} onChange={(event) => setNewSlug(event.target.value)} placeholder="Sync slug" />
          <Button type="submit" className="w-auto shrink-0" loading={createToolkit.isPending}>
            <Plus className="h-4 w-4" />
            Sync
          </Button>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {toolkitsQuery.isLoading ? (
          <div className="p-4 text-sm text-muted">Loading toolkits...</div>
        ) : toolkits.length === 0 ? (
          <div className="p-4 text-sm text-muted">No toolkits found.</div>
        ) : (
          <div className="divide-y divide-border">
            {toolkits.map((toolkit) => (
              <ToolkitRow key={toolkit.slug} toolkit={toolkit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolkitRow({ toolkit }: { toolkit: AdminIntegrationAppsToolkit }) {
  const updateToolkit = useUpdateAdminIntegrationAppsToolkit(toolkit.slug);

  return (
    <div className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
      <div className="flex min-w-0 items-center gap-3">
        {toolkit.logo_url ? (
          <img src={toolkit.logo_url} alt="" className="h-9 w-9 rounded-lg border border-border bg-background object-contain p-1" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-xs font-semibold text-accent-foreground">
            {toolkit.name.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{toolkit.name}</p>
          <p className="truncate text-xs text-muted">{toolkit.slug}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>{toolkit._count?.tools ?? toolkit.tool_count} tools</span>
        <span>{toolkit._count?.enabled_orgs ?? 0} orgs</span>
      </div>
      <div className="flex items-center gap-3 md:justify-end">
        <ToggleSwitch
          checked={toolkit.is_enabled}
          disabled={updateToolkit.isPending}
          ariaLabel={`${toolkit.is_enabled ? 'Disable' : 'Enable'} ${toolkit.name}`}
          onChange={(is_enabled) => updateToolkit.mutate({ is_enabled })}
        />
        <Link
          to={Routes.admin.integrationAppsToolkit(toolkit.slug)}
          className="inline-flex h-9 items-center rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          Detail
        </Link>
      </div>
    </div>
  );
}
