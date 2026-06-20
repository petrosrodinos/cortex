# 05 — Backend Architecture

## New Modules

```
api/src/modules/composio/
├── composio.module.ts
├── composio.config.ts                    # COMPOSIO_API_KEY validation
├── composio-client.service.ts            # Singleton Composio SDK wrapper
├── sync/
│   ├── composio-sync.service.ts          # Startup + manual sync
│   └── composio-sync.runner.ts           # OnModuleInit hook
├── toolkits/
│   ├── composio-toolkits.service.ts
│   └── composio-toolkits.controller.ts   # Admin only
├── connections/
│   ├── composio-connections.service.ts
│   └── composio-connections.controller.ts  # User/org routes
├── sessions/
│   └── composio-session.service.ts
├── triggers/
│   ├── composio-triggers.service.ts
│   ├── composio-triggers.controller.ts
│   └── composio-webhook.controller.ts    # Public webhook (verified)
└── org/
    ├── org-toolkits.service.ts           # Org enablement
    └── org-toolkits.controller.ts

api/src/modules/tools/
├── tools.module.ts
├── registry/
│   ├── unified-tool-registry.service.ts  # Replaces IntegrationRegistry for discovery
│   └── providers/
│       ├── composio-tool.provider.ts
│       ├── database-tool.provider.ts
│       ├── openapi-tool.provider.ts
│       ├── mcp-tool.provider.ts
│       ├── output-tool.provider.ts
│       ├── document-tool.provider.ts
│       └── organization-tool.provider.ts
```

## Refactored Modules

### Keep, narrow scope
- `integrations/databases/` — unchanged
- `integrations/openapi/` — unchanged
- `integrations/mcp/` — unchanged
- `integrations/framework/` — slim down; execution delegates to `UnifiedToolRegistry`

### Delete
- `integrations/saas/` — entire tree
- `integrations/integrations.controller.ts` SaaS CRUD — replace with composio connections controller
- `integrations/integrations.service.ts` SaaS logic

### Modify
- `shared/services/ai/agents/tools/integration-tools.factory.ts` → `agent-tools.factory.ts`
  - Calls `UnifiedToolRegistry.discover()`
  - Merges Composio meta tools from `ComposioSessionService`
- `tool-dispatcher.service.ts` — route by `provider_type`

## Dependency Graph

```
AppModule
  ├── ComposioModule (global client)
  ├── ToolsModule (exports UnifiedToolRegistry)
  ├── IntegrationsModule (DB/OpenAPI/MCP only)
  ├── AiModule (agent runner)
  └── AdminModule (SUPER_ADMIN guards)
```

## Composio Client Service

```typescript
@Injectable()
export class ComposioClientService implements OnModuleInit {
  private client: Composio;

  constructor(private config: ConfigService) {
    this.client = new Composio({
      apiKey: config.get('COMPOSIO_API_KEY'),
      provider: new VercelProvider(),
    });
  }

  getClient(): Composio { return this.client; }
}
```

Install:
```bash
cd api && pnpm add @composio/core @composio/vercel
```

## Environment

Add to `env.validation.ts`:
```typescript
COMPOSIO_API_KEY: z.string().min(1),
COMPOSIO_WEBHOOK_SECRET: z.string().optional(),
```

Remove optional — make required in all non-test environments.

## Guards

### New: `SuperAdminGuard`
Checks `req.user.role === AuthRole.SUPER_ADMIN`

### New: `OrganizationMatchGuard`
Validates JWT `organization_uuid` matches `:organization_uuid` path param

### Apply to all org routes:
```typescript
@UseGuards(JwtGuard, OrganizationMatchGuard, OrganizationGuard)
```

## Startup Sync

`ComposioSyncService` implements `OnApplicationBootstrap`:

1. Create `composio_sync_runs` row (RUNNING)
2. Paginate `composio.toolkits.get()` with cursor
3. Upsert each toolkit (slug as unique key)
4. For each toolkit where `is_enabled=true` OR new: fetch tools via `composio.tools.getRawComposioTools({ toolkits: [slug] })`
5. Upsert `composio_toolkit_tools`
6. Apply `connection_tier` from fixed mapping if new row
7. Mark sync COMPLETED

Idempotent: uses `upsert` on `slug` / `(toolkit_slug, slug)`.

Manual re-sync: `POST /admin/composio/sync` (SUPER_ADMIN).

## Event Flow (triggers)

```
Composio webhook → POST /webhooks/composio
  → verify signature (COMPOSIO_WEBHOOK_SECRET)
  → ComposioTriggersService.handleEvent()
  → enqueue BullMQ job for agent/automation
```

## File Deletion List

Remove all files under:
- `api/src/modules/integrations/saas/github/`
- `api/src/modules/integrations/saas/slack/`
- ... (all 13 providers)
- Related spec files in `saas/*.spec.ts`

Update `saas-integrations.module.ts` → delete file.
