import { useState } from 'react';
import { Plug, Search, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useConnectIntegrationAppsToolkit,
  useDisableIntegrationAppsToolkit,
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
  const connectedToolkitsQuery = useGetIntegrationAppsToolkits(organizationUuid, {
    connected: true,
    limit: 1,
  });
  const connectToolkit = useConnectIntegrationAppsToolkit(organizationUuid);
  const enableToolkit = useEnableIntegrationAppsToolkit(organizationUuid);
  const disableToolkit = useDisableIntegrationAppsToolkit(organizationUuid);
  const toolkits = toolkitsQuery.data?.data ?? [];
  const connectedCount = connectedToolkitsQuery.data?.pagination.total ?? 0;

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
              isToggling={enableToolkit.isPending || disableToolkit.isPending}
              onConnect={() => {
                if (toolkit.connection_tiers.length === 1) {
                  connectToolkit.mutate({
                    toolkitSlug: toolkit.slug,
                    connectionTier: toolkit.connection_tiers[0],
                  });
                  return;
                }

                onSelectToolkit(toolkit.slug);
              }}
              onToggleEnabled={(enabled) => {
                if (enabled) {
                  enableToolkit.mutate(toolkit.slug);
                  return;
                }

                disableToolkit.mutate(toolkit.slug);
              }}
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
  isToggling: boolean;
  onConnect: () => void;
  onToggleEnabled: (enabled: boolean) => void;
  onManage: () => void;
}

function ToolkitCard({
  toolkit,
  isConnecting,
  isToggling,
  onConnect,
  onToggleEnabled,
  onManage,
}: ToolkitCardProps) {
  const description = toolkit.description || toolkit.slug;

  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface transition-colors hover:bg-surface-secondary">
      <div className="flex flex-1 flex-col p-4">
        <button type="button" onClick={onManage} className="text-left">
          <div className="flex items-start justify-between gap-3">
            <ToolkitLogo toolkit={toolkit} />
            {toolkit.is_connected ? (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                Connected
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">{toolkit.name}</p>
        </button>
        <ToolkitDescription text={description} />
        <button type="button" onClick={onManage} className="mt-3 text-left text-xs text-muted hover:text-foreground">
          {toolkit.tool_count} tools
        </button>
      </div>

      <div className="border-t border-border p-3">
        {toolkit.is_connected ? (
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" className="h-9 px-3" onClick={onManage}>
              <Settings2 className="h-4 w-4" />
              Manage
            </Button>
            <div className="flex h-9 items-center justify-between gap-2 rounded-md border border-border px-3">
              <span className="text-xs text-foreground">{toolkit.is_org_enabled ? 'Enabled' : 'Disabled'}</span>
              <EnabledSwitch
                checked={toolkit.is_org_enabled}
                disabled={isToggling}
                onChange={onToggleEnabled}
              />
            </div>
          </div>
        ) : (
          <Button type="button" className="h-9 w-full px-3" loading={isConnecting} onClick={onConnect}>
            <Plug className="h-4 w-4" />
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}

const DESCRIPTION_PREVIEW_LENGTH = 120;

function ToolkitDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > DESCRIPTION_PREVIEW_LENGTH;

  return (
    <div className="mt-1">
      <p className={cn('text-xs leading-relaxed text-muted', !expanded && isLong && 'line-clamp-2')}>
        {text}
      </p>
      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-1 text-xs font-medium text-accent hover:underline"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      ) : null}
    </div>
  );
}

interface EnabledSwitchProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

function EnabledSwitch({ checked, disabled, onChange, className }: EnabledSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? 'Disable integration' : 'Enable integration'}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors',
        checked ? 'bg-accent' : 'bg-border',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <span
        className={cn(
          'pointer-events-none block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform',
          checked && 'translate-x-4',
        )}
      />
    </button>
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
