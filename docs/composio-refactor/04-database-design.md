# 04 — Database Design

## Migration Strategy

Development environment — **no backwards compatibility**. Single breaking migration replacing SaaS integration data.

### Phase 1: Add Composio tables
### Phase 2: Migrate/remove SaaS data
### Phase 3: Shrink `IntegrationProvider` enum
### Phase 4: Drop unused columns/tables if any

---

## Remove

### Enum values (from `IntegrationProvider`)
Delete all SaaS providers:
```
GITHUB, SLACK, STRIPE, HUBSPOT, LINEAR, NOTION, GOOGLE_DRIVE,
SMTP, GMAIL, RESEND, SENDGRID, POSTHOG, INTERCOM
```

### Tables
No tables dropped entirely — `integrations` retained for DB/OpenAPI/MCP.

### Data
- `DELETE FROM integrations WHERE provider IN (...saas providers...)`
- Cascade deletes `integration_actions` rows

### Backend code (not DB but coordinated)
- Delete `api/src/modules/integrations/saas/` entire directory
- Remove SaaS registrations from `integrations.module.ts`

---

## Modify

### `integrations`
No schema change required. Only non-Composio providers remain.

### `integration_actions`
- Keep for DB/OpenAPI/MCP tools
- Add comment: Composio tools use `org_tool_permissions` instead

### `conversations`
Add:
```prisma
composio_session_id String? @unique
```

### `tool_calls`
Add:
```prisma
provider_type     String?   // COMPOSIO | DATABASE | OPENAPI | MCP | OUTPUT | ...
composio_tool_slug String?
composio_session_id String?
```
Make `integration_uuid` nullable (already is) — Composio calls won't have integration FK.

### `permissions` seed
Remove provider-specific keys:
- `integrations:github:read_repos`
- `integrations:github:connect`
- `integrations:stripe:manage`

Add generic toolkit permission pattern:
- `integrations:toolkits:connect`
- `integrations:toolkits:manage`
- `integrations:tools:execute`
- `admin:composio:manage` (SUPER_ADMIN platform)

---

## New Tables

### `composio_toolkits`
```prisma
enum ComposioConnectionTier {
  ORG_SHARED
  USER_PERSONAL
}

model ComposioToolkit {
  id                Int                    @id @default(autoincrement())
  slug              String                 @unique
  name              String
  description       String?
  logo_url          String?
  categories        String[]               @default([])
  tool_count        Int                    @default(0)
  auth_schemes      Json                   @default("[]")
  connection_tier   ComposioConnectionTier
  is_enabled        Boolean                @default(false)
  composio_metadata Json?
  last_synced_at    DateTime?
  created_at        DateTime               @default(now())
  updated_at        DateTime               @updatedAt

  tools ComposioToolkitTool[]

  @@index([is_enabled])
  @@index([connection_tier])
  @@map("composio_toolkits")
}
```

### `composio_toolkit_tools`
```prisma
model ComposioToolkitTool {
  id               Int      @id @default(autoincrement())
  toolkit_slug     String
  slug             String
  name             String
  description      String   @default("")
  input_schema     Json
  output_schema    Json?
  tags             String[] @default([])
  is_enabled       Boolean  @default(true)
  composio_version String?
  last_synced_at   DateTime?
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt

  toolkit ComposioToolkit @relation(fields: [toolkit_slug], references: [slug], onDelete: Cascade)

  @@unique([toolkit_slug, slug])
  @@index([toolkit_slug])
  @@index([is_enabled])
  @@map("composio_toolkit_tools")
}
```

### `composio_sync_runs`
```prisma
enum ComposioSyncType {
  FULL
  TOOLKIT
  TOOLS
}

enum ComposioSyncStatus {
  RUNNING
  COMPLETED
  FAILED
}

model ComposioSyncRun {
  id                Int               @id @default(autoincrement())
  uuid              String            @unique @default(uuid())
  sync_type         ComposioSyncType
  status            ComposioSyncStatus @default(RUNNING)
  toolkits_upserted Int               @default(0)
  tools_upserted    Int               @default(0)
  error             String?
  started_at        DateTime          @default(now())
  completed_at      DateTime?

  @@index([status])
  @@index([started_at])
  @@map("composio_sync_runs")
}
```

