import { useState } from 'react';
import { Plug, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { OrganizationPermissionGate } from '@/components/permissions/organization-permission-gate';
import { PermissionKeys } from '@/features/permissions/interfaces/permission.interfaces';
import {
  useConnectIntegrationAppsToolkit,
  useDisableIntegrationAppsToolkit,
  useEnableIntegrationAppsToolkit,
  useGetIntegrationAppsToolkits,
  useGetIntegrationAppsToolkitsCount,
} from '@/features/integration-apps/hooks/use-integrationApps';
import type { IntegrationAppsToolkit } from '@/features/integration-apps/interfaces/integrationApps.interface';
import { cn } from '@/lib/utils';
import { ConnectToolkitDialog } from './connect-toolkit-dialog';
import {
  IntegrationCatalogCard,
  IntegrationCatalogCardAction,
  IntegrationCatalogCardSkeleton,
  IntegrationCatalogConnectedBadge,
  integrationCatalogGridClassName,
} from '../shared/integration-catalog-card';

interface ToolkitCatalogProps {
  organizationUuid: string;
  onSelectToolkit: (toolkitSlug: string) => void;
}

export function ToolkitCatalog({ organizationUuid, onSelectToolkit }: ToolkitCatalogProps) {
  const [search, setSearch] = useState('');
  const [connectingToolkit, setConnectingToolkit] = useState<IntegrationAppsToolkit | null>(null);
  const toolkitsQuery = useGetIntegrationAppsToolkits(organizationUuid, { search, limit: 60 });
  const connectedToolkitsQuery = useGetIntegrationAppsToolkitsCount(organizationUuid, {
    connected: true,
  });
  const connectToolkit = useConnectIntegrationAppsToolkit(organizationUuid);
  const enableToolkit = useEnableIntegrationAppsToolkit(organizationUuid);
  const disableToolkit = useDisableIntegrationAppsToolkit(organizationUuid);
  const toolkits = toolkitsQuery.data?.data ?? [];
  const connectedCount = connectedToolkitsQuery.data?.count ?? 0;

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
        <IntegrationCatalogCardSkeleton count={6} />
      ) : toolkits.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
          No integrations found.
        </div>
      ) : (
        <div className={integrationCatalogGridClassName}>
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

                setConnectingToolkit(toolkit);
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

      <ConnectToolkitDialog
        open={!!connectingToolkit}
        toolkitName={connectingToolkit?.name ?? ''}
        connectionTiers={connectingToolkit?.connection_tiers ?? []}
        loading={connectToolkit.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setConnectingToolkit(null);
          }
        }}
        onConnect={(connectionTier) => {
          if (!connectingToolkit) {
            return;
          }

          connectToolkit.mutate(
            {
              toolkitSlug: connectingToolkit.slug,
              connectionTier,
            },
            {
              onSuccess: () => {
                setConnectingToolkit(null);
              },
            },
          );
        }}
      />
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
    <IntegrationCatalogCard
      icon={<ToolkitLogo toolkit={toolkit} />}
      title={toolkit.name}
      description={<ToolkitDescription text={description} />}
      meta={
        <button type="button" onClick={onManage} className="text-left text-xs text-muted hover:text-foreground">
          {toolkit.tool_count} tools
        </button>
      }
      badge={toolkit.is_connected ? <IntegrationCatalogConnectedBadge /> : undefined}
      onHeaderClick={onManage}
      footer={
        toolkit.is_connected ? (
          <div className="grid grid-cols-2 gap-2">
            <IntegrationCatalogCardAction variant="secondary" onClick={onManage}>
              Manage
            </IntegrationCatalogCardAction>
            <OrganizationPermissionGate permission={PermissionKeys.INTEGRATIONS_MANAGE}>
              {(allowed) =>
                allowed ? (
                  <div className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-1.5">
                    <span className="text-xs text-foreground">{toolkit.is_org_enabled ? 'Enabled' : 'Disabled'}</span>
                    <EnabledSwitch
                      checked={toolkit.is_org_enabled}
                      disabled={isToggling}
                      onChange={onToggleEnabled}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs text-muted">
                    {toolkit.is_org_enabled ? 'Enabled' : 'Disabled'}
                  </div>
                )
              }
            </OrganizationPermissionGate>
          </div>
        ) : (
          <OrganizationPermissionGate permission={PermissionKeys.INTEGRATIONS_MANAGE}>
            <IntegrationCatalogCardAction onClick={onConnect} disabled={isConnecting}>
              <span className="inline-flex items-center justify-center gap-1.5">
                <Plug className="h-3.5 w-3.5" />
                {isConnecting ? 'Connecting...' : 'Connect'}
              </span>
            </IntegrationCatalogCardAction>
          </OrganizationPermissionGate>
        )
      }
    />
  );
}

const DESCRIPTION_PREVIEW_LENGTH = 120;

function ToolkitDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > DESCRIPTION_PREVIEW_LENGTH;

  return (
    <div>
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
        className="h-11 w-11 rounded-xl border border-border bg-background object-contain p-1"
      />
    );
  }

  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground">
      {toolkit.name.slice(0, 1).toUpperCase()}
    </span>
  );
}
