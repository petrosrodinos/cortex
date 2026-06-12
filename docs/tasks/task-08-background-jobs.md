# Task: Background Jobs, Observability & Audit Logs

## Objective
Harden the platform for production: BullMQ queue configuration with real-time WebSocket notifications, audit logging for all significant actions, token/cost tracking dashboards, usage analytics, and scheduled maintenance jobs.

## Requirements
- Long-running agent jobs run in BullMQ workers, not in the HTTP request cycle
- Frontend receives real-time progress via existing Socket.io WebSocket
- Admins can inspect every AI action, tool call, and file generation
- Cost tracking per org, per conversation, per model
- Scheduled jobs: schema sync, expired file cleanup, usage rollup

## Subtasks

### Backend

- [ ] BullMQ queue setup (`api/src/core/queues/`)
  - Queues:
    - `agent-run` — AI agent execution
    - `audit-log` — async audit log writes
    - `schema-sync` — scheduled DB schema refresh
    - `file-cleanup` — delete expired GCS files
    - `usage-rollup` — aggregate token/cost per org per day
  - Each queue has a dedicated processor class in `api/src/core/queues/processors/`
  - `QueuesModule` exports all queues for injection

- [ ] Agent queue processor (complete from Phase 6 stub)
  - `agent.processor.ts`: full implementation (already designed in task-06)
  - Add retry logic: max 3 retries with exponential backoff for transient errors
  - Add job timeout: 5 minutes max per execution

- [ ] Audit log queue processor (`audit-log.processor.ts`)
  - Reads `AuditLog` job payload, persists to DB + indexes to Elasticsearch
  - `AuditLogService.log(organizationUuid, userId, action, resourceType, resourceId, metadata)` — enqueues (fire-and-forget)
  - Call `AuditLogService.log(...)` from: org changes, member changes, integration CRUD, AI executions start/end, file generation, role changes

- [ ] Schema sync processor (`schema-sync.processor.ts`)
  - Scheduled via BullMQ Cron: run every 6 hours
  - Fetch all `DatabaseIntegration` rows where `last_schema_sync` > 6h ago
  - Call `DatabaseIntegrationsService.syncSchema(id)` for each

- [ ] File cleanup processor (`file-cleanup.processor.ts`)
  - Scheduled via BullMQ Cron: run every hour
  - Fetch `GeneratedFile` where `expires_at < now()`
  - Delete from GCS, delete DB row

- [ ] Usage rollup processor (`usage-rollup.processor.ts`)
  - Scheduled via BullMQ Cron: run daily at midnight UTC
  - Aggregate `ToolCall` rows by `org_id`, `created_at::date`, `integration_id`
  - Store `UsageSummary` (new model: `id, org_id, date, total_tokens, total_cost_usd, tool_call_count`)
  - Delete raw `ToolCall` rows older than 90 days (retain summaries)

- [ ] Prisma: add `UsageSummary` model, run `prisma migrate dev`

- [ ] WebSocket event emitter (`api/src/shared/notifications/ws-events.service.ts`)
  - `emitToExecution(executionId, event, data)`: emit via Socket.io gateway
  - Used by `agent.processor.ts` to emit tool progress events

- [ ] Audit logs API endpoint
  - `GET /organizations/:organizationUuid/audit-logs?page&limit&action&userId&from&to`
  - Filters passed to Elasticsearch query if ES is enabled, fallback to Prisma

- [ ] Token & cost tracking API
  - `GET /organizations/:organizationUuid/usage?from&to` → aggregated stats
  - `GET /organizations/:organizationUuid/usage/conversations` → cost per conversation
  - Queries `UsageSummary` + raw `ToolCall` for recent data

- [ ] Usage limit enforcement
  - Before enqueuing an `agent-run` job, check `AiProvider.usage_limit_tokens` and `usage_limit_cost_usd`
  - Query today's usage from `UsageSummary` + raw `ToolCall` (current day)
  - If over limit: return 429 with clear message

- [ ] Bull Board: expose `/queues` admin UI (existing `bull-board.module.ts`) — protect with SUPER_ADMIN guard

### Frontend

- [ ] Usage dashboard page: `app/src/pages/settings/usage/`
  - Total token usage chart (line, daily, last 30 days)
  - Cost breakdown by integration
  - Top conversations by cost
  - Usage limits progress bars
- [ ] Audit log page: `app/src/pages/settings/audit-logs/`
  - Filterable table: action, user, date range
  - Expandable row for metadata JSON
- [ ] Admin: execution detail page `app/src/pages/executions/:id`
  - Timeline of tool calls with input/output/duration
  - Token cost breakdown
  - Status history

## Technical Notes
- BullMQ workers must run in separate Node.js process in production (horizontal scaling) — use `nest start --entryFile worker` pattern with a separate `worker.ts` entry point
- Redis connection for BullMQ must use `lazyConnect: true` + health check before processing
- Audit logs: write to both Postgres (`AuditLog` table) and Elasticsearch for fast filter/search; Postgres is the source of truth
- Usage rollup is idempotent: use `upsert` on `(org_id, date)` unique constraint
- WebSocket room naming: `org-${organizationUuid}-exec-${executionId}` — user must be member of org to join

## Acceptance Criteria
- [ ] Agent runs in background; HTTP response returns immediately with `executionId`
- [ ] Frontend shows live tool call progress via WebSocket without polling
- [ ] All mutating actions create an audit log entry
- [ ] `/usage` endpoint returns correct token and cost aggregates
- [ ] Org exceeding token limit gets 429 on next message
- [ ] Expired files are deleted from GCS by the scheduled cleanup job
- [ ] Schema sync job updates `schema_cache` for all DB integrations every 6h
