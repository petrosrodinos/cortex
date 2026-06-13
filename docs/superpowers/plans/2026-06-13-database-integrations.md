# Database Integrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build production-ready PostgreSQL, MySQL, and MongoDB integrations from persistence through AI tools and integration management UI.

**Architecture:** Database integrations extend the existing integration framework with one registered provider per database type, backed by a shared `DatabaseIntegration` row, adapter factory, schema cache, and query safety layer. The frontend extends the existing integrations screen with database-specific create, test, schema, and sync workflows.

**Tech Stack:** NestJS, Prisma, PostgreSQL migrations, `pg`, `mysql2/promise`, `mongodb`, React, TanStack Query, React Hook Form, Zod, Vite.

---

### Task 1: Persistence And Client Dependencies

**Files:**
- Modify: `api/prisma/schema.prisma`
- Create: `api/prisma/migrations/20260613170000_database_integrations/migration.sql`
- Modify: `api/package.json`
- Modify: `api/package-lock.json`

- [ ] Add `DatabaseIntegration` with encrypted connection string, schema cache, allowed ops, and one-to-one `Integration` relation.
- [ ] Install `pg`, `mysql2`, and `mongodb`.
- [ ] Generate Prisma client.

### Task 2: Backend Database Runtime

**Files:**
- Create: `api/src/modules/integrations/databases/db-adapter.interface.ts`
- Create: `api/src/modules/integrations/databases/database-integration.types.ts`
- Create: `api/src/modules/integrations/databases/database-query-safety.ts`
- Create: `api/src/modules/integrations/databases/database-schema.formatter.ts`
- Create: `api/src/modules/integrations/databases/adapters/postgres.adapter.ts`
- Create: `api/src/modules/integrations/databases/adapters/mysql.adapter.ts`
- Create: `api/src/modules/integrations/databases/adapters/mongo.adapter.ts`
- Create: `api/src/modules/integrations/databases/adapters/database-adapter.factory.ts`

- [ ] Write failing unit tests for dangerous SQL blocking, allowed-op checks, and schema formatting.
- [ ] Implement safety, schema formatting, adapter contracts, and lazy cached adapters.
- [ ] Verify focused tests pass.

### Task 3: Backend Integration And Service API

**Files:**
- Create: `api/src/modules/integrations/databases/database.integration.ts`
- Create: `api/src/modules/integrations/databases/database-integrations.service.ts`
- Create: `api/src/modules/integrations/databases/database-integrations.controller.ts`
- Create: `api/src/modules/integrations/databases/database-integrations.module.ts`
- Modify: `api/src/modules/integrations/integrations.module.ts`
- Modify: `api/src/modules/integrations/integrations.service.ts`
- Modify: `api/src/modules/integrations/framework/integration-registry.service.ts`

- [ ] Write failing tests for tool exposure and stale schema refresh behavior.
- [ ] Implement create, test, schema sync, sanitized responses, and registered providers.
- [ ] Allow multiple integrations per provider by resolving database tool calls through `integration_uuid` when supplied while preserving existing single-provider behavior.
- [ ] Verify focused tests pass.

### Task 4: Frontend Database UX

**Files:**
- Modify: `app/src/config/api/routes.ts`
- Modify: `app/src/features/integrations/interfaces/integration.interface.ts`
- Modify: `app/src/features/integrations/services/integrations.service.ts`
- Modify: `app/src/features/integrations/hooks/use-integrations.ts`
- Modify: `app/src/features/integrations/constants/provider-config-fields.ts`
- Modify: `app/src/features/integrations/validation-schemas/integration.schema.ts`
- Modify: `app/src/pages/integrations/index.tsx`

- [ ] Add database DTO/schema types and API calls for create, test draft config, get database details, and sync schema.
- [ ] Add masked connection string and allowed operation controls in the add flow.
- [ ] Add schema preview after draft test and schema tree plus sync button on detail page.
- [ ] Keep the page in the existing product UI style, with dense, predictable controls and clear disabled/loading states.

### Task 5: Verification

**Files:**
- All touched files.

- [ ] Run backend unit tests.
- [ ] Run Prisma generate.
- [ ] Run backend build.
- [ ] Run frontend build.
- [ ] Start frontend/backend as needed and inspect the integration UI in browser.
- [ ] Report any unavailable real database acceptance checks explicitly.
