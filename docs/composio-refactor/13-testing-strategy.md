# 13 — Testing Strategy

## Unit Tests

### ComposioSyncService
- Upserts toolkit from mock Composio response
- Idempotent: second sync updates, doesn't duplicate
- Applies `connection_tier` only on create
- Syncs tools only for enabled toolkits
- Records FAILED sync run on API error

### ComposioSessionService
- Creates new session when `composio_session_id` null
- Reuses session via `composio.use()` when present
- Calls `session.update()` with enabled toolkits
- Resolves correct `composioUserId` for ORG_SHARED vs USER_PERSONAL

### ComposioConnectionsService
- `connect()` returns redirect URL
- `disconnect()` calls SDK delete + local mirror delete
- Permission denied for org-shared connect without manage permission

### UnifiedToolRegistry
- Merges tools from all providers
- Routes execution to correct provider by tool name prefix
- Composio meta tools discovered from mocked session

### ToolDispatcherService
- Permission check for disabled toolkit tools
- Idempotency cache hit skips execution
- `tool_calls` row created with `provider_type`

## Integration Tests (API)

Use `@nestjs/testing` + test DB + mocked Composio SDK.

### Admin
```typescript
describe('Admin Composio', () => {
  it('rejects non-SUPER_ADMIN', () => request(app).get('/admin/composio/toolkits').expect(403));
  it('lists toolkits after sync', ...);
  it('enables toolkit', ...);
  it('triggers manual sync', ...);
});
```

### User connections
```typescript
describe('Composio Connections', () => {
  it('initiates connect with redirect URL', ...);
  it('lists toolkits filtered by org-enabled', ...);
  it('disconnects account', ...);
});
```

### Guards
```typescript
it('rejects org UUID mismatch in JWT vs path', ...);
it('requires active membership', ...);
```

## E2E Tests (API + Supertest)

### Agent execution with Composio (mocked)
1. Enable toolkit for org
2. Mock `session.tools()` returning meta tools
3. POST message
4. Assert agent execution COMPLETED
5. Assert `tool_calls` row with COMPOSIO provider

### Legacy regression
- Database integration create + `db__query` execution
- OpenAPI parse + tool execution
- MCP sync + tool execution
- `output__create_pdf` execution

## Frontend Tests

### Toolkit catalog
- Renders toolkits from API mock
- Connect button calls connect service
- Callback page verifies and redirects

### Admin
- SUPER_ADMIN sees admin nav
- Regular user does not
- Enable toolkit mutation invalidates queries

### Conversation picker
- Shows connected toolkits
- Sends `toolkit_slugs` in message payload

## Manual QA Checklist

### OAuth flows
- [ ] Connect Gmail (user-personal) — full OAuth round trip
- [ ] Connect Slack (org-shared) — admin connects
- [ ] Disconnect and reconnect
- [ ] Multiple accounts same toolkit (if supported)

### Agent
- [ ] "Search my emails from today" — triggers search + optional in-chat auth
- [ ] Tool approval flow still works
- [ ] Execution detail shows Composio tool calls

### Admin
- [ ] Full sync from admin UI
- [ ] Enable/disable toolkit reflects for users
- [ ] Tool-level disable prevents agent use

### Triggers
- [ ] Create trigger in UI
- [ ] Webhook receives test event (Composio dashboard test)
- [ ] Event creates audit/processing record

## Mocking Composio SDK

```typescript
const mockComposio = {
  toolkits: { get: jest.fn() },
  tools: { getRawComposioTools: jest.fn() },
  create: jest.fn().mockResolvedValue(mockSession),
  use: jest.fn().mockResolvedValue(mockSession),
  connectedAccounts: { list: jest.fn(), delete: jest.fn() },
  triggers: { create: jest.fn(), enable: jest.fn(), disable: jest.fn() },
};

mockSession = {
  id: 'sess_test',
  tools: jest.fn().mockResolvedValue([{ name: 'COMPOSIO_SEARCH_TOOLS', ... }]),
  authorize: jest.fn().mockResolvedValue({ redirectUrl: 'https://connect.composio.dev/...' }),
  update: jest.fn(),
  toolkits: jest.fn(),
};
```

Register in test module:
```typescript
{ provide: ComposioClientService, useValue: { getClient: () => mockComposio } }
```

## CI Pipeline

1. `pnpm test` — unit tests with mocks
2. `pnpm test:e2e` — API e2e with test DB
3. Optional: nightly job with real `COMPOSIO_API_KEY` against staging (smoke sync only)

## Coverage Targets

| Area | Target |
|------|--------|
| ComposioSyncService | 90% |
| ComposioSessionService | 85% |
| UnifiedToolRegistry | 85% |
| Admin guards | 100% |
| OAuth connect/callback | 80% |

## Files to Delete Tests For

Remove specs tied to deleted SaaS modules:
- `saas-integrations.module.spec.ts`
- `saas-integration.spec.ts`
- Per-provider integration specs

Add new specs alongside composio module files.
