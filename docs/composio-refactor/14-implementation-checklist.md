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
- [x] Remove SaaS values from `IntegrationProvider` enum (Phase 5)
- [x] Update permission seeds
- [ ] Run migration on dev DB
- [x] Add Phase 5 migration to delete legacy SaaS integration rows

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

- [x] `UnifiedToolRegistry` + provider interfaces
- [x] `ComposioToolProvider`
- [x] Migrate DB/OpenAPI/MCP to provider pattern
- [x] `OutputToolProvider`, `DocumentToolProvider`, `OrganizationToolProvider`, `SandboxToolProvider`
- [x] Refactor `IntegrationToolsFactory` → `AgentToolsFactory`
- [x] Update `ToolDispatcherService`
- [x] Update `AgentRunnerService` — session resolution
- [x] Update `messages.service.ts` DTO — `toolkit_slugs`

## Backend — Removal

- [x] Delete `api/src/modules/integrations/saas/` entire directory
- [x] Remove SaaS routes from `integrations.controller.ts`
- [x] Remove email test endpoints (smtp/resend/sendgrid)
- [x] Update `integrations.module.ts` imports
- [x] Remove dead permission keys

## Frontend — Composio Feature

- [x] `app/src/features/composio/` — services, hooks, types
- [x] Update `app/src/config/api/routes.ts`
- [x] `ToolkitCatalog` component
- [x] `ToolkitDetail` component
- [x] `/dashboard/integrations/callback` page
- [x] Refactor `IntegrationsPage` tabs
- [x] Remove SaaS `AddIntegrationModal` credential forms
- [x] Update conversation tool pickers for `toolkit_slugs`
- [x] Update `conversations.service.ts` message payload

## Frontend — Admin

- [x] `/admin` layout with SUPER_ADMIN guard
- [x] `/admin/composio` dashboard
- [x] `/admin/composio/toolkits` list
- [x] `/admin/composio/toolkits/:slug` detail
- [x] `/admin/composio/sync` history
- [x] Admin sidebar link (SUPER_ADMIN only)
- [x] `app/src/features/composio-admin/`

## Triggers

- [x] Webhook route + signature verification
- [x] Trigger CRUD API
- [x] Trigger UI in toolkit detail
- [x] BullMQ processor for trigger events
- [ ] Register webhook URL in Composio dashboard

## Security Hardening

- [x] `OrganizationMatchGuard` on all org routes
- [x] Active membership check on integration routes
- [x] Rate limit connect endpoints
- [x] Audit log connect/disconnect events
- [x] Never expose `COMPOSIO_API_KEY` to frontend

## Testing

- [x] Unit tests for sync, session, connections
- [x] Admin guard tests
- [x] Agent execution test with mocked Composio
- [x] Legacy DB/OpenAPI/MCP regression tests
- [x] Remove obsolete SaaS tests

## Bootstrap

- [ ] Deploy API with key
- [ ] Verify startup sync
- [ ] SUPER_ADMIN enables starter toolkits
- [ ] Manual OAuth connect test
- [ ] Manual agent tool execution test

## Documentation

- [x] Update `api/.env.template` comments
- [x] Remove references to manual OAuth in any remaining setup guides
