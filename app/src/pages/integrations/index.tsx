import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, ChevronRight, Database, FlaskConical, PlugZap, Plus, Power, PowerOff, RefreshCw, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PROVIDER_CONFIG_FIELDS, type ProviderConfigField } from '@/features/integrations/constants/provider-config-fields';
import {
  useCreateDatabaseIntegration,
  useCreateIntegration,
  useCreateMcpIntegration,
  useCreateOpenApiIntegration,
  useGetDatabaseIntegrationDetails,
  useGetIntegrationActions,
  useGetIntegrations,
  useGetMcpIntegrationDetails,
  useGetOpenApiIntegrationDetails,
  useParseOpenApiSpec,
  useRegenerateOpenApiTools,
  useSyncDatabaseSchema,
  useSyncMcpTools,
  useTestDatabaseConnection,
  useTestIntegration,
  useTestMcpConnection,
  useTestMcpIntegration,
  useTestOpenApiIntegration,
  useTestSavedDatabaseConnection,
  useToggleIntegrationAction,
  useUpdateIntegration,
} from '@/features/integrations/hooks/use-integrations';
import {
  DatabaseOperations,
  IntegrationProviders,
  IntegrationStatuses,
  McpAuthTypes,
  McpTransportTypes,
  OpenApiAuthTypes,
  type DatabaseIntegrationDetails,
  type DatabaseOperation,
  type DatabaseSchema,
  type DiscoveredMcpTool,
  type Integration,
  type IntegrationProvider,
  type McpAuthType,
  type McpIntegrationDetails,
  type McpTransportType,
  type OpenApiAuthType,
  type OpenApiIntegrationDetails,
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
  MCP: 'MCP',
};

const databaseProviders = [
  IntegrationProviders.DATABASE_PG,
  IntegrationProviders.DATABASE_MYSQL,
  IntegrationProviders.DATABASE_MONGO,
] as const;

const databaseOperationLabels: Record<DatabaseOperation, string> = {
  READ: 'Read',
  INSERT: 'Insert',
  UPDATE: 'Update',
  DELETE: 'Delete',
};

const openApiAuthLabels: Record<OpenApiAuthType, string> = {
  NONE: 'None',
  API_KEY: 'API key',
  BEARER: 'Bearer token',
  OAUTH2: 'OAuth2 token',
  CUSTOM_HEADERS: 'Custom headers',
};

const mcpAuthLabels: Record<McpAuthType, string> = {
  NONE: 'None',
  BEARER: 'Bearer token',
  CUSTOM_HEADERS: 'Custom headers',
  OAUTH: 'OAuth',
};

function isDatabaseProvider(provider: IntegrationProvider): provider is (typeof databaseProviders)[number] {
  return databaseProviders.includes(provider as (typeof databaseProviders)[number]);
}

function isOpenApiProvider(provider: IntegrationProvider) {
  return provider === IntegrationProviders.OPENAPI;
}

