# 12 — Migration Plan

## Preconditions

- [ ] `COMPOSIO_API_KEY` provisioned for dev/staging
- [ ] Composio project configured with webhook URL (staging)
- [ ] `APP_URL` env set for OAuth callbacks
- [ ] SUPER_ADMIN account exists for bootstrap

## Phase 0: Foundation (no user impact)

1. Add `@composio/core`, `@composio/vercel` to API
2. Add env validation for `COMPOSIO_API_KEY`
3. Create Prisma migration — all new tables + conversation/tool_calls columns
4. Implement `ComposioClientService`
5. Implement `ComposioSyncService` + startup bootstrap
6. Run initial sync — verify `composio_toolkits` populated
7. SUPER_ADMIN enables starter toolkits via admin API (CLI ok before UI)

**Rollback:** Drop new tables; remove packages.

## Phase 1: Admin API + UI

1. Implement admin endpoints (`09-api-specification.md`)
2. Build `/admin/composio` pages
3. Verify sync, enable, tool toggle workflows
4. Document starter toolkit list

**Gate:** Admin can curate catalog without agent changes.

## Phase 2: User Connections

1. Implement org composio endpoints (connect, callback, accounts, toolkits)
2. Build toolkit catalog + detail UI
3. Implement `/dashboard/integrations/callback`
4. Implement `composio_connected_accounts` mirror sync
5. Add `OrganizationMatchGuard` + membership checks

**Gate:** Users can connect Gmail, Slack, etc. via OAuth.

## Phase 3: Agent Integration

1. Implement `ComposioSessionService`
2. Implement `UnifiedToolRegistry` + `ComposioToolProvider`
3. Refactor `IntegrationToolsFactory` / `ToolDispatcherService`
4. Update message DTO for `toolkit_slugs`
5. Update conversation tool pickers
6. End-to-end test: chat → meta tool → Gmail send

**Gate:** Agent executes Composio tools in conversation.

## Phase 4: Triggers

1. Webhook endpoint + signature verification
2. Trigger CRUD API + UI sections
3. BullMQ processor for trigger events
4. Test with one trigger (e.g. `GMAIL_NEW_GMAIL_MESSAGE`)

**Gate:** Trigger fires → event logged/processed.

## Phase 5: Legacy Removal

1. Delete `api/src/modules/integrations/saas/` (all 13 providers)
2. Remove SaaS values from `IntegrationProvider` enum
3. Migration: delete SaaS `integrations` rows
4. Remove frontend SaaS forms, provider metadata, test endpoints
5. Remove permissions: `integrations:github:*`, `integrations:stripe:manage`
6. Update seed permissions

**Gate:** No references to old SaaS providers in codebase.

## Phase 6: Hardening

1. Rate limiting on connect endpoints
2. Audit logging for connect/disconnect
3. Fix JWT org path validation everywhere
4. Load test toolkit sync with full catalog
5. Documentation update

## Data Migration

### SaaS integrations
```sql
DELETE FROM integration_actions
WHERE integration_uuid IN (
  SELECT uuid FROM integrations
  WHERE provider IN ('GITHUB','SLACK','STRIPE','HUBSPOT','LINEAR','NOTION',
    'GOOGLE_DRIVE','SMTP','GMAIL','RESEND','SENDGRID','POSTHOG','INTERCOM')
);

DELETE FROM integrations
WHERE provider IN (...);
```

No export needed — dev environment, no production users.

### Conversations
`composio_session_id` starts null — sessions created on first post-migration message.

## Parallel Operation (not required)

Big-bang cutover acceptable per requirements. No dual-write period.

## Risk Register

| Risk | Mitigation |
|------|------------|
| Composio toolkit missing for email provider | Verify Resend/SendGrid/Gmail toolkits exist before Phase 5 |
| Meta tools change agent behavior | System prompt update explaining Composio capabilities |
| Session ID stale across long conversations | `session.update()` on each execution |
| Sync duration on startup | Run async; don't block HTTP listen — use `OnApplicationBootstrap` with timeout |
| Rate limits on full catalog sync | Paginate; sync tools only for enabled toolkits |

## Verification Checklist

- [ ] Startup sync completes < 5 min (enabled toolkits only for tool sync)
- [ ] Admin enable/disable toolkit reflects in user catalog within 1 request
- [ ] OAuth connect → callback → account visible
- [ ] Agent uses COMPOSIO_SEARCH_TOOLS successfully
- [ ] Tool call logged in `tool_calls` with provider_type=COMPOSIO
- [ ] DB/OpenAPI/MCP tools still work
- [ ] Output/document tools still work
- [ ] Trigger webhook verified
- [ ] No SaaS module imports remain (`rg "saas/" api/src`)
