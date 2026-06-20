import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, FlaskConical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PROVIDER_CONFIG_FIELDS, type ProviderConfigField } from '@/features/integrations/constants/provider-config-fields';
import type { IntegrationProvider } from '@/features/integrations/common/interfaces/integration.interface';
import {
  useCreateDatabaseIntegration,
  useTestDatabaseConnection,
} from '@/features/integrations/database/hooks/use-database-integration';
import { DatabaseOperations, type DatabaseOperation } from '@/features/integrations/database/interfaces/database.interface';
import {
  useCreateMcpIntegration,
  useTestMcpConnection,
} from '@/features/integrations/mcp/hooks/use-mcp-integration';
import { McpAuthTypes, McpTransportTypes, type McpAuthType, type McpTransportType } from '@/features/integrations/mcp/interfaces/mcp.interface';
import {
  useCreateOpenApiIntegration,
  useParseOpenApiSpec,
} from '@/features/integrations/openapi/hooks/use-openapi-integration';
import { OpenApiAuthTypes, type OpenApiAuthType } from '@/features/integrations/openapi/interfaces/openapi.interface';
import {
  createIntegrationSchema,
  type CreateIntegrationFormData,
} from '@/features/integrations/validation-schemas/integration.schema';
import { PROVIDER_ICON_META, providerLabels, openApiAuthLabels, mcpAuthLabels, databaseOperationLabels } from '@/features/integrations/constants/provider-metadata';
import { isDatabaseProvider, isOpenApiProvider, isMcpProvider } from '@/features/integrations/utils/integration.utils';
import { ProviderSetupGuide } from './provider-setup-guide';

interface AddIntegrationModalProps {
  organizationUuid: string;
  provider: IntegrationProvider;
  onClose: () => void;
}

