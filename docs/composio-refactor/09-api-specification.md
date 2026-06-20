# 09 — API Specification

## Conventions

- Base: `/api/v1` (or existing prefix)
- Auth: `Authorization: Bearer {orgJwt}`
- Guards: `JwtGuard`, `OrganizationMatchGuard`, `OrganizationGuard`
- Pagination: `{ data, pagination: { total, page, limit, ... } }`

---

## User / Org Endpoints

### List available toolkits (catalog)
```
GET /organizations/:organization_uuid/integrations/composio/toolkits
Query: search?, category?, connected?, page?, limit?
Response: {
  data: [{
    slug, name, description, logo_url, categories,
    connection_tier, is_connected, connected_accounts: [{ id, label, status }],
    is_org_enabled, tool_count
  }],
  pagination
}
```

### Get toolkit detail
```
GET /organizations/:organization_uuid/integrations/composio/toolkits/:slug
Response: { toolkit, tools: [{ slug, name, description, enabled, requires_approval }], connections }
```

### Enable toolkit for org
```
POST /organizations/:organization_uuid/integrations/composio/toolkits/:slug/enable
Permission: org:integrations:manage
```

### Disable toolkit for org
```
POST /organizations/:organization_uuid/integrations/composio/toolkits/:slug/disable
Permission: org:integrations:manage
```

### Initiate OAuth connect
```
POST /organizations/:organization_uuid/integrations/composio/connect
Body: { toolkit_slug: string }
Response: { redirect_url: string }
```

### OAuth callback verification
```
POST /organizations/:organization_uuid/integrations/composio/callback
Body: { toolkit_slug: string }
Response: { status, connected_account_id?, toolkit_slug }
```

### List connected accounts
```
GET /organizations/:organization_uuid/integrations/composio/accounts
Query: toolkit_slug?, tier?
Response: { data: [{ id, composio_account_id, toolkit_slug, status, account_label, tier, user_uuid? }] }
```

### Disconnect account
```
DELETE /organizations/:organization_uuid/integrations/composio/accounts/:connected_account_id
Permission: org:integrations:manage OR account owner (user-personal)
```

### Reconnect account
```
POST /organizations/:organization_uuid/integrations/composio/accounts/:connected_account_id/reconnect
Response: { redirect_url }
```

### Toggle tool permission
```
PATCH /organizations/:organization_uuid/integrations/composio/tools/:tool_slug
Body: { enabled?, requires_approval?, required_permission_key? }
Permission: org:integrations:manage
```

### List enabled tools for agent
```
GET /organizations/:organization_uuid/integrations/composio/tools
Response: { data: [{ slug, name, toolkit_slug, enabled }] }
```

### Triggers — list
```
GET /organizations/:organization_uuid/integrations/composio/triggers
```

### Triggers — create
```
POST /organizations/:organization_uuid/integrations/composio/triggers
Body: { toolkit_slug, trigger_slug, connected_account_id, config }
Permission: org:integrations:manage
```

### Triggers — enable/disable/delete
```
PATCH /organizations/:organization_uuid/integrations/composio/triggers/:uuid
DELETE /organizations/:organization_uuid/integrations/composio/triggers/:uuid
```

---

## Admin Endpoints (SUPER_ADMIN)

Base: `/admin/composio`
Guard: `JwtGuard`, `SuperAdminGuard`

### Search toolkits
```
GET /admin/composio/toolkits
Query: search?, category?, is_enabled?, page?, limit?
```

### Sync all toolkits
```
POST /admin/composio/sync
Body: { sync_type?: 'FULL' | 'TOOLKIT' | 'TOOLS', toolkit_slug? }
Response: { sync_run_uuid, status }
```

### Get sync status
```
GET /admin/composio/sync/:sync_run_uuid
```

### Get toolkit detail (admin)
```
GET /admin/composio/toolkits/:slug
```

### Enable/disable platform toolkit
```
PATCH /admin/composio/toolkits/:slug
Body: { is_enabled?, connection_tier? }
```

### Add toolkit to catalog (enable + sync)
```
POST /admin/composio/toolkits
Body: { slug: string }
```

### Remove toolkit from catalog
```
DELETE /admin/composio/toolkits/:slug
Sets is_enabled=false, does not delete row
```

### List toolkit tools (admin)
```
GET /admin/composio/toolkits/:slug/tools
Query: search?, is_enabled?
```

### Refresh toolkit metadata
```
POST /admin/composio/toolkits/:slug/refresh
```

### Refresh toolkit tools
```
POST /admin/composio/toolkits/:slug/sync-tools
```

### Toggle tool (admin)
```
PATCH /admin/composio/toolkits/:slug/tools/:tool_slug
Body: { is_enabled }
```

### Connected accounts count (platform)
```
GET /admin/composio/toolkits/:slug/stats
Response: { connected_accounts_count, active_triggers_count }
```

---

## Webhook (public)

```
POST /webhooks/composio
Headers: x-composio-signature
Body: Composio trigger event payload
Response: 200 OK
```

No JWT — signature verification only.

---

## Legacy Endpoints (retain)

| Path | Status |
|------|--------|
| `.../database-integrations/*` | Keep |
| `.../openapi-integrations/*` | Keep |
| `.../integrations/mcp/*` | Keep |
| `.../ai-providers/*` | Keep |
| `.../integrations` (SaaS CRUD) | **Remove** |
| `.../integrations/smtp/test` | **Remove** |
| `.../integrations/resend/test` | **Remove** |
| `.../integrations/sendgrid/test` | **Remove** |

---

## Modified Endpoints

### Send message
```
POST /organizations/:organization_uuid/conversations/:conversation_uuid/messages
Body: {
  content: string,
  integration_uuids?: string[],   // DB/OpenAPI/MCP
  toolkit_slugs?: string[],       // Composio scope
  document_uuids?: string[]
}
```

### List integrations (deprecated)
Replace frontend usage with composio toolkits endpoint. Remove or return 410 with migration message.

---

## DTOs

Create Zod schemas + class-validator DTOs in:
- `api/src/modules/composio/dto/`
- `api/src/modules/composio/admin/dto/`

Swagger tags:
- `Composio Integrations`
- `Admin - Composio`
