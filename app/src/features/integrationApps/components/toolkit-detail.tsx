import { useState } from 'react';
import { ArrowLeft, Plug, ShieldCheck, ShieldQuestion, Trash2, Unplug } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useConnectIntegrationAppsToolkit,
  useCreateIntegrationAppsTrigger,
  useDeleteIntegrationAppsTrigger,
  useDisableIntegrationAppsToolkit,
  useDisconnectIntegrationAppsAccount,
  useEnableIntegrationAppsToolkit,
  useGetIntegrationAppsTriggers,
  useGetIntegrationAppsToolkit,
  useUpdateIntegrationAppsTrigger,
  useUpdateIntegrationAppsToolPermission,
} from '@/features/integrationApps/hooks/use-integrationApps';
import type { IntegrationAppsTool, IntegrationAppsTrigger } from '@/features/integrationApps/interfaces/integrationApps.interface';
import { RoleTypes } from '@/features/user/interfaces/user.interface';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';

interface ToolkitDetailProps {
  organizationUuid: string;
  toolkitSlug: string;
  onBack: () => void;
}

export function ToolkitDetail({ organizationUuid, toolkitSlug, onBack }: ToolkitDetailProps) {
  const [triggerSlug, setTriggerSlug] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [triggerConfig, setTriggerConfig] = useState('{}');
  const [triggerConfigError, setTriggerConfigError] = useState<string | null>(null);
  const [disconnectAccountId, setDisconnectAccountId] = useState<string | null>(null);
  const role = useAuthStore((state) => state.role);
  const isSuperAdmin = role === RoleTypes.SUPER_ADMIN;
  const detailQuery = useGetIntegrationAppsToolkit(organizationUuid, toolkitSlug);
  const triggersQuery = useGetIntegrationAppsTriggers(organizationUuid);
  const connectToolkit = useConnectIntegrationAppsToolkit(organizationUuid);
  const enableToolkit = useEnableIntegrationAppsToolkit(organizationUuid);
  const disableToolkit = useDisableIntegrationAppsToolkit(organizationUuid);
  const disconnectAccount = useDisconnectIntegrationAppsAccount(organizationUuid, toolkitSlug);
  const updateToolPermission = useUpdateIntegrationAppsToolPermission(organizationUuid, toolkitSlug);
  const createTrigger = useCreateIntegrationAppsTrigger(organizationUuid);
  const detail = detailQuery.data;
  const toolkit = detail?.toolkit;
  const connections = detail?.connections ?? [];
  const tools = detail?.tools ?? [];
  const triggers = (triggersQuery.data?.data ?? []).filter((trigger) => trigger.toolkit.slug === toolkitSlug);
  const enabledTools = tools.filter((tool) => tool.enabled).length;
  const activeTriggers = triggers.filter((trigger) => trigger.is_enabled).length;
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

      {isSuperAdmin ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Status" value={toolkit.is_org_enabled ? 'Enabled' : 'Disabled'} />
          <Metric label="Connections" value={String(connections.length)} />
          <Metric label="Tools" value={`${enabledTools}/${tools.length}`} />
          <Metric label="Triggers" value={`${activeTriggers}/${triggers.length}`} />
        </div>
      ) : null}

      {isConnected && !isSuperAdmin && connections.length > 1 ? (
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

      {isSuperAdmin ? (
      <section className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Connected accounts</h3>
        </div>
        {connections.length === 0 ? (
          <p className="px-4 py-4 text-sm text-muted">No connected accounts yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {connections.map((connection) => (
              <div key={connection.account_id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {connection.account_label || connection.account_id}
                  </p>
                  <p className="text-xs text-muted">{connection.account_id}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    {connection.status}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9"
                    onClick={() => setDisconnectAccountId(connection.account_id)}
                  >
                    <Unplug className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      ) : null}

      {isSuperAdmin ? (
      <section className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Triggers</h3>
        </div>
        <form
          className="grid gap-3 border-b border-border p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_auto] lg:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            setTriggerConfigError(null);

            let parsedConfig: Record<string, unknown> = {};
            try {
              parsedConfig = JSON.parse(triggerConfig || '{}');
              if (!parsedConfig || typeof parsedConfig !== 'object' || Array.isArray(parsedConfig)) {
                throw new Error('Config must be a JSON object');
              }
            } catch (error: any) {
              setTriggerConfigError(error?.message ?? 'Invalid JSON');
              return;
            }

            createTrigger.mutate(
              {
                toolkit_slug: toolkit.slug,
                trigger_slug: triggerSlug.trim(),
                connected_account_id: selectedAccountId,
                config: parsedConfig,
              },
              {
                onSuccess: () => {
                  setTriggerSlug('');
                  setTriggerConfig('{}');
                },
              },
            );
          }}
        >
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-foreground">Trigger slug</span>
            <Input
              value={triggerSlug}
              onChange={(event) => setTriggerSlug(event.target.value)}
              placeholder="GMAIL_NEW_GMAIL_MESSAGE"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-foreground">Connected account</span>
            <select
              value={selectedAccountId}
              onChange={(event) => setSelectedAccountId(event.target.value)}
              className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">Select account</option>
              {connections.map((connection) => (
                <option key={connection.account_id} value={connection.account_id}>
                  {connection.account_label || connection.account_id}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-foreground">Config JSON</span>
            <Input value={triggerConfig} onChange={(event) => setTriggerConfig(event.target.value)} />
            {triggerConfigError ? <span className="text-xs text-red-600 dark:text-red-300">{triggerConfigError}</span> : null}
          </label>
          <Button
            type="submit"
            className="lg:w-auto"
            loading={createTrigger.isPending}
            disabled={!triggerSlug.trim() || !selectedAccountId}
          >
            Create
          </Button>
        </form>
        {triggers.length === 0 ? (
          <p className="px-4 py-4 text-sm text-muted">No triggers configured for this toolkit.</p>
        ) : (
          <div className="divide-y divide-border">
            {triggers.map((trigger) => (
              <TriggerRow key={trigger.uuid} organizationUuid={organizationUuid} trigger={trigger} />
            ))}
          </div>
        )}
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
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

function TriggerRow({
  organizationUuid,
  trigger,
}: {
  organizationUuid: string;
  trigger: IntegrationAppsTrigger;
}) {
  const updateTrigger = useUpdateIntegrationAppsTrigger(organizationUuid);
  const deleteTrigger = useDeleteIntegrationAppsTrigger(organizationUuid);

  return (
    <div className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{trigger.trigger_slug}</p>
        <p className="mt-0.5 truncate text-xs text-muted">{trigger.connected_account_id}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={trigger.is_enabled}
        disabled={updateTrigger.isPending}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-xs text-foreground disabled:cursor-not-allowed disabled:opacity-50 md:w-32"
        onClick={() =>
          updateTrigger.mutate({
            triggerUuid: trigger.uuid,
            payload: { is_enabled: !trigger.is_enabled },
          })
        }
      >
        <span>{trigger.is_enabled ? 'Enabled' : 'Disabled'}</span>
        <span className={cn('relative h-5 w-9 rounded-full', trigger.is_enabled ? 'bg-accent' : 'bg-surface-secondary')}>
          <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform', trigger.is_enabled ? 'translate-x-4' : 'translate-x-0.5')} />
        </span>
      </button>
      <Button
        type="button"
        variant="outline"
        className="h-9 md:w-auto"
        loading={deleteTrigger.isPending}
        onClick={() => deleteTrigger.mutate(trigger.uuid)}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
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
