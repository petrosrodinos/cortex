import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2, Database, FlaskConical, Power, PowerOff, RefreshCw, Trash2, Pencil } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  useDeleteIntegration,
  useGetIntegrationActions,
  useTestIntegration,
  useToggleIntegrationAction,
  useUpdateIntegration,
} from '@/features/integrations/common/hooks/use-integrations';
import { Routes } from '@/routes/routes';
import { IntegrationStatuses, type Integration } from '@/features/integrations/common/interfaces/integration.interface';
import {
  useGetDatabaseIntegrationDetails,
  useSyncDatabaseSchema,
  useTestSavedDatabaseConnection,
} from '@/features/integrations/database/hooks/use-database-integration';
import type { DatabaseIntegrationDetails, DatabaseSchema } from '@/features/integrations/database/interfaces/database.interface';
import {
  useGetMcpIntegrationDetails,
  useSyncMcpTools,
  useTestMcpIntegration,
} from '@/features/integrations/mcp/hooks/use-mcp-integration';
import type { DiscoveredMcpTool, McpIntegrationDetails } from '@/features/integrations/mcp/interfaces/mcp.interface';
import {
  useGetOpenApiIntegrationDetails,
  useRegenerateOpenApiTools,
  useTestOpenApiIntegration,
} from '@/features/integrations/openapi/hooks/use-openapi-integration';
import type { OpenApiIntegrationDetails } from '@/features/integrations/openapi/interfaces/openapi.interface';
import { databaseOperationLabels } from '@/features/integrations/constants/provider-metadata';
import { isDatabaseProvider, isOpenApiProvider, isMcpProvider } from '@/features/integrations/utils/integration.utils';
import { providerLabels } from '@/features/integrations/constants/provider-metadata';
import { StatusBadge } from './status-badge';
import { cn } from '@/lib/utils';

interface IntegrationDetailProps {
  organizationUuid: string;
  integration: Integration;
}

