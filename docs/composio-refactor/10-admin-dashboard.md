# 10 — Admin Dashboard

## Access Control

- Route prefix: `/admin`
- Guard: `AuthRole.SUPER_ADMIN` only (backend `SuperAdminGuard` + frontend role check)
- No org context required for platform admin routes

## Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/admin` | AdminHome | Overview stats |
| `/admin/composio` | ComposioDashboard | Sync status, quick actions |
| `/admin/composio/toolkits` | ToolkitList | Search, filter, enable/disable |
| `/admin/composio/toolkits/:slug` | ToolkitDetail | Metadata, tools, stats |
| `/admin/composio/sync` | SyncHistory | Past sync runs |

## Toolkit List Page

### Features
- Search by name/slug
- Filter: enabled/disabled, category, connection tier
- Columns: logo, name, slug, categories, tool count, enabled, tier, connected accounts count, last synced
- Actions per row: Enable, Disable, Refresh, View tools
- Bulk: Sync all

### API calls
- `GET /admin/composio/toolkits`
- `PATCH /admin/composio/toolkits/:slug`
- `POST /admin/composio/sync`

## Toolkit Detail Page

### Sections
1. **Metadata** — name, description, logo, categories, auth schemes, connection tier (editable)
2. **Tools table** — slug, name, enabled toggle, description preview
3. **Stats** — connected accounts count (from Composio API)
4. **Actions** — Refresh metadata, Sync tools, Enable/disable toolkit

### API calls
- `GET /admin/composio/toolkits/:slug`
- `GET /admin/composio/toolkits/:slug/tools`
- `POST /admin/composio/toolkits/:slug/refresh`
- `POST /admin/composio/toolkits/:slug/sync-tools`
- `PATCH /admin/composio/toolkits/:slug/tools/:tool_slug`

## Sync Monitoring Page

### Display
- Current sync progress (poll `GET /admin/composio/sync/:uuid`)
- History table: started_at, type, status, toolkits/tools upserted, duration, error

### Startup sync indicator
Show banner on admin home if last sync failed or `last_synced_at` > 24h stale.

## UI Components (new)

```
app/src/pages/admin/
├── layout.tsx                    # Admin shell, SUPER_ADMIN guard
├── index.tsx
└── composio/
    ├── index.tsx                 # Dashboard
    ├── toolkits/
    │   ├── index.tsx             # List
    │   └── [slug].tsx            # Detail
    └── sync/
        └── index.tsx             # History

app/src/features/composio-admin/
├── services/composio-admin.service.ts
├── hooks/
│   ├── use-admin-toolkits.ts
│   ├── use-admin-sync.ts
│   └── use-admin-toolkit-detail.ts
└── interfaces/
```

## Navigation

Add admin link to sidebar **only when** `user.role === SUPER_ADMIN`:
```typescript
{ role === 'SUPER_ADMIN' && { label: 'Admin', path: '/admin' } }
```

Hidden from regular users — not just disabled.

## Design Notes

- Reuse existing table/card patterns from `IntegrationsPage`
- Status badges: sync RUNNING (blue), COMPLETED (green), FAILED (red)
- Toolkit enabled badge consistent with existing `StatusBadge` component
- No credential fields — admin never sees OAuth tokens

## Initial Bootstrap Workflow

1. Deploy with `COMPOSIO_API_KEY`
2. API startup runs full sync (all toolkits to DB, none enabled)
3. SUPER_ADMIN logs in → `/admin/composio`
4. Search and enable starter toolkits: gmail, slack, github, hubspot, stripe, notion, linear, posthog, intercom, resend
5. Set connection tiers per fixed list
6. Users see enabled toolkits in `/dashboard/integrations`
