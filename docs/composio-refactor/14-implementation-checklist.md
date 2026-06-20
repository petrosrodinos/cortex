# 14 — Implementation Checklist

Use this as a sequential execution guide for the coding agent. Check off each item in order.

## Environment & Dependencies

- [x] Add `COMPOSIO_API_KEY` to `api/.env.template` (required, not optional)
- [x] Add `COMPOSIO_WEBHOOK_SECRET` to `api/.env.template`
- [x] Add `APP_URL` for OAuth callback origin
- [x] Update `env.validation.ts` — require `COMPOSIO_API_KEY`
- [x] Install `@composio/core` and `@composio/vercel` in `api/`
- [ ] Run `composio init` / verify API key works (`composio whoami`)

## Database

- [x] Create Prisma migration with all tables from `04-database-design.md`
- [x] Add `composio_session_id` to `conversations`
- [x] Add `provider_type`, `composio_tool_slug`, `composio_session_id` to `tool_calls`
- [ ] Remove SaaS values from `IntegrationProvider` enum (Phase 5)
- [x] Update permission seeds
- [ ] Run migration on dev DB
- [ ] Delete legacy SaaS integration rows (Phase 5)

## Backend — Composio Module

- [x] `composio.module.ts` — global module
- [x] `composio-client.service.ts`
- [x] `composio-sync.service.ts` + `OnApplicationBootstrap` hook
- [x] `composio-toolkits.service.ts` (admin)
- [x] `composio-toolkits.controller.ts` (admin)
- [x] `composio-connections.service.ts`
- [x] `composio-connections.controller.ts` (org)
- [x] `composio-session.service.ts`
- [x] `composio-triggers.service.ts`
- [x] `composio-triggers.controller.ts`
- [x] `composio-webhook.controller.ts`
- [x] `org-toolkits.service.ts` + controller
- [x] All DTOs + Zod schemas
- [x] `SuperAdminGuard`
- [x] `OrganizationMatchGuard`

## Backend — Tool Registry Refactor

- [ ] `UnifiedToolRegistry` + provider interfaces
- [ ] `ComposioToolProvider`
- [ ] Migrate DB/OpenAPI/MCP to provider pattern
- [ ] `OutputToolProvider`, `DocumentToolProvider`, `OrganizationToolProvider`, `SandboxToolProvider`
- [ ] Refactor `IntegrationToolsFactory` → `AgentToolsFactory`
- [ ] Update `ToolDispatcherService`
- [ ] Update `AgentRunnerService` — session resolution
- [ ] Update `messages.service.ts` DTO — `toolkit_slugs`

## Backend — Removal

- [ ] Delete `api/src/modules/integrations/saas/` entire directory
- [ ] Remove SaaS routes from `integrations.controller.ts`
- [ ] Remove email test endpoints (smtp/resend/sendgrid)
- [ ] Update `integrations.module.ts` imports
- [ ] Remove dead permission keys

## Frontend — Composio Feature

- [ ] `app/src/features/composio/` — services, hooks, types
- [ ] Update `app/src/config/api/routes.ts`
- [ ] `ToolkitCatalog` component
- [ ] `ToolkitDetail` component
- [ ] `/dashboard/integrations/callback` page
- [ ] Refactor `IntegrationsPage` tabs
- [ ] Remove SaaS `AddIntegrationModal` credential forms
- [ ] Update conversation tool pickers for `toolkit_slugs`
- [ ] Update `conversations.service.ts` message payload

## Frontend — Admin

- [ ] `/admin` layout with SUPER_ADMIN guard
- [ ] `/admin/composio` dashboard
- [ ] `/admin/composio/toolkits` list
- [ ] `/admin/composio/toolkits/:slug` detail
- [ ] `/admin/composio/sync` history
- [ ] Admin sidebar link (SUPER_ADMIN only)
- [ ] `app/src/features/composio-admin/`

## Triggers

- [x] Webhook route + signature verification
- [x] Trigger CRUD API
- [ ] Trigger UI in toolkit detail
- [ ] BullMQ processor for trigger events
- [ ] Register webhook URL in Composio dashboard

## Security Hardening

- [ ] `OrganizationMatchGuard` on all org routes
- [ ] Active membership check on integration routes
- [ ] Rate limit connect endpoints
- [ ] Audit log connect/disconnect events
- [ ] Never expose `COMPOSIO_API_KEY` to frontend

## Testing

- [ ] Unit tests for sync, session, connections
- [ ] Admin guard tests
- [ ] Agent execution test with mocked Composio
- [ ] Legacy DB/OpenAPI/MCP regression tests
- [ ] Remove obsolete SaaS tests

## Bootstrap

- [ ] Deploy API with key
- [ ] Verify startup sync
- [ ] SUPER_ADMIN enables starter toolkits
- [ ] Manual OAuth connect test
- [ ] Manual agent tool execution test

## Documentation

- [x] Update `api/.env.template` comments
- [ ] Remove references to manual OAuth in any remaining setup guides