export function IntegrationDetail({ organizationUuid, integration }: IntegrationDetailProps) {
  const navigate = useNavigate();
  const [confirmDialog, setConfirmDialog] = useState<{ action: 'enable' | 'disable' | 'remove' } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const testIntegrationMutation = useTestIntegration(organizationUuid);
  const testDatabaseMutation = useTestSavedDatabaseConnection(organizationUuid);
  const testOpenApiMutation = useTestOpenApiIntegration(organizationUuid);
  const testMcpMutation = useTestMcpIntegration(organizationUuid);
  const updateIntegrationMutation = useUpdateIntegration(organizationUuid);
  const deleteIntegrationMutation = useDeleteIntegration(organizationUuid);
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
    deleteIntegrationMutation.isPending ||
    syncSchemaMutation.isPending ||
    regenerateOpenApiMutation.isPending ||
    syncMcpToolsMutation.isPending ||
    toggleActionMutation.isPending;

  function openEditModal() {
    setEditName(integration.name);
    setEditDescription(integration.description ?? '');
    setEditModalOpen(true);
  }

  async function saveEdit() {
    if (!editName.trim()) return;
    await updateIntegrationMutation.mutateAsync({
      integration_uuid: integration.uuid,
      payload: { name: editName.trim(), description: editDescription.trim() },
    });
    setEditModalOpen(false);
  }

  async function removeIntegration() {
    await deleteIntegrationMutation.mutateAsync({ integration_uuid: integration.uuid });
    setConfirmDialog(null);
    navigate(Routes.dashboard.integrations);
  }

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
    setConfirmDialog(null);
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

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold text-foreground">{integration.name}</h2>
            <StatusBadge status={integration.status} />
            <button
              type="button"
              onClick={openEditModal}
              disabled={loading}
              title="Edit integration"
              className="grid h-5 w-5 place-items-center rounded text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-40"
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>
          {integration.description ? (
            <p className="mt-1 text-sm text-muted">{integration.description}</p>
          ) : null}
          <p className="mt-1 text-xs text-muted">{providerLabels[integration.provider]}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={testConnection}
            title="Test connection"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-blue-500/40 bg-blue-500/10 px-3 text-sm text-blue-600 hover:bg-blue-500/20 dark:text-blue-400 disabled:opacity-50"
          >
            <FlaskConical className="h-4 w-4" />
            Test
          </button>
          {isDatabaseProvider(integration.provider) ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => syncSchemaMutation.mutateAsync()}
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
              onClick={() => regenerateOpenApiMutation.mutateAsync()}
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
              onClick={() => syncMcpToolsMutation.mutateAsync()}
              title="Sync tools"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Sync tools
            </button>
          ) : null}
          {integration.status === IntegrationStatuses.ACTIVE ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => setConfirmDialog({ action: 'disable' })}
              title="Disable integration"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 text-sm text-red-600 hover:bg-red-500/20 dark:text-red-400 disabled:opacity-50"
            >
              <PowerOff className="h-4 w-4" />
              Disable
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={() => setConfirmDialog({ action: 'enable' })}
              title="Enable integration"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 text-sm text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400 disabled:opacity-50"
            >
              <Power className="h-4 w-4" />
              Enable
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={() => setConfirmDialog({ action: 'remove' })}
            title="Remove integration"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>

        <ConfirmationDialog
          open={confirmDialog !== null}
          variant={confirmDialog?.action === 'enable' ? 'confirm' : 'danger'}
          title={
            confirmDialog?.action === 'enable' ? 'Enable integration'
            : confirmDialog?.action === 'remove' ? 'Remove integration'
            : 'Disable integration'
          }
          description={
            confirmDialog?.action === 'enable'
              ? 'This will make the integration active and allow the agent to use its actions.'
              : confirmDialog?.action === 'remove'
              ? 'This will permanently delete the integration and all its associated data. This action cannot be undone.'
              : 'This will pause the integration. The agent will no longer be able to use its actions.'
          }
          confirmLabel={
            confirmDialog?.action === 'enable' ? 'Enable'
            : confirmDialog?.action === 'remove' ? 'Remove'
            : 'Disable'
          }
          loading={updateIntegrationMutation.isPending || deleteIntegrationMutation.isPending}
          onConfirm={confirmDialog?.action === 'remove' ? removeIntegration : toggleStatus}
          onOpenChange={(open) => { if (!open) setConfirmDialog(null); }}
        />
      </div>

      {editModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-[color-mix(in_oklch,black_42%,transparent)]"
            onClick={() => setEditModalOpen(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-integration-title"
            className="relative w-full max-w-[460px] rounded-lg border border-border bg-surface p-5 shadow-xl"
            style={{ boxShadow: '0 24px 60px -20px color-mix(in oklch, black 55%, transparent)' }}
          >
            <h2 id="edit-integration-title" className="text-sm font-semibold text-foreground">
              Edit integration
            </h2>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-name" className="text-xs font-medium text-muted">
                  Name
                </label>
                <input
                  id="edit-name"
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditModalOpen(false); }}
                  className="h-9 w-full rounded-md border border-border bg-transparent px-3 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-description" className="text-xs font-medium text-muted">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Escape') setEditModalOpen(false); }}
                  rows={3}
                  className="w-full resize-none rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={updateIntegrationMutation.isPending}
                onClick={() => setEditModalOpen(false)}
                className="inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm font-medium text-muted transition-colors hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updateIntegrationMutation.isPending || !editName.trim()}
                onClick={saveEdit}
                className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-3 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
              >
                {updateIntegrationMutation.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </section>
        </div>
      ) : null}

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
            actions.map((action) => {
              const isLocked = action.key === 'get_schema' || action.key === 'query';
              return (
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
                  <button
                    type="button"
                    role="switch"
                    aria-checked={action.enabled}
                    disabled={loading || isLocked}
                    onClick={() =>
                      toggleActionMutation.mutate({
                        action_uuid: action.uuid,
                        payload: { enabled: !action.enabled },
                      })
                    }
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors',
                      action.enabled ? 'bg-accent' : 'bg-border',
                      (loading || isLocked) && 'cursor-not-allowed opacity-60',
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform',
                        action.enabled && 'translate-x-4',
                      )}
                    />
                  </button>
                </div>
              );
            })
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
            {database?.last_schema_sync
              ? `Last synced ${new Date(database.last_schema_sync).toLocaleString()}`
              : 'Not synced yet'}
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
        {tools.length > 12 ? (
          <p className="px-4 py-3 text-xs text-muted">{tools.length - 12} more tools stored.</p>
        ) : null}
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
        {tools.length > 12 ? (
          <p className="px-4 py-3 text-xs text-muted">{tools.length - 12} more tools stored.</p>
        ) : null}
      </div>
    </div>
  );
}
