# 03 — Domain Model

## Bounded Contexts

```
┌─────────────────────────────────────────────────────────────┐
│                    Platform Admin Context                    │
│  composio_toolkits, composio_toolkit_tools, composio_syncs │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Organization Integration Context                │
│  org_enabled_toolkits, org_tool_permissions                 │
│  composio_connected_accounts (mirror/cache)                   │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Legacy Integr.  │  │ Composio Session│  │ Agent Execution │
│ DB/OpenAPI/MCP  │  │ per conversation│  │ tool_calls      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Core Entities

### `ComposioToolkit` (platform catalog)
Synced from Composio API. Admin enables/disables for the platform.

| Field | Type | Notes |
|-------|------|-------|
| id | Int PK | |
| slug | String unique | Composio toolkit slug e.g. `gmail` |
| name | String | Display name |
| description | String? | |
| logo_url | String? | |
| categories | String[] | |
| tool_count | Int | |
| auth_schemes | Json | OAuth/API key metadata from Composio |
| connection_tier | Enum | ORG_SHARED \| USER_PERSONAL |
| is_enabled | Boolean | Admin curated — only enabled appear to users |
| composio_metadata | Json | Raw Composio response snapshot |
| last_synced_at | DateTime | |
| created_at / updated_at | DateTime | |

### `ComposioToolkitTool` (platform tool catalog)
Synced tools per enabled toolkit.

| Field | Type | Notes |
|-------|------|-------|
| id | Int PK | |
| toolkit_slug | String FK | |
| slug | String | e.g. `GMAIL_SEND_EMAIL` |
| name | String | |
| description | String | |
| input_schema | Json | JSON Schema |
| output_schema | Json? | |
| tags | String[] | |
| is_enabled | Boolean | Admin can disable individual tools |
| composio_version | String? | Toolkit version pin |
| unique | (toolkit_slug, slug) | |

### `ComposioSyncRun` (audit)
| Field | Type |
|-------|------|
| id | Int PK |
| sync_type | Enum: FULL \| TOOLKIT \| TOOLS |
| status | Enum: RUNNING \| COMPLETED \| FAILED |
| toolkits_upserted | Int |
| tools_upserted | Int |
| error | String? |
| started_at / completed_at | DateTime |

### `OrgEnabledToolkit`
Which curated toolkits an org has activated.

| Field | Type |
|-------|------|
| org_uuid | String FK |
| toolkit_slug | String FK |
| is_enabled | Boolean |
| unique | (org_uuid, toolkit_slug) |

### `OrgToolPermission`
Per-org tool enablement (replaces `integration_actions` for Composio).

| Field | Type |
|-------|------|
| org_uuid | String |
| tool_slug | String | Full Composio tool slug |
| enabled | Boolean |
| requires_approval | Boolean |
| required_permission_key | String? |

### `ComposioConnectedAccount` (cache/mirror)
Local mirror of Composio connected accounts for fast UI; source of truth is Composio API.

| Field | Type |
|-------|------|
| composio_account_id | String unique | `ca_*` |
| composio_user_id | String | `org:{uuid}` or `user:{uuid}` |
| org_uuid | String |
| user_uuid | String? | null when org-shared |
| toolkit_slug | String |
| status | Enum: ACTIVE \| INACTIVE \| EXPIRED \| PENDING |
| account_label | String? | e.g. "Work Gmail" |
| last_synced_at | DateTime |

### `ComposioSession` (conversation binding)
| Field | Type |
|-------|------|
| composio_session_id | String unique |
| conversation_uuid | String FK unique |
| org_uuid | String |
| user_uuid | String |
| enabled_toolkit_slugs | String[] | Snapshot at session create |
| created_at / updated_at | DateTime |

### `ComposioTrigger` (in scope)
| Field | Type |
|-------|------|
| composio_trigger_id | String unique |
| org_uuid | String |
| composio_user_id | String |
| toolkit_slug | String |
| trigger_slug | String |
| connected_account_id | String |
| is_enabled | Boolean |
| config | Json |
| webhook_subscription_id | String? |

### Legacy `Integration` (narrowed)
Remove SaaS providers from enum. Retain:

```
IntegrationProvider:
  DATABASE_PG | DATABASE_MYSQL | DATABASE_MONGO | OPENAPI | MCP
```

Keep existing subtype tables unchanged.

## Composio User ID Format

```typescript
function composioUserId(tier: ConnectionTier, orgUuid: string, userUuid?: string): string {
  if (tier === 'ORG_SHARED') return `org:${orgUuid}`;
  return `user:${userUuid}`;
}
```

Never use `default` in production (Composio security requirement).

## Tool Registry Abstraction

```typescript
interface ToolProvider {
  type: 'COMPOSIO' | 'DATABASE' | 'OPENAPI' | 'MCP' | 'OUTPUT' | 'DOCUMENT' | 'ORGANIZATION' | 'SANDBOX';
  discover(ctx: ToolDiscoveryContext): Promise<UnifiedTool[]>;
  execute(ctx: ToolExecutionContext): Promise<unknown>;
}

interface UnifiedTool {
  name: string;           // namespaced for dispatcher
  slug: string;           // canonical identifier
  providerType: ToolProviderType;
  description: string;
  inputSchema: JsonSchema;
  requiresApproval: boolean;
  requiredPermissionKey?: string;
}
```

Composio meta tools exposed as single provider returning tools from `session.tools()`.