### `org_enabled_toolkits`
```prisma
model OrgEnabledToolkit {
  id           Int      @id @default(autoincrement())
  uuid         String   @unique @default(uuid())
  org_uuid     String
  toolkit_slug String
  is_enabled   Boolean  @default(true)
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt

  organization Organization @relation(fields: [org_uuid], references: [uuid], onDelete: Cascade)
  toolkit      ComposioToolkit @relation(fields: [toolkit_slug], references: [slug], onDelete: Cascade)

  @@unique([org_uuid, toolkit_slug])
  @@index([org_uuid])
  @@map("org_enabled_toolkits")
}
```

### `org_tool_permissions`
```prisma
model OrgToolPermission {
  id                      Int     @id @default(autoincrement())
  uuid                    String  @unique @default(uuid())
  org_uuid                String
  tool_slug               String
  enabled                 Boolean @default(true)
  requires_approval       Boolean @default(false)
  required_permission_key String?
  created_at              DateTime @default(now())
  updated_at              DateTime @updatedAt

  organization Organization @relation(fields: [org_uuid], references: [uuid], onDelete: Cascade)

  @@unique([org_uuid, tool_slug])
  @@index([org_uuid])
  @@index([tool_slug])
  @@map("org_tool_permissions")
}
```

### `composio_connected_accounts`
```prisma
enum ComposioAccountStatus {
  ACTIVE
  INACTIVE
  EXPIRED
  PENDING
}

model ComposioConnectedAccount {
  id                   Int                   @id @default(autoincrement())
  uuid                 String                @unique @default(uuid())
  composio_account_id  String                @unique
  composio_user_id     String
  org_uuid             String
  user_uuid            String?
  toolkit_slug         String
  status               ComposioAccountStatus @default(PENDING)
  account_label        String?
  last_synced_at       DateTime?
  created_at           DateTime              @default(now())
  updated_at           DateTime              @updatedAt

  organization Organization @relation(fields: [org_uuid], references: [uuid], onDelete: Cascade)

  @@index([org_uuid])
  @@index([user_uuid])
  @@index([toolkit_slug])
  @@index([composio_user_id])
  @@map("composio_connected_accounts")
}
```

### `composio_triggers`
```prisma
model ComposioTrigger {
  id                      Int      @id @default(autoincrement())
  uuid                    String   @unique @default(uuid())
  composio_trigger_id     String   @unique
  org_uuid                String
  composio_user_id        String
  toolkit_slug            String
  trigger_slug            String
  connected_account_id    String
  is_enabled              Boolean  @default(true)
  config                  Json     @default("{}")
  webhook_subscription_id String?
  created_at              DateTime @default(now())
  updated_at              DateTime @updatedAt

  organization Organization @relation(fields: [org_uuid], references: [uuid], onDelete: Cascade)

  @@index([org_uuid])
  @@index([toolkit_slug])
  @@index([is_enabled])
  @@map("composio_triggers")
}
```

---

## Indexes Summary

| Table | Index purpose |
|-------|---------------|
| composio_toolkits (is_enabled) | User catalog queries |
| composio_toolkit_tools (toolkit_slug) | Tool list per toolkit |
| org_enabled_toolkits (org_uuid) | Org integration page |
| composio_connected_accounts (composio_user_id) | Connection lookup |
| composio_triggers (org_uuid, is_enabled) | Active triggers |

## Seed Data

### Connection tier defaults
Seed `connection_tier` on first sync using fixed list from `02-gap-analysis.md`.

### Initial enabled toolkits
SUPER_ADMIN enables starter set via admin UI after first sync — no auto-enable all.
