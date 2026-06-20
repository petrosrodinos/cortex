# 06 — Composio Integration

## SDK Setup

### Packages
```bash
pnpm add @composio/core@latest @composio/vercel@latest
```

### Initialization
```typescript
import { Composio } from '@composio/core';
import { VercelProvider } from '@composio/vercel';

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new VercelProvider(),
});
```

Project API key stored in env only — never client-side.

## Integration Mode: Sessions + Meta Tools

Per Composio v3 guidance, agents use **meta tools** not direct `tools.execute()`.

Meta tools (via `session.tools()`):
- `COMPOSIO_SEARCH_TOOLS`
- `COMPOSIO_GET_TOOL_SCHEMAS`
- `COMPOSIO_MANAGE_CONNECTIONS`
- `COMPOSIO_MULTI_EXECUTE_TOOL`
- `COMPOSIO_REMOTE_WORKBENCH`

Agent discovers and executes SaaS actions through these — no hardcoded per-provider tool lists.

## Session Lifecycle

### Create (per agent execution)
```typescript
async resolveSession(conversationUuid: string, orgUuid: string, userUuid: string) {
  const conversation = await this.prisma.conversation.findUniqueOrThrow({
    where: { uuid: conversationUuid },
  });

  const enabledToolkits = await this.getEnabledToolkitSlugs(orgUuid);

  if (conversation.composio_session_id) {
    const session = await this.composio.use(conversation.composio_session_id);
    await session.update({ toolkits: enabledToolkits });
    return session;
  }

  const composioUserIds = await this.buildComposioUserIds(orgUuid, userUuid, enabledToolkits);
  const session = await this.composio.create(composioUserIds.primary, {
    toolkits: enabledToolkits,
    manageConnections: true,
  });

  await this.prisma.conversation.update({
    where: { uuid: conversationUuid },
    data: { composio_session_id: session.id },
  });

  return session;
}
```

### Hybrid user IDs
For sessions spanning both org-shared and user-personal toolkits:
- Create session with primary user ID (the executing user: `user:{userUuid}`)
- Org-shared toolkits use `org:{orgUuid}` connected accounts — configure via `session.update({ connectedAccounts: {...} })` selecting correct account per toolkit

Reference: Composio docs on managing multiple connected accounts.

## Toolkit Catalog Sync

### Full sync algorithm
```typescript
async syncAll(): Promise<ComposioSyncRun> {
  const run = await this.createSyncRun('FULL');
  let cursor: string | undefined;
  let toolkitsUpserted = 0;
  let toolsUpserted = 0;

  do {
    const page = await this.composio.toolkits.get({ limit: 100, cursor });
    for (const tk of page.items) {
      await this.upsertToolkit(tk);
      toolkitsUpserted++;
      if (await this.shouldSyncTools(tk.slug)) {
        toolsUpserted += await this.syncToolsForToolkit(tk.slug);
      }
    }
    cursor = page.nextCursor;
  } while (cursor);

  return this.completeSyncRun(run, toolkitsUpserted, toolsUpserted);
}
```

### Upsert toolkit fields
| Composio field | DB column |
|----------------|-----------|
| slug | slug |
| name | name |
| meta.description | description |
| meta.logo | logo_url |
| meta.categories | categories |
| meta.toolsCount | tool_count |
| authSchemes | auth_schemes |
| (full object) | composio_metadata |

### Tool sync
Use `composio.tools.getRawComposioTools({ toolkits: [slug], limit: 500 })` with pagination.

**Never guess tool slugs** — always from API response.

## Admin Toolkit Management

| Action | Composio API | Local DB |
|--------|--------------|----------|
| Enable toolkit | — | `is_enabled = true` |
| Disable toolkit | — | `is_enabled = false` |
| Refresh metadata | `toolkits.get(slug)` | upsert |
| Refresh tools | `getRawComposioTools` | upsert tools |
| View connected count | `connectedAccounts.list({ toolkit })` | optional cache update |

## Connected Accounts

### List (for UI)
```typescript
const accounts = await composio.connectedAccounts.list({
  userIds: [composioUserId],
  toolkitSlugs: [toolkitSlug],
});
```

### Delete (disconnect)
```typescript
await composio.connectedAccounts.delete(connectedAccountId);
await this.prisma.composioConnectedAccount.delete({ where: { composio_account_id } });
```

### Mirror sync
Periodic or on-demand: refresh `composio_connected_accounts` from Composio API for fast dashboard rendering.

## Triggers (in scope)

### Create
```typescript
const trigger = await composio.triggers.create(composioUserId, triggerSlug, {
  connectedAccountId,
  config,
});
```

### Webhook
Register webhook endpoint in Composio dashboard pointing to:
`https://api.{domain}/webhooks/composio`

Verify with `COMPOSIO_WEBHOOK_SECRET`.

### Local storage
Mirror in `composio_triggers` table for org-scoped management UI.

## CLI (development/debug only)

```bash
composio manage toolkits list | jq -r '.[].slug'
composio manage tools list --toolkits "gmail"
composio manage tools info "GMAIL_SEND_EMAIL"
```

Use CLI to verify slugs during development — runtime uses SDK only.

## Error Handling

| Error | HTTP | Action |
|-------|------|--------|
| ComposioConnectedAccountNotFoundError | 400 | Prompt reconnect |
| Tool not found | 404 | Re-sync tools |
| Rate limit | 429 | Retry with backoff |
| Invalid API key | 500 | Alert ops |

## Version Pinning

Optional: store `composio_version` on `composio_toolkit_tools` from toolkit version API.
Default: use latest unless admin pins version per toolkit.
