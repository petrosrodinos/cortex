import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, FlaskConical, PlugZap, Plus, Power, PowerOff, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PROVIDER_CONFIG_FIELDS } from '@/features/integrations/constants/provider-config-fields';
import {
  useCreateIntegration,
  useGetIntegrationActions,
  useGetIntegrations,
  useTestIntegration,
  useToggleIntegrationAction,
  useUpdateIntegration,
} from '@/features/integrations/hooks/use-integrations';
import {
  IntegrationProviders,
  IntegrationStatuses,
  type Integration,
  type IntegrationProvider,
} from '@/features/integrations/interfaces/integration.interface';
import {
  createIntegrationSchema,
  type CreateIntegrationFormData,
} from '@/features/integrations/validation-schemas/integration.schema';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes/routes';
import { useOrganizationStore } from '@/stores/organization';

const providerLabels: Record<IntegrationProvider, string> = {
  GITHUB: 'GitHub',
  SLACK: 'Slack',
  STRIPE: 'Stripe',
  HUBSPOT: 'HubSpot',
  LINEAR: 'Linear',
  NOTION: 'Notion',
  GOOGLE_DRIVE: 'Google Drive',
  SMTP: 'SMTP',
  GMAIL: 'Gmail',
  POSTHOG: 'PostHog',
  INTERCOM: 'Intercom',
  DATABASE_PG: 'PostgreSQL',
  DATABASE_MYSQL: 'MySQL',
  DATABASE_MONGO: 'MongoDB',
  OPENAPI: 'OpenAPI',
};