export function AddIntegrationModal({ organizationUuid, provider, onClose }: AddIntegrationModalProps) {
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
      provider,
      config: {},
      allowedOps: [DatabaseOperations.READ],
    },
  });

  const configFields = PROVIDER_CONFIG_FIELDS[provider] ?? [];
  const selectedAllowedOps = (form.watch('allowedOps') ?? [DatabaseOperations.READ]) as DatabaseOperation[];
  const isDatabase = isDatabaseProvider(provider);
  const isOpenApi = isOpenApiProvider(provider);
  const isMcp = isMcpProvider(provider);
  const busy =
    createDatabaseIntegrationMutation.isPending ||
    createOpenApiIntegrationMutation.isPending ||
    createMcpIntegrationMutation.isPending ||
    testDatabaseConnectionMutation.isPending ||
    parseOpenApiMutation.isPending ||
    testMcpConnectionMutation.isPending;

  const iconMeta = PROVIDER_ICON_META[provider];
  const ModalIcon = iconMeta?.icon;

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

    onClose();
  }

  async function testDatabaseConnection() {
    const config = buildConfig(form.getValues('config') ?? {}, configFields);
    await testDatabaseConnectionMutation.mutateAsync({
      provider: provider as Extract<IntegrationProvider, 'DATABASE_PG' | 'DATABASE_MYSQL' | 'DATABASE_MONGO'>,
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
      <section className="w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-lg border border-border bg-surface shadow-xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            title="Back"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: iconMeta?.bg ?? '#6b7280' }}
          >
            {ModalIcon ? <ModalIcon size={16} className="text-white" /> : null}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground">{providerLabels[provider]}</h2>
            <p className="text-xs text-muted">Create an encrypted provider connection.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="grid gap-4 p-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Production GitHub" />
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
                    <Input {...field} placeholder="Main engineering org" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ProviderSetupGuide provider={provider} />

            <div className="grid gap-3 sm:grid-cols-2">
              {configFields
                .filter(
                  (field) =>
                    (!isOpenApi || openApiVisibleField(field.key, openApiAuthType, openApiMode)) &&
                    (!isMcp || mcpVisibleField(field.key, mcpAuthType)),
                )
                .map((configField) => (
                  <FormField
                    key={`${provider}-${configField.key}`}
                    control={form.control}
                    name={`config.${configField.key}` as any}
                    render={({ field }) => (
                      <FormItem className={configField.span === 'full' ? 'sm:col-span-2' : undefined}>
                        <FormLabel>{configField.label}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={(field.value as string | number | undefined) ?? ''}
                            type={configField.type}
                            autoComplete="off"
                            placeholder={configField.placeholder}
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
                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-xs font-medium text-foreground">Always-enabled actions</p>
                  <div className="grid gap-2">
                    {[
                      { label: 'Get database schema', description: 'Inspect the table and column structure.' },
                      { label: 'Query database', description: 'Execute read queries against the database.' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted">{item.description}</p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked
                          disabled
                          className="relative inline-flex h-5 w-9 shrink-0 cursor-not-allowed items-center rounded-full bg-accent opacity-60"
                        >
                          <span className="pointer-events-none block h-4 w-4 translate-x-4 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
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
                    <SchemaTreeInline schema={testDatabaseConnectionMutation.data.schema} />
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

function SchemaTreeInline({ schema }: { schema: any }) {
  const [openTables, setOpenTables] = useState(() => new Set<string>());

  function toggleTable(name: string) {
    setOpenTables((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div className="divide-y divide-border">
      {schema.tables?.map((table: any) => {
        const open = openTables.has(table.name);
        return (
          <div key={table.name}>
            <button
              type="button"
              onClick={() => toggleTable(table.name)}
              className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm hover:bg-surface-secondary"
            >
              <span className="truncate font-medium text-foreground">{table.name}</span>
              <span className="shrink-0 text-xs text-muted">{table.columns?.length ?? 0} cols</span>
            </button>
            {open && table.columns?.length ? (
              <div className="border-t border-border bg-background/50 px-4 py-1">
                {table.columns.map((col: any) => (
                  <div key={col.name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-1 text-xs">
                    <span className="truncate text-foreground">{col.name}</span>
                    <span className="text-muted">{col.type}</span>
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

function buildConfig(values: Record<string, unknown>, fields: ProviderConfigField[]) {
  return fields.reduce<Record<string, unknown>>((config, field) => {
    const value = values[field.key];
    if (value === undefined || value === '') return config;
    config[field.key] = field.type === 'number' ? Number(value) : value;
    return config;
  }, {});
}

function normalizeDatabaseOps(operations?: DatabaseOperation[]) {
  return Array.from(new Set([DatabaseOperations.READ, ...(operations ?? [])]));
}

function openApiVisibleField(key: string, authType: OpenApiAuthType, mode: 'url' | 'json') {
  if (key === 'specUrl') return mode === 'url';
  if (authType === OpenApiAuthTypes.API_KEY) return ['apiKeyName', 'apiKeyLocation', 'apiKey'].includes(key);
  if (authType === OpenApiAuthTypes.BEARER || authType === OpenApiAuthTypes.OAUTH2) return key === 'token';
  if (authType === OpenApiAuthTypes.CUSTOM_HEADERS) return key === 'customHeaders';
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
  if (authType === OpenApiAuthTypes.API_KEY) return { apiKey: config.apiKey };
  if (authType === OpenApiAuthTypes.BEARER || authType === OpenApiAuthTypes.OAUTH2) return { token: config.token };
  if (authType === OpenApiAuthTypes.CUSTOM_HEADERS) return { headers: parseCustomHeaders(String(config.customHeaders ?? '{}')) };
  return {};
}

function mcpVisibleField(key: string, authType: McpAuthType) {
  if (key === 'serverUrl') return true;
  if (authType === McpAuthTypes.BEARER) return key === 'token';
  if (authType === McpAuthTypes.CUSTOM_HEADERS) return key === 'customHeaders';
  if (authType === McpAuthTypes.OAUTH) {
    return ['accessToken', 'refreshToken', 'clientId', 'clientSecret', 'tokenEndpoint', 'allowedOrigins'].includes(key);
  }
  return false;
}

function buildMcpAuthConfig(authType: McpAuthType, config: Record<string, unknown>) {
  if (authType !== McpAuthTypes.OAUTH) return {};
  const allowedAuthorizationServerOrigins = String(config.allowedOrigins ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return { allowedAuthorizationServerOrigins };
}

function buildMcpCredentials(authType: McpAuthType, config: Record<string, unknown>) {
  if (authType === McpAuthTypes.BEARER) return { token: config.token };
  if (authType === McpAuthTypes.CUSTOM_HEADERS) return { headers: parseCustomHeaders(String(config.customHeaders ?? '{}')) };
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