function isMcpProvider(provider: IntegrationProvider) {
  return provider === IntegrationProviders.MCP;
}

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
  const testDatabaseMutation = useTestSavedDatabaseConnection(organizationUuid);
  const testOpenApiMutation = useTestOpenApiIntegration(organizationUuid);
  const testMcpMutation = useTestMcpIntegration(organizationUuid);
  const updateIntegrationMutation = useUpdateIntegration(organizationUuid);
  const actionsQuery = useGetIntegrationActions(organizationUuid, integration.uuid);
  const toggleActionMutation = useToggleIntegrationAction(organizationUuid, integration.uuid);
  const databaseDetailsQuery = useGetDatabaseIntegrationDetails(
    organizationUuid,
    integration.uuid,
    isDatabaseProvider(integration.provider),
  );
  const syncSchemaMutation = useSyncDatabaseSchema(organizationUuid, integration.uuid);
  const openApiDetailsQuery = useGetOpenApiIntegrationDetails(
    organizationUuid,
    integration.uuid,
    isOpenApiProvider(integration.provider),
  );
  const regenerateOpenApiMutation = useRegenerateOpenApiTools(organizationUuid, integration.uuid);
  const mcpDetailsQuery = useGetMcpIntegrationDetails(
    organizationUuid,
    integration.uuid,
    isMcpProvider(integration.provider),
  );
  const syncMcpToolsMutation = useSyncMcpTools(organizationUuid, integration.uuid);
  const actions = actionsQuery.data ?? integration.actions ?? [];
  const databaseDetails = databaseDetailsQuery.data?.database ?? integration.database ?? null;
  const openApiDetails = openApiDetailsQuery.data?.openapi ?? integration.openapi ?? null;
  const mcpDetails = mcpDetailsQuery.data?.mcp ?? integration.mcp ?? null;
  const loading =
    actionsQuery.isLoading ||
    databaseDetailsQuery.isLoading ||
    openApiDetailsQuery.isLoading ||
    mcpDetailsQuery.isLoading ||
    testIntegrationMutation.isPending ||
    testDatabaseMutation.isPending ||
    testOpenApiMutation.isPending ||
    testMcpMutation.isPending ||
    updateIntegrationMutation.isPending ||
    syncSchemaMutation.isPending ||
    regenerateOpenApiMutation.isPending ||
    syncMcpToolsMutation.isPending ||
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
    if (isDatabaseProvider(integration.provider)) {
      await testDatabaseMutation.mutateAsync({ integration_uuid: integration.uuid });
      return;
    }

    if (isOpenApiProvider(integration.provider)) {
      await testOpenApiMutation.mutateAsync({ integration_uuid: integration.uuid });
      return;
    }

    if (isMcpProvider(integration.provider)) {
      await testMcpMutation.mutateAsync({ integration_uuid: integration.uuid });
      return;
    }

    await testIntegrationMutation.mutateAsync({ integration_uuid: integration.uuid });
  }

  async function syncSchema() {
    await syncSchemaMutation.mutateAsync();
  }

  async function regenerateOpenApiTools() {
    await regenerateOpenApiMutation.mutateAsync();
  }

  async function syncMcpTools() {
    await syncMcpToolsMutation.mutateAsync();
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
          {isDatabaseProvider(integration.provider) ? (
            <button
              type="button"
              disabled={loading}
              onClick={syncSchema}
              title="Sync schema"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Sync
            </button>
          ) : null}
          {isOpenApiProvider(integration.provider) ? (
            <button
              type="button"
              disabled={loading}
              onClick={regenerateOpenApiTools}
              title="Regenerate tools"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </button>
          ) : null}
          {isMcpProvider(integration.provider) ? (
            <button
              type="button"
              disabled={loading}
              onClick={syncMcpTools}
              title="Sync tools"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Sync tools
            </button>
          ) : null}
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

      {testIntegrationMutation.data || testDatabaseMutation.data || testOpenApiMutation.data || testMcpMutation.data?.success ? (
        <p className="mt-3 flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          Connection succeeded
        </p>
      ) : null}

      {testMcpMutation.data && !testMcpMutation.data.success ? (
        <p className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
          {testMcpMutation.data.error ?? 'Connection failed'}
        </p>
      ) : null}

      {isDatabaseProvider(integration.provider) ? (
        <DatabaseSchemaSection database={databaseDetails} />
      ) : null}

      {isOpenApiProvider(integration.provider) ? <OpenApiToolsSection openapi={openApiDetails} /> : null}

      {isMcpProvider(integration.provider) ? <McpToolsSection mcp={mcpDetails} /> : null}

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

function DatabaseSchemaSection({ database }: { database: DatabaseIntegrationDetails | null }) {
  const schema = database?.schema_cache;

  return (
    <div className="mt-5 border-t border-border pt-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Schema</h3>
          <p className="text-xs text-muted">
            {database?.last_schema_sync ? `Last synced ${new Date(database.last_schema_sync).toLocaleString()}` : 'Not synced yet'}
          </p>
        </div>
        {database?.allowed_ops?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {database.allowed_ops.map((operation) => (
              <span key={operation} className="rounded-md bg-surface-secondary px-2 py-1 text-xs text-muted">
                {databaseOperationLabels[operation]}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-3 rounded-lg border border-border">
        {schema?.tables?.length ? (
          <SchemaTree schema={schema} />
        ) : (
          <div className="px-4 py-6 text-sm text-muted">
            <Database className="mb-2 h-5 w-5 text-accent" />
            No cached schema has been stored for this database.
          </div>
        )}
      </div>
    </div>
  );
}

function SchemaTree({ schema }: { schema: DatabaseSchema }) {
  const [openTables, setOpenTables] = useState(() => new Set(schema.tables.slice(0, 3).map((table) => table.name)));

  function toggleTable(tableName: string) {
    setOpenTables((current) => {
      const next = new Set(current);

      if (next.has(tableName)) {
        next.delete(tableName);
      } else {
        next.add(tableName);
      }

      return next;
    });
  }

  return (
    <div className="divide-y divide-border">
      {schema.tables.map((table) => {
        const open = openTables.has(table.name);

        return (
          <div key={table.name}>
            <button
              type="button"
              onClick={() => toggleTable(table.name)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-secondary"
            >
              <span className="flex min-w-0 items-center gap-2">
                <ChevronRight className={cn('h-4 w-4 shrink-0 text-muted transition-transform', open ? 'rotate-90' : '')} />
                <span className="truncate text-sm font-medium text-foreground">{table.name}</span>
              </span>
              <span className="shrink-0 text-xs text-muted">{table.columns.length} columns</span>
            </button>
            {open ? (
              <div className="grid border-t border-border bg-background/50 px-4 py-2">
                {table.columns.map((column) => (
                  <div key={column.name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-2 text-sm">
                    <span className="min-w-0 truncate text-foreground">
                      {column.name}
                      {column.primaryKey ? <span className="ml-2 text-xs text-accent">PK</span> : null}
                    </span>
                    <span className="text-xs text-muted">
                      {column.type}
                      {column.nullable ? ' nullable' : ''}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function OpenApiToolsSection({ openapi }: { openapi: OpenApiIntegrationDetails | null }) {
  const tools = openapi?.generated_tools ?? [];

  return (
    <div className="mt-5 border-t border-border pt-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Generated tools</h3>
          <p className="text-xs text-muted">{openapi?.base_url ?? 'No parsed base URL'}</p>
        </div>
        <span className="rounded-md bg-surface-secondary px-2 py-1 text-xs text-muted">
          {tools.length} endpoint{tools.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        {tools.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted">No generated tools are stored for this spec.</p>
        ) : (
          tools.slice(0, 12).map((tool) => (
            <div key={tool.name} className="border-b border-border px-4 py-3 last:border-0">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 truncate text-sm font-medium text-foreground">{tool.key}</p>
                <code className="rounded bg-surface-secondary px-2 py-1 text-xs text-muted">{tool.name}</code>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted">{tool.description}</p>
            </div>
          ))
        )}
        {tools.length > 12 ? <p className="px-4 py-3 text-xs text-muted">{tools.length - 12} more tools stored.</p> : null}
      </div>
    </div>
  );
}

function McpToolsSection({ mcp }: { mcp: McpIntegrationDetails | null }) {
  const tools = mcp?.discovered_tools ?? [];

  return (
    <div className="mt-5 border-t border-border pt-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Discovered tools</h3>
          <p className="text-xs text-muted">
            {mcp?.server_name ? `${mcp.server_name} · ` : ''}
            {mcp?.server_url ?? 'No server URL'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-surface-secondary px-2 py-1 text-xs text-muted">
            {tools.length} tool{tools.length === 1 ? '' : 's'}
          </span>
          {mcp?.last_tool_sync ? (
            <span className="rounded-md bg-surface-secondary px-2 py-1 text-xs text-muted">
              Synced {new Date(mcp.last_tool_sync).toLocaleString()}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        {tools.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted">No tools have been discovered from this server yet.</p>
        ) : (
          tools.slice(0, 12).map((tool: DiscoveredMcpTool) => (
            <div key={tool.name} className="border-b border-border px-4 py-3 last:border-0">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 truncate text-sm font-medium text-foreground">{tool.serverToolName}</p>
                <code className="rounded bg-surface-secondary px-2 py-1 text-xs text-muted">{tool.name}</code>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted">{tool.description}</p>
            </div>
          ))
        )}
        {tools.length > 12 ? <p className="px-4 py-3 text-xs text-muted">{tools.length - 12} more tools stored.</p> : null}
      </div>
    </div>
  );
}

function AddIntegrationModal({ organizationUuid, onClose }: { organizationUuid: string; onClose: () => void }) {
  const createIntegrationMutation = useCreateIntegration(organizationUuid);
  const createDatabaseIntegrationMutation = useCreateDatabaseIntegration(organizationUuid);
  const createOpenApiIntegrationMutation = useCreateOpenApiIntegration(organizationUuid);
  const createMcpIntegrationMutation = useCreateMcpIntegration(organizationUuid);
  const testDatabaseConnectionMutation = useTestDatabaseConnection(organizationUuid);
  const parseOpenApiMutation = useParseOpenApiSpec(organizationUuid);
  const testMcpConnectionMutation = useTestMcpConnection(organizationUuid);
  const [openApiMode, setOpenApiMode] = useState<'url' | 'json'>('url');
  const [openApiRawJson, setOpenApiRawJson] = useState('');
  const [openApiAuthType, setOpenApiAuthType] = useState<OpenApiAuthType>(OpenApiAuthTypes.NONE);
  const [mcpTransportType, setMcpTransportType] = useState<McpTransportType>(McpTransportTypes.HTTP);
  const [mcpAuthType, setMcpAuthType] = useState<McpAuthType>(McpAuthTypes.NONE);
  const form = useForm<CreateIntegrationFormData>({
    resolver: zodResolver(createIntegrationSchema),
    defaultValues: {
      name: '',
      description: '',
      provider: IntegrationProviders.GITHUB,
      config: {},
      allowedOps: [DatabaseOperations.READ],
    },
  });
  const selectedProvider = form.watch('provider') as IntegrationProvider;
  const configFields = PROVIDER_CONFIG_FIELDS[selectedProvider] ?? [];
  const selectedAllowedOps = (form.watch('allowedOps') ?? [DatabaseOperations.READ]) as DatabaseOperation[];
  const isDatabase = isDatabaseProvider(selectedProvider);
  const isOpenApi = isOpenApiProvider(selectedProvider);
  const isMcp = isMcpProvider(selectedProvider);
  const busy =
    createIntegrationMutation.isPending ||
    createDatabaseIntegrationMutation.isPending ||
    createOpenApiIntegrationMutation.isPending ||
    createMcpIntegrationMutation.isPending ||
    testDatabaseConnectionMutation.isPending ||
    parseOpenApiMutation.isPending ||
    testMcpConnectionMutation.isPending;

  async function submit(values: CreateIntegrationFormData) {
    const config = buildConfig(values.config ?? {}, configFields);

    if (isDatabaseProvider(values.provider as IntegrationProvider)) {
      await createDatabaseIntegrationMutation.mutateAsync({
        name: values.name,
        description: values.description,
        provider: values.provider as Extract<IntegrationProvider, 'DATABASE_PG' | 'DATABASE_MYSQL' | 'DATABASE_MONGO'>,
        connectionString: String(config.connectionString ?? ''),
        allowedOps: normalizeDatabaseOps(values.allowedOps as DatabaseOperation[] | undefined),
      });
      onClose();
      return;
    }

    if (isOpenApiProvider(values.provider as IntegrationProvider)) {
      await createOpenApiIntegrationMutation.mutateAsync({
        name: values.name,
        description: values.description,
        specUrl: openApiMode === 'url' ? String(config.specUrl ?? '') : undefined,
        rawJson: openApiMode === 'json' ? openApiRawJson : undefined,
        authType: openApiAuthType,
        authConfig: buildOpenApiAuthConfig(openApiAuthType, config),
        credentials: buildOpenApiCredentials(openApiAuthType, config),
      });
      onClose();
      return;
    }

    if (isMcpProvider(values.provider as IntegrationProvider)) {
      await createMcpIntegrationMutation.mutateAsync({
        name: values.name,
        description: values.description,
        serverUrl: String(config.serverUrl ?? ''),
        transportType: mcpTransportType,
        authType: mcpAuthType,
        authConfig: buildMcpAuthConfig(mcpAuthType, config),
        credentials: buildMcpCredentials(mcpAuthType, config),
      });
      onClose();
      return;
    }

    await createIntegrationMutation.mutateAsync({
      name: values.name,
      description: values.description,
      provider: values.provider as IntegrationProvider,
      config,
    });
    onClose();
  }

  async function testDatabaseConnection() {
    const config = buildConfig(form.getValues('config') ?? {}, configFields);

    await testDatabaseConnectionMutation.mutateAsync({
      provider: selectedProvider as Extract<IntegrationProvider, 'DATABASE_PG' | 'DATABASE_MYSQL' | 'DATABASE_MONGO'>,
      connectionString: String(config.connectionString ?? ''),
    });
  }

  async function parseOpenApiSpec() {
    const config = buildConfig(form.getValues('config') ?? {}, configFields);

    await parseOpenApiMutation.mutateAsync({
      specUrl: openApiMode === 'url' ? String(config.specUrl ?? '') : undefined,
      rawJson: openApiMode === 'json' ? openApiRawJson : undefined,
    });
  }

  async function testMcpConnection() {
    const config = buildConfig(form.getValues('config') ?? {}, configFields);

    await testMcpConnectionMutation.mutateAsync({
      serverUrl: String(config.serverUrl ?? ''),
      transportType: mcpTransportType,
      authType: mcpAuthType,
      authConfig: buildMcpAuthConfig(mcpAuthType, config),
      credentials: buildMcpCredentials(mcpAuthType, config),
    });
  }

  function toggleAllowedOperation(operation: DatabaseOperation, checked: boolean) {
    const current = new Set(selectedAllowedOps);

    if (checked) {
      current.add(operation);
    } else if (operation !== DatabaseOperations.READ) {
      current.delete(operation);
    }

    current.add(DatabaseOperations.READ);
    form.setValue('allowedOps', Array.from(current), { shouldDirty: true, shouldValidate: true });
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
              {configFields
                .filter(
                  (field) =>
                    (!isOpenApi || openApiVisibleField(field.key, openApiAuthType, openApiMode)) &&
                    (!isMcp || mcpVisibleField(field.key, mcpAuthType)),
                )
                .map((configField) => (
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

            {isMcp ? (
              <div className="grid gap-3 rounded-lg border border-border p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm">
                    <span className="text-sm font-medium text-foreground">Transport</span>
                    <select
                      value={mcpTransportType}
                      onChange={(event) => setMcpTransportType(event.target.value as McpTransportType)}
                      className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="HTTP">HTTP (Streamable)</option>
                      <option value="SSE">SSE</option>
                    </select>
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="text-sm font-medium text-foreground">Auth type</span>
                    <select
                      value={mcpAuthType}
                      onChange={(event) => setMcpAuthType(event.target.value as McpAuthType)}
                      className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
                    >
                      {Object.values(McpAuthTypes).map((authType) => (
                        <option key={authType} value={authType}>
                          {mcpAuthLabels[authType]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={testMcpConnection}
                    loading={testMcpConnectionMutation.isPending}
                    className="sm:w-auto"
                  >
                    <FlaskConical className="h-4 w-4" />
                    Test connection
                  </Button>
                  {testMcpConnectionMutation.data?.success ? (
                    <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      {testMcpConnectionMutation.data.serverName ?? 'Server'} · {testMcpConnectionMutation.data.toolCount ?? 0} tools
                    </span>
                  ) : null}
                </div>
                {testMcpConnectionMutation.data && !testMcpConnectionMutation.data.success ? (
                  <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
                    {testMcpConnectionMutation.data.error ?? 'Connection failed'}
                  </p>
                ) : null}
              </div>
            ) : null}

            {isOpenApi ? (
              <div className="grid gap-3 rounded-lg border border-border p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="flex items-center gap-2 text-sm text-muted">
                    <input
                      type="radio"
                      checked={openApiMode === 'url'}
                      onChange={() => setOpenApiMode('url')}
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    Paste URL
                  </label>
                  <label className="flex items-center gap-2 text-sm text-muted">
                    <input
                      type="radio"
                      checked={openApiMode === 'json'}
                      onChange={() => setOpenApiMode('json')}
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    Paste JSON
                  </label>
                </div>

                {openApiMode === 'json' ? (
                  <textarea
                    value={openApiRawJson}
                    onChange={(event) => setOpenApiRawJson(event.target.value)}
                    rows={8}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
                    placeholder='{"openapi":"3.0.3","paths":{}}'
                  />
                ) : null}

                <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                  <label className="grid gap-1 text-sm">
                    <span className="text-sm font-medium text-foreground">Auth type</span>
                    <select
                      value={openApiAuthType}
                      onChange={(event) => setOpenApiAuthType(event.target.value as OpenApiAuthType)}
                      className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent"
                    >
                      {Object.values(OpenApiAuthTypes).map((authType) => (
                        <option key={authType} value={authType}>
                          {openApiAuthLabels[authType]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={parseOpenApiSpec}
                    loading={parseOpenApiMutation.isPending}
                    className="sm:w-auto"
                  >
                    <FlaskConical className="h-4 w-4" />
                    Parse spec
                  </Button>
                </div>

                {parseOpenApiMutation.data ? (
                  <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                    {parseOpenApiMutation.data.operationsCount} endpoints found at {parseOpenApiMutation.data.baseUrl}
                  </div>
                ) : null}
              </div>
            ) : null}

            {isDatabase ? (
              <div className="grid gap-3 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Allowed operations</p>
                  <p className="mt-1 text-xs text-muted">Read is always enabled so the agent can inspect data safely.</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.values(DatabaseOperations).map((operation) => (
                    <label key={operation} className="flex items-center gap-2 text-sm text-muted">
                      <input
                        type="checkbox"
                        checked={selectedAllowedOps.includes(operation)}
                        disabled={operation === DatabaseOperations.READ}
                        onChange={(event) => toggleAllowedOperation(operation, event.target.checked)}
                        className="h-4 w-4 accent-[var(--accent)]"
                      />
                      {databaseOperationLabels[operation]}
                    </label>
                  ))}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={testDatabaseConnection}
                    loading={testDatabaseConnectionMutation.isPending}
                    className="sm:w-auto"
                  >
                    <FlaskConical className="h-4 w-4" />
                    Test connection
                  </Button>
                  {testDatabaseConnectionMutation.data?.success ? (
                    <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      Schema loaded
                    </span>
                  ) : null}
                </div>
                {testDatabaseConnectionMutation.data?.schema ? (
                  <div className="max-h-56 overflow-auto rounded-md border border-border">
                    <SchemaTree schema={testDatabaseConnectionMutation.data.schema} />
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={onClose} className="sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" loading={busy} className="sm:w-auto">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}

function buildConfig(values: Record<string, unknown>, fields: ProviderConfigField[]) {
  return fields.reduce<Record<string, unknown>>((config, field) => {
    const value = values[field.key];

    if (value === undefined || value === '') {
      return config;
    }

    config[field.key] = field.type === 'number' ? Number(value) : value;
    return config;
  }, {});
}

function normalizeDatabaseOps(operations?: DatabaseOperation[]) {
  return Array.from(new Set([DatabaseOperations.READ, ...(operations ?? [])]));
}

function openApiVisibleField(key: string, authType: OpenApiAuthType, mode: 'url' | 'json') {
  if (key === 'specUrl') {
    return mode === 'url';
  }

  if (authType === OpenApiAuthTypes.API_KEY) {
    return ['apiKeyName', 'apiKeyLocation', 'apiKey'].includes(key);
  }

  if (authType === OpenApiAuthTypes.BEARER || authType === OpenApiAuthTypes.OAUTH2) {
    return key === 'token';
  }

  if (authType === OpenApiAuthTypes.CUSTOM_HEADERS) {
    return key === 'customHeaders';
  }

  return false;
}

function buildOpenApiAuthConfig(authType: OpenApiAuthType, config: Record<string, unknown>) {
  if (authType === OpenApiAuthTypes.API_KEY) {
    return {
      type: authType,
      name: String(config.apiKeyName ?? 'X-Api-Key'),
      in: String(config.apiKeyLocation ?? 'header') === 'query' ? 'query' : 'header',
    };
  }

  return { type: authType };
}

function buildOpenApiCredentials(authType: OpenApiAuthType, config: Record<string, unknown>) {
  if (authType === OpenApiAuthTypes.API_KEY) {
    return { apiKey: config.apiKey };
  }

  if (authType === OpenApiAuthTypes.BEARER || authType === OpenApiAuthTypes.OAUTH2) {
    return { token: config.token };
  }

  if (authType === OpenApiAuthTypes.CUSTOM_HEADERS) {
    return { headers: parseCustomHeaders(String(config.customHeaders ?? '{}')) };
  }

  return {};
}

function mcpVisibleField(key: string, authType: McpAuthType) {
  if (key === 'serverUrl') {
    return true;
  }

  if (authType === McpAuthTypes.BEARER) {
    return key === 'token';
  }

  if (authType === McpAuthTypes.CUSTOM_HEADERS) {
    return key === 'customHeaders';
  }

  if (authType === McpAuthTypes.OAUTH) {
    return ['accessToken', 'refreshToken', 'clientId', 'clientSecret', 'tokenEndpoint', 'allowedOrigins'].includes(key);
  }

  return false;
}

function buildMcpAuthConfig(authType: McpAuthType, config: Record<string, unknown>) {
  if (authType !== McpAuthTypes.OAUTH) {
    return {};
  }

  const allowedAuthorizationServerOrigins = String(config.allowedOrigins ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return { allowedAuthorizationServerOrigins };
}

function buildMcpCredentials(authType: McpAuthType, config: Record<string, unknown>) {
  if (authType === McpAuthTypes.BEARER) {
    return { token: config.token };
  }

  if (authType === McpAuthTypes.CUSTOM_HEADERS) {
    return { headers: parseCustomHeaders(String(config.customHeaders ?? '{}')) };
  }

  if (authType === McpAuthTypes.OAUTH) {
    return {
      accessToken: config.accessToken,
      refreshToken: config.refreshToken,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      tokenEndpoint: config.tokenEndpoint,
    };
  }

  return {};
}

function parseCustomHeaders(value: string) {
  try {
    const parsed = JSON.parse(value || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function StatusBadge({ status }: { status: string }) {
  const active = status === IntegrationStatuses.ACTIVE;
  const errored = status === IntegrationStatuses.ERROR;
  return (
    <span
      className={cn(
        'shrink-0 rounded-md px-2 py-1 text-xs font-medium',
        active
          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
          : errored
            ? 'bg-red-500/10 text-red-700 dark:text-red-300'
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