export default function IntegrationsPage() {
  const { integrationUuid } = useParams();
  const navigate = useNavigate();
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const integrationsQuery = useGetIntegrations(currentOrganization?.uuid);
  const integrations = integrationsQuery.data ?? [];
  const selectedIntegration = useMemo(
    () => integrations.find((integration) => integration.uuid === integrationUuid) ?? integrations[0] ?? null,
    [integrationUuid, integrations],
  );

  function selectIntegration(integration: Integration) {
    navigate(Routes.dashboard.integration(integration.uuid));
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Integrations</h1>
          <p className="text-sm text-muted">Connect systems and choose which actions the agent can use.</p>
        </div>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          disabled={!currentOrganization}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add integration
        </button>
      </header>

      {!currentOrganization ? (
        <EmptyPanel title="No organisation selected" body="Select an organisation before managing integrations." />
      ) : integrationsQuery.isLoading ? (
        <IntegrationsSkeleton />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
          <section className="flex flex-col gap-3">
            {integrations.length === 0 ? (
              <EmptyPanel title="No integrations yet" body="Add a provider connection to start exposing actions to the agent." />
            ) : (
              integrations.map((integration) => (
                <button
                  key={integration.uuid}
                  type="button"
                  onClick={() => selectIntegration(integration)}
                  className={cn(
                    'rounded-lg border p-4 text-left transition-colors',
                    selectedIntegration?.uuid === integration.uuid
                      ? 'border-accent/50 bg-surface-secondary'
                      : 'border-border bg-surface hover:bg-surface-secondary',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold text-foreground">{integration.name}</h2>
                      <p className="mt-1 text-xs text-muted">{providerLabels[integration.provider]}</p>
                    </div>
                    <StatusBadge status={integration.status} />
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-muted">
                    {integration.description || `${integration.actions?.length ?? 0} configured actions`}
                  </p>
                </button>
              ))
            )}
          </section>

          {selectedIntegration ? (
            <IntegrationDetail organizationUuid={currentOrganization.uuid} integration={selectedIntegration} />
          ) : (
            <EmptyPanel title="Select an integration" body="Action controls appear after a connection is selected." />
          )}
        </div>
      )}

      {addModalOpen && currentOrganization ? (
        <AddIntegrationModal organizationUuid={currentOrganization.uuid} onClose={() => setAddModalOpen(false)} />
      ) : null}
    </div>
  );
}

function IntegrationDetail({ organizationUuid, integration }: { organizationUuid: string; integration: Integration }) {
  const testIntegrationMutation = useTestIntegration(organizationUuid);
  const updateIntegrationMutation = useUpdateIntegration(organizationUuid);
  const actionsQuery = useGetIntegrationActions(organizationUuid, integration.uuid);
  const toggleActionMutation = useToggleIntegrationAction(organizationUuid, integration.uuid);
  const actions = actionsQuery.data ?? integration.actions ?? [];
  const loading =
    actionsQuery.isLoading ||
    testIntegrationMutation.isPending ||
    updateIntegrationMutation.isPending ||
    toggleActionMutation.isPending;

  async function toggleStatus() {
    await updateIntegrationMutation.mutateAsync({
      integration_uuid: integration.uuid,
      payload: {
        status:
          integration.status === IntegrationStatuses.ACTIVE
            ? IntegrationStatuses.INACTIVE
            : IntegrationStatuses.ACTIVE,
      },
    });
  }

  async function testConnection() {
    await testIntegrationMutation.mutateAsync({ integration_uuid: integration.uuid });
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold text-foreground">{integration.name}</h2>
            <StatusBadge status={integration.status} />
          </div>
          <p className="mt-1 text-sm text-muted">{providerLabels[integration.provider]}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={testConnection}
            title="Test connection"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
          >
            <FlaskConical className="h-4 w-4" />
            Test
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={toggleStatus}
            title={integration.status === IntegrationStatuses.ACTIVE ? 'Disable integration' : 'Enable integration'}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
          >
            {integration.status === IntegrationStatuses.ACTIVE ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
            {integration.status === IntegrationStatuses.ACTIVE ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      {testIntegrationMutation.data ? (
        <p className="mt-3 flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          Connection succeeded
        </p>
      ) : null}

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-foreground">Actions</h3>
        <div className="mt-3 overflow-hidden rounded-lg border border-border">
          {actions.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted">No actions have been seeded for this provider.</p>
          ) : (
            actions.map((action) => (
              <div
                key={action.uuid}
                className="grid gap-3 border-b border-border px-4 py-3 last:border-0 md:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{action.label}</p>
                  <p className="mt-1 text-xs text-muted">{action.description}</p>
                  {action.required_permission_key ? (
                    <p className="mt-1 text-xs text-muted">{action.required_permission_key}</p>
                  ) : null}
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={action.enabled}
                    disabled={loading}
                    onChange={(event) =>
                      toggleActionMutation.mutate({
                        action_uuid: action.uuid,
                        payload: { enabled: event.target.checked },
                      })
                    }
                    className="h-4 w-4 accent-[var(--accent)]"
                  />
                  Enabled
                </label>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function AddIntegrationModal({ organizationUuid, onClose }: { organizationUuid: string; onClose: () => void }) {
  const createIntegrationMutation = useCreateIntegration(organizationUuid);
  const form = useForm<CreateIntegrationFormData>({
    resolver: zodResolver(createIntegrationSchema),
    defaultValues: {
      name: '',
      description: '',
      provider: IntegrationProviders.GITHUB,
      config: {},
    },
  });
  const selectedProvider = form.watch('provider') as IntegrationProvider;
  const configFields = PROVIDER_CONFIG_FIELDS[selectedProvider] ?? [];

  async function submit(values: CreateIntegrationFormData) {
    const config = buildConfig(values.config ?? {}, configFields);

    await createIntegrationMutation.mutateAsync({
      name: values.name,
      description: values.description,
      provider: values.provider as IntegrationProvider,
      config,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
      <section className="w-full max-w-xl rounded-lg border border-border bg-surface p-4 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Add integration</h2>
            <p className="text-sm text-muted">Create an encrypted provider connection.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Production OpenAPI" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Customer operations API" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="provider"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
                    >
                      {Object.values(IntegrationProviders).map((provider) => (
                        <option key={provider} value={provider}>
                          {providerLabels[provider]}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              {configFields.map((configField) => (
                <FormField
                  key={`${selectedProvider}-${configField.key}`}
                  control={form.control}
                  name={`config.${configField.key}` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{configField.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={(field.value as string | number | undefined) ?? ''}
                          type={configField.type}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={onClose} className="sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" loading={createIntegrationMutation.isPending} className="sm:w-auto">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}

function buildConfig(values: Record<string, unknown>, fields: { key: string; type: 'text' | 'password' | 'number' }[]) {
  return fields.reduce<Record<string, unknown>>((config, field) => {
    const value = values[field.key];

    if (value === undefined || value === '') {
      return config;
    }

    config[field.key] = field.type === 'number' ? Number(value) : value;
    return config;
  }, {});
}

function StatusBadge({ status }: { status: string }) {
  const active = status === IntegrationStatuses.ACTIVE;
  return (
    <span
      className={cn(
        'shrink-0 rounded-md px-2 py-1 text-xs font-medium',
        active
          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
          : 'bg-surface-tertiary text-muted',
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}

function EmptyPanel({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-6">
      <PlugZap className="h-5 w-5 text-accent" />
      <h2 className="mt-3 text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted">{body}</p>
      <Link
        to={Routes.dashboard.organizations}
        className="mt-4 inline-flex h-9 items-center rounded-md border border-border px-3 text-sm text-muted hover:bg-surface-secondary hover:text-foreground"
      >
        Organisations
      </Link>
    </section>
  );
}

function IntegrationsSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]" aria-hidden="true">
      <div className="grid gap-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-lg border border-border bg-surface p-4">
            <SkeletonLine className="h-4 w-32" />
            <SkeletonLine className="mt-2 h-3 w-24" />
            <SkeletonLine className="mt-4 h-3 w-full" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-surface p-4">
        <SkeletonLine className="h-5 w-48" />
        <SkeletonLine className="mt-2 h-4 w-32" />
        <div className="mt-6 grid gap-3">
          {[0, 1, 2].map((item) => (
            <SkeletonLine key={item} className="h-14 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonLine({ className }: { className: string }) {
  return <div className={cn('animate-pulse rounded bg-surface-secondary', className)} />;
}
