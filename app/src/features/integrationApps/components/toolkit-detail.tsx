import { useState } from 'react';
import { ArrowLeft, Plug, ShieldCheck, ShieldQuestion, Unplug } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Button } from '@/components/ui/button';
import {
  useConnectIntegrationAppsToolkit,
  useDisableIntegrationAppsToolkit,
  useDisconnectIntegrationAppsAccount,
  useEnableIntegrationAppsToolkit,
  useGetIntegrationAppsToolkit,
  useUpdateIntegrationAppsToolPermission,
} from '@/features/integrationApps/hooks/use-integrationApps';
import type { IntegrationAppsTool } from '@/features/integrationApps/interfaces/integrationApps.interface';
import { cn } from '@/lib/utils';

interface ToolkitDetailProps {
  organizationUuid: string;
  toolkitSlug: string;
  onBack: () => void;
}

export function ToolkitDetail({ organizationUuid, toolkitSlug, onBack }: ToolkitDetailProps) {
  const [disconnectAccountId, setDisconnectAccountId] = useState<string | null>(null);
  const detailQuery = useGetIntegrationAppsToolkit(organizationUuid, toolkitSlug);
  const connectToolkit = useConnectIntegrationAppsToolkit(organizationUuid);
  const enableToolkit = useEnableIntegrationAppsToolkit(organizationUuid);
  const disableToolkit = useDisableIntegrationAppsToolkit(organizationUuid);
  const disconnectAccount = useDisconnectIntegrationAppsAccount(organizationUuid, toolkitSlug);
  const updateToolPermission = useUpdateIntegrationAppsToolPermission(organizationUuid, toolkitSlug);
  const detail = detailQuery.data;
  const toolkit = detail?.toolkit;
  const connections = detail?.connections ?? [];
  const tools = detail?.tools ?? [];
  const isConnected = connections.length > 0;
  const isTogglingOrgEnabled = enableToolkit.isPending || disableToolkit.isPending;
  const pendingDisconnect = connections.find((connection) => connection.account_id === disconnectAccountId);

  if (detailQuery.isLoading || !toolkit) {
    return (
      <div className="space-y-3">
        <div className="h-10 w-44 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="h-48 animate-pulse rounded-lg border border-border bg-surface" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            onClick={onBack}
            className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          {toolkit.logo_url ? (
            <img
              src={toolkit.logo_url}
              alt=""
              className="h-10 w-10 rounded-lg border border-border bg-background object-contain p-1"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
              {toolkit.name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="text-lg font-semibold leading-tight text-foreground">{toolkit.name}</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">{toolkit.description || toolkit.slug}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {isConnected ? (
            <>
              <div className="flex h-9 items-center gap-2 rounded-md border border-border px-3">
                <span className="text-xs text-foreground">{toolkit.is_org_enabled ? 'Enabled' : 'Disabled'}</span>
                <EnabledSwitch
                  checked={toolkit.is_org_enabled}
                  disabled={isTogglingOrgEnabled}
                  onChange={(enabled) => {
                    if (enabled) {
                      enableToolkit.mutate(toolkit.slug);
                      return;
                    }

                    disableToolkit.mutate(toolkit.slug);
                  }}
                />
              </div>
              {connections.length === 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="sm:w-auto"
                  onClick={() => setDisconnectAccountId(connections[0].account_id)}
                >
                  <Unplug className="h-4 w-4" />
                  Remove connection
                </Button>
              ) : null}
            </>
          ) : toolkit.connection_tiers.length === 1 ? (
            <Button
              type="button"
              className="sm:w-auto"
              loading={connectToolkit.isPending}
              onClick={() =>
                connectToolkit.mutate({
                  toolkitSlug: toolkit.slug,
                  connectionTier: toolkit.connection_tiers[0],
                })
              }
            >
              <Plug className="h-4 w-4" />
              Connect
            </Button>
          ) : (
            toolkit.connection_tiers.map((connectionTier) => (
              <Button
                key={connectionTier}
                type="button"
                className="sm:w-auto"
                loading={connectToolkit.isPending}
                onClick={() =>
                  connectToolkit.mutate({
                    toolkitSlug: toolkit.slug,
                    connectionTier,
                  })
                }
              >
                <Plug className="h-4 w-4" />
                {connectionTier === 'USER_PERSONAL' ? 'Connect personal' : 'Connect organization'}
              </Button>
            ))
          )}
        </div>
      </header>

      {isConnected && connections.length > 1 ? (
        <section className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">Connections</h3>
          </div>
          <div className="divide-y divide-border">
            {connections.map((connection) => (
              <div key={connection.account_id} className="flex items-center justify-between gap-3 px-4 py-3">
                <p className="truncate text-sm font-medium text-foreground">
                  {connection.account_label || connection.account_id}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 shrink-0"
                  onClick={() => setDisconnectAccountId(connection.account_id)}
                >
                  <Unplug className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Tools</h3>
        </div>
        <div className="divide-y divide-border">
          {tools.map((tool) => (
            <ToolPermissionRow
              key={tool.uuid}
              tool={tool}
              disabled={!toolkit.is_org_enabled || updateToolPermission.isPending}
              onToggleEnabled={(enabled) =>
                updateToolPermission.mutate({ toolSlug: tool.slug, payload: { enabled } })
              }
              onToggleApproval={(requiresApproval) =>
                updateToolPermission.mutate({
                  toolSlug: tool.slug,
                  payload: { requires_approval: requiresApproval },
                })
              }
            />
          ))}
        </div>
      </section>

      <ConfirmationDialog
        open={!!disconnectAccountId}
        title="Remove connection?"
        description={
          pendingDisconnect
            ? `This will disconnect ${pendingDisconnect.account_label || pendingDisconnect.account_id} from ${toolkit.name}. The agent will no longer be able to use this integration until you connect again.`
            : 'This will remove the connected account. The agent will no longer be able to use this integration until you connect again.'
        }
        confirmLabel="Remove connection"
        loading={disconnectAccount.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setDisconnectAccountId(null);
          }
        }}
        onConfirm={() => {
          if (!disconnectAccountId) {
            return;
          }

          disconnectAccount.mutate(disconnectAccountId, {
            onSuccess: () => {
              setDisconnectAccountId(null);
            },
          });
        }}
      />
    </div>
  );
}

interface ToolPermissionRowProps {
  tool: IntegrationAppsTool;
  disabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onToggleApproval: (requiresApproval: boolean) => void;
}

function ToolPermissionRow({ tool, disabled, onToggleEnabled, onToggleApproval }: ToolPermissionRowProps) {
  return (
    <div className="grid gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{tool.name}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted">{tool.description || tool.slug}</p>
      </div>
      <Switch
        checked={tool.requires_approval}
        disabled={disabled}
        label="Approval"
        icon={tool.requires_approval ? ShieldCheck : ShieldQuestion}
        onChange={onToggleApproval}
      />
      <Switch checked={tool.enabled} disabled={disabled} label="Enabled" onChange={onToggleEnabled} />
    </div>
  );
}

interface SwitchProps {
  checked: boolean;
  disabled?: boolean;
  label: string;
  icon?: typeof ShieldCheck;
  onChange: (checked: boolean) => void;
}

function Switch({ checked, disabled, label, icon: Icon, onChange }: SwitchProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-xs text-foreground sm:w-40">
      <span className="flex min-w-0 items-center gap-1.5">
        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-muted" /> : null}
        <span className="truncate">{label}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors',
          checked ? 'bg-accent' : 'bg-border',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <span
          className={cn(
            'pointer-events-none block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform',
            checked && 'translate-x-4',
          )}
        />
      </button>
    </div>
  );
}

function EnabledSwitch({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
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
