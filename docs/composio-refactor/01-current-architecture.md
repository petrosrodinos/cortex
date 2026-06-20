# 01 — Current Architecture

## Stack

| Layer | Technology |
|-------|------------|
| API | NestJS + Prisma + PostgreSQL |
| Frontend | React + Vite + TanStack Query |
| Agent runtime | Vercel AI SDK `ToolLoopAgent` + BullMQ |
| Auth | JWT (user-scoped login → org-scoped switch) |
| Composio | **Not implemented** — `COMPOSIO_API_KEY` placeholder in `api/.env.template` only |

## Domain Model (Prisma)

### Core tenancy
- `users` — platform accounts (`AuthRole`: USER, ADMIN, SUPER_ADMIN, SUPPORT)
- `organizations` — multi-tenant workspaces
- `organization_members` — user ↔ org with role
- `organization_roles` + `permissions` + `role_permissions` — RBAC

### Integration system (legacy)
- `integrations` — org-scoped row per connected provider; encrypted `config` blob
- `integration_actions` — per-tool enablement, approval flags, optional `required_permission_key`
- `database_integrations` — PG/MySQL/Mongo subtype
- `openapi_integrations` — parsed spec + generated tools JSON
- `mcp_integrations` — server URL, discovered tools JSON

### Agent / execution
- `conversations` + `messages` — chat history (org + user scoped)
- `agent_executions` — BullMQ job lifecycle + usage totals
- `tool_calls` — audit log per tool invocation
- `ai_providers` — org LLM keys (OPENAI, CLAUDE, GROK)

### Documents
- `documents` — user-scoped file storage (PDF, widgets, etc.)

## Integration Providers (`IntegrationProvider` enum)

**SaaS (13 hand-rolled):** GITHUB, SLACK, STRIPE, HUBSPOT, LINEAR, NOTION, GOOGLE_DRIVE, SMTP, GMAIL, RESEND, SENDGRID, POSTHOG, INTERCOM

**Non-Composio (preserve):** DATABASE_PG, DATABASE_MYSQL, DATABASE_MONGO, OPENAPI, MCP

## Backend Module Map

```
api/src/modules/integrations/
├── integrations.module.ts          # SaaS CRUD controller
├── integrations.service.ts
├── integration-actions.service.ts
├── framework/
│   ├── integration-framework.module.ts
│   ├── registry/integration-registry.service.ts   # Central router
│   ├── base/base-integration.ts
│   └── interfaces/
├── saas/                           # 13 provider modules (~260+ static actions)
├── databases/
├── openapi/
└── mcp/

api/src/shared/services/ai/agents/
├── runner/agent-runner.service.ts
├── tools/
│   ├── integration-tools.factory.ts    # Builds Vercel AI SDK ToolSet
│   ├── tool-dispatcher.service.ts      # Permission + execution + logging
│   ├── document-tools.factory.ts
│   └── outputs/tools/output-tools.factory.ts
```

## API Endpoints (integration-related)

| Base path | Methods | Purpose |
|-----------|---------|---------|
| `organizations/:orgUuid/integrations` | GET, POST, PATCH, DELETE | SaaS CRUD |
| `.../integrations/:uuid/test` | POST | Connection test |
| `.../integrations/:uuid/actions` | GET, PATCH | Tool toggles |
| `.../integrations/tools` | GET | Enabled tools for org |
| `organizations/:orgUuid/database-integrations` | CRUD + sync + test | DB connectors |
| `organizations/:orgUuid/openapi-integrations` | parse, CRUD, regenerate, test | OpenAPI |
| `organizations/:orgUuid/integrations/mcp` | test, CRUD, sync-tools, test | MCP |
| `organizations/:orgUuid/conversations/:uuid/messages` | POST | Triggers agent (optional `integrationUuids`) |
| `organizations/:orgUuid/executions` | GET, approve, reject | Execution control |
| `organizations/:orgUuid/ai-providers` | CRUD | LLM keys |

**No OAuth callback routes.** Credentials submitted via create/update DTOs (BYOC).

## Tool Execution Flow

```
POST message
  → AgentExecution (PENDING)
  → BullMQ agent.processor
  → AgentRunnerService.run()
  → IntegrationToolsFactory.buildTools()
      → IntegrationRegistry.getAllTools()  # filtered by enabled actions
      → + code_interpreter, output__*, document__*, organization__*
  → ToolLoopAgent.generate()
  → ToolDispatcherService.dispatch()
      → assertToolAllowed() (RBAC + enabled action)
      → IntegrationRegistry.executeTool()
  → tool_calls row persisted
```

### Tool naming conventions
| Source | Pattern | Example |
|--------|---------|---------|
| SaaS | `{provider}__{action_key}` | `github__list_repos` |
| Database | `db__{action_key}` | `db__query` |
| OpenAPI | `openapi_{uuid8}__{op}` | `openapi_a1b2c3d4__getUsers` |
| MCP | `mcp_{uuid8}__{name}` | `mcp_a1b2c3d4__search` |
| Outputs | `output__create_*` | PDF, Excel, Word, table, widget |
| Builtin | `code_interpreter`, `document__*`, `organization__*` | |

## Frontend Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/dashboard/integrations` | `IntegrationsPage` | Catalog + detail |
| `/dashboard/integrations/:integrationUuid` | `IntegrationDetail` | Manage connection + actions |
| `/dashboard/integrations/ai/:aiProviderUuid` | `AiProviderDetail` | LLM provider config |
| `/dashboard/conversations` | Tool pickers | `integrationUuids` on send |

**No admin integration UI.** No Composio concepts.

## Authentication Model

1. `POST auth/email/login` → user JWT
2. `POST auth/switch-organization` → org JWT with `organization_permissions[]`
3. `@UseGuards(JwtGuard, OrganizationGuard)` on org routes
4. `@OrganizationPermission('org:integrations:manage')` on mutations

### Known gaps
- Path `organization_uuid` not validated against JWT org claim
- Integration GET routes lack active-membership check
- Integrations are **org-wide shared credentials** (no per-user connections)

## Multi-Tenancy

| Resource | Scope |
|----------|-------|
| Integrations | Organization |
| AI providers | Organization |
| Conversations | Organization + User |
| Agent executions | Organization + User |
| Documents | User only |
| Tool calls | Via execution → org/user |

## Output Generators (preserve)

`OutputToolsFactory` — `output__create_pdf`, `output__create_excel`, `output__create_word`, `output__create_table`, `output__create_widget`

## MCP (preserve, separate from Composio MCP mode)

User-configured external MCP servers with tool discovery sync — distinct from Composio's `session.mcp.url`.
