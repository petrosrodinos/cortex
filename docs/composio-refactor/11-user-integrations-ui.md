# 11 — User Integrations UI

## Route

`/dashboard/integrations` — refactor existing page, preserve URL.

### New sub-routes
| Route | Purpose |
|-------|---------|
| `/dashboard/integrations` | Catalog |
| `/dashboard/integrations/toolkits/:slug` | Toolkit detail |
| `/dashboard/integrations/callback` | OAuth return handler |
| `/dashboard/integrations/ai/:aiProviderUuid` | Unchanged — AI providers |
| `/dashboard/integrations/databases/:uuid` | DB detail (was integrationUuid) |
| `/dashboard/integrations/openapi/:uuid` | OpenAPI detail |
| `/dashboard/integrations/mcp/:uuid` | MCP detail |

Remove: `/dashboard/integrations/:integrationUuid` for SaaS providers.

## Catalog View

### Tabs
1. **Composio Apps** — admin-curated toolkits (new primary tab)
2. **Databases** — existing DB connectors
3. **OpenAPI** — existing
4. **MCP** — existing
5. **AI Providers** — existing

### Composio Apps tab
- Search input (debounced)
- Category filter chips (from toolkit categories)
- Status filter: All | Connected | Not connected
- Tier filter: All | Shared | Personal
- Grid of `ToolkitCard`:
  - Logo, name, description snippet
  - Connection badge (Connected / Not connected / Pending)
  - Tier badge (Shared / Personal)
  - CTA: Connect | Manage | Reconnect

### API
`GET /organizations/:org/integrations/composio/toolkits`

## Toolkit Detail View

### Sections
1. **Connection** — connected accounts list, Connect/Reconnect/Disconnect buttons
2. **Tools** — searchable list with enable/disable toggles (`org_tool_permissions`)
3. **Triggers** (if toolkit supports) — list/create/enable triggers
4. **Settings** — org enable/disable toolkit

### Permissions
- Connect org-shared: `org:integrations:manage`
- Connect user-personal: any active member
- Tool toggles: `org:integrations:manage`

## OAuth Connect Flow (frontend)

```typescript
async function connectToolkit(toolkitSlug: string) {
  const { redirect_url } = await composioService.connect(orgUuid, toolkitSlug);
  sessionStorage.setItem('composio_pending_toolkit', toolkitSlug);
  window.location.href = redirect_url;
}
```

### Callback page (`/dashboard/integrations/callback`)
```typescript
useEffect(() => {
  const toolkitSlug = sessionStorage.getItem('composio_pending_toolkit');
  composioService.verifyCallback(orgUuid, toolkitSlug)
    .then(() => navigate('/dashboard/integrations'))
    .finally(() => sessionStorage.removeItem('composio_pending_toolkit'));
}, []);
```

## Remove

- `AddIntegrationModal` SaaS credential forms
- `PROVIDER_CONFIG_FIELDS` for SaaS providers
- `ProviderSetupGuide` OAuth playground instructions for Google
- `provider-metadata.ts` static SaaS catalog (replace with API-driven)
- SMTP/Resend/SendGrid test hooks

## Refactor

### `ProviderCatalog` → `ToolkitCatalog`
- Fetch from composio toolkits API
- Dynamic categories from API

### `IntegrationDetail` → split
- `ToolkitDetail` — Composio toolkits
- Keep `IntegrationDetail` for DB/OpenAPI/MCP only

### State management
```typescript
// Query keys
['composio-toolkits', orgUuid]
['composio-toolkit', orgUuid, slug]
['composio-accounts', orgUuid]
['composio-tools', orgUuid, slug]
```

New feature module: `app/src/features/composio/`

## Conversation Tool Picker

### `IntegrationToolsList` → `AgentToolsList`
Show two groups:
1. **Connected apps** — Composio toolkits with active connection + enabled tools
2. **Data & APIs** — DB/OpenAPI/MCP integrations

### Message payload
```typescript
sendMessage({
  content,
  toolkit_slugs: selectedToolkitSlugs,
  integration_uuids: selectedLegacyIntegrationUuids,
  document_uuids,
});
```

### Slash picker / attach menu
Update to show toolkit names instead of legacy integration names for SaaS.

## Empty States

- No org-enabled toolkits: "Your workspace admin hasn't enabled any apps yet"
- No platform toolkits: "Contact support" (admin hasn't curated catalog)
- No connection: "Connect your {toolkit} account to use these tools"

## AI Providers Tab

Unchanged. Stays separate from Composio — org LLM keys for OpenAI/Claude/Grok.

## Mobile / Responsive

Reuse existing integrations page layout — grid collapses to single column.
