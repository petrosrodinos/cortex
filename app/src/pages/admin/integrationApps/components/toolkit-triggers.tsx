import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useCreateIntegrationAppsTrigger,
  useDeleteIntegrationAppsTrigger,
  useUpdateIntegrationAppsTrigger,
} from '@/features/integrationApps/hooks/use-integrationApps';
import type {
  IntegrationAppsToolkitDetail,
  IntegrationAppsTrigger,
} from '@/features/integrationApps/interfaces/integrationApps.interface';
import { cn } from '@/lib/utils';

interface ToolkitTriggersProps {
  organizationUuid: string;
  toolkitSlug: string;
  detail: IntegrationAppsToolkitDetail;
  triggers: IntegrationAppsTrigger[];
}

export function ToolkitTriggers({ organizationUuid, toolkitSlug, detail, triggers }: ToolkitTriggersProps) {
  const [triggerSlug, setTriggerSlug] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [triggerConfig, setTriggerConfig] = useState('{}');
  const [triggerConfigError, setTriggerConfigError] = useState<string | null>(null);
  const createTrigger = useCreateIntegrationAppsTrigger(organizationUuid);
  const connections = detail.connections;

  return (
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
              toolkit_slug: toolkitSlug,
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
          <span
            className={cn(
              'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
              trigger.is_enabled ? 'translate-x-4' : 'translate-x-0.5',
            )}
          />
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
