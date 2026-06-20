import { useMemo, useState } from 'react';
import { Check, Plug, Search, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useConnectIntegrationAppsToolkit,
  useEnableIntegrationAppsToolkit,
  useGetIntegrationAppsToolkits,
} from '@/features/integrationApps/hooks/use-integrationApps';
import type { IntegrationAppsToolkit } from '@/features/integrationApps/interfaces/integrationApps.interface';
import { cn } from '@/lib/utils';

interface ToolkitCatalogProps {
  organizationUuid: string;
  onSelectToolkit: (toolkitSlug: string) => void;
}

export function ToolkitCatalog({ organizationUuid, onSelectToolkit }: ToolkitCatalogProps) {
  const [search, setSearch] = useState('');
  const toolkitsQuery = useGetIntegrationAppsToolkits(organizationUuid, { search, limit: 60 });
  const connectToolkit = useConnectIntegrationAppsToolkit(organizationUuid);
  const enableToolkit = useEnableIntegrationAppsToolkit(organizationUuid);
  const toolkits = toolkitsQuery.data?.data ?? [];

  const connectedCount = useMemo(
    () => toolkits.filter((toolkit) => toolkit.is_connected).length,
    [toolkits],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">Integrations</h2>
          <p className="text-sm text-muted">{connectedCount} connected integrations available to this organization.</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
            placeholder="Search integrations"
          />
        </div>
      </div>

      {toolkitsQuery.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-lg border border-border bg-surface" />
          ))}
        </div>
      ) : toolkits.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
          No integrations found.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {toolkits.map((toolkit) => (
            <ToolkitCard
              key={toolkit.slug}
              toolkit={toolkit}
              isConnecting={connectToolkit.isPending}
              isEnabling={enableToolkit.isPending}
              onConnect={() => connectToolkit.mutate(toolkit.slug)}
              onEnable={() => enableToolkit.mutate(toolkit.slug)}
              onManage={() => onSelectToolkit(toolkit.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ToolkitCardProps {
  toolkit: IntegrationAppsToolkit;
  isConnecting: boolean;
  isEnabling: boolean;
  onConnect: () => void;
  onEnable: () => void;
  onManage: () => void;
}

function ToolkitCard({ toolkit, isConnecting, isEnabling, onConnect, onEnable, onManage }: ToolkitCardProps) {
  return (
    <div className="flex min-h-40 flex-col rounded-lg border border-border bg-surface transition-colors hover:bg-surface-secondary">
      <button type="button" onClick={onManage} className="flex flex-1 flex-col p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <ToolkitLogo toolkit={toolkit} />
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              toolkit.is_connected
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : toolkit.is_org_enabled
                  ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300'
                  : 'bg-surface-secondary text-muted',
            )}
          >
            {toolkit.is_connected ? 'Connected' : toolkit.is_org_enabled ? 'Enabled' : 'Available'}
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground">{toolkit.name}</p>
        <p className="mt-1 line-clamp-2 text-xs text-muted">{toolkit.description || toolkit.slug}</p>
        <p className="mt-3 text-xs text-muted">{toolkit.tool_count} tools</p>
      </button>

      <div className="grid grid-cols-2 gap-2 border-t border-border p-3">
        {toolkit.is_org_enabled ? (
          <Button type="button" variant="outline" className="h-9 px-3" onClick={onManage}>
            <Settings2 className="h-4 w-4" />
            Manage
          </Button>
        ) : (
          <Button type="button" variant="outline" className="h-9 px-3" loading={isEnabling} onClick={onEnable}>
            <Check className="h-4 w-4" />
            Enable
          </Button>
        )}
        <Button type="button" className="h-9 px-3" loading={isConnecting} onClick={onConnect}>
          <Plug className="h-4 w-4" />
          Connect
        </Button>
      </div>
    </div>
  );
}

function ToolkitLogo({ toolkit }: { toolkit: IntegrationAppsToolkit }) {
  if (toolkit.logo_url) {
    return (
      <img
        src={toolkit.logo_url}
        alt=""
        className="h-10 w-10 rounded-lg border border-border bg-background object-contain p-1"
      />
    );
  }

  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
      {toolkit.name.slice(0, 1).toUpperCase()}
    </span>
  );
}
