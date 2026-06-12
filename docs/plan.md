# Cortex — AI-Powered Business Operations Copilot Platform
## Complete Architecture & Implementation Plan

---

## 1. PRODUCT SPECIFICATION

**Product Name:** Cortex

**Purpose:** A multi-tenant SaaS platform that lets businesses connect internal and external systems (SaaS apps, databases, custom APIs) and interact with them through AI using natural language. The AI acts as a business copilot: retrieving data, taking actions, generating files, executing code, and producing rich outputs by orchestrating multiple integrations.

**Target Users:**
- Business teams that need cross-system intelligence without technical expertise
- Admins/Developers who manage integrations and permissions
- Employees who interact with data through a conversational interface

**Core Value Proposition:** One AI interface to query, act on, and report from all your business tools — without writing code.

**Key Features:**
- Multi-org multi-tenant with granular RBAC
- Generic integration framework (SaaS, Database, OpenAPI)
- AI orchestration with multi-tool calling and chaining
- Output rendering: Markdown, PDF, Excel, Word, charts, widgets
- Code execution via sandboxed Code Interpreter
- Background long-running jobs with real-time frontend notifications
- Observability: audit logs, token/cost tracking, execution traces
- AI provider management per organization (OpenAI, Claude, Grok)

**Future Features:**
- Workflow automation (trigger-based)
- Marketplace of community integrations
- Fine-tuned models per organization

---

## 2. SYSTEM ARCHITECTURE

### Frontend Stack
- React 19 + TypeScript + Vite
- TanStack Query (server state)
- Zustand (client state)
- HeroUI + Tailwind CSS v4
- Socket.io-client (real-time BullMQ job notifications)
- React Hook Form + Zod

### Backend Stack
- NestJS 11 + TypeScript
- Prisma ORM (PostgreSQL)
- BullMQ + Redis (background jobs + real-time notifications)
- Passport + JWT (auth)
- @openai/agents + @openai/agents/sandbox (agent framework)
- Vercel AI SDK (@ai-sdk/openai, @ai-sdk/anthropic)
- Google Cloud Storage (file outputs)
- Elasticsearch (audit log search, usage analytics)

### Database
- PostgreSQL (primary — all relational data)
- Redis (job queues, caching, session data)

### External Services
- OpenAI (default AI provider + Code Interpreter)
- Anthropic Claude (optional AI provider per org)
- xAI Grok (optional AI provider per org)
- Google Cloud Storage (file storage)
- Existing: Resend/SendGrid (email), Twilio (SMS)

### Auth System
- Email/password with JWT (access + refresh tokens)
- Organization context embedded in JWT claims (`orgId`, `orgRole`)
- Guard checks both platform role and org-level permissions
- Switching org issues a new org-scoped token

### Deployment
- Docker Compose (dev)
- Kubernetes-ready (prod) — stateless API, Redis/BullMQ workers can scale horizontally
- Frontend: Vercel (existing)
- API: Cloud Run or ECS

### Folder / Module Structure

```
api/src/
├── core/
│   ├── databases/redis/
│   └── queues/
├── modules/
│   ├── auth/
│   ├── organizations/
│   ├── members/
│   ├── roles/
│   ├── integrations/
│   │   ├── framework/          # Base classes, registry, tool builder
│   │   ├── saas/               # GitHub, Slack, Stripe, etc.
│   │   ├── databases/          # PG, MySQL, MongoDB adapters
│   │   └── openapi/            # OpenAPI spec parser + tool gen
│   ├── ai/
│   │   ├── providers/          # OpenAI, Claude, Grok adapters
│   │   ├── agents/             # Agent runner, tool dispatcher
│   │   └── orchestrator/       # Multi-tool, chaining, approval
│   ├── conversations/
│   ├── messages/
│   ├── outputs/                # PDF, Excel, Word, chart generators
│   ├── files/                  # GCS upload/download facade
│   ├── audit/
│   └── internal/               # mail, sms, ai (existing)
├── shared/
│   ├── config/
│   ├── guards/
│   ├── decorators/
│   ├── pipes/
│   └── utils/
└── integrations/               # Low-level third-party SDKs (existing)

app/src/
├── features/
│   ├── auth/
│   ├── organizations/
│   ├── integrations/
│   ├── conversations/
│   ├── files/
│   └── settings/
├── components/
├── hooks/
├── stores/
└── pages/
```

---

## 3. DOMAIN MODEL (DATA DESIGN)

### Core Entities

#### User
Already exists. Extend with:
- `first_name`, `last_name` (optional profile fields)
- Remove `role: AuthRole` → org-level roles replace platform roles (keep `SUPER_ADMIN` as platform admin)

#### Organization
```
id, uuid, name, slug, logo_url, created_at, updated_at
```

#### OrganizationMember
```
id, org_id → Organization, user_id → User
role_id → OrganizationRole
status: ACTIVE | INVITED | SUSPENDED
invited_at, joined_at
```

#### OrganizationRole
```
id, org_id, name, is_system (Owner/Admin/Manager/Employee = true)
```

#### Permission
```
id, key (e.g. "integrations:github:read_repos"), label, group
```

#### RolePermission
```
role_id → OrganizationRole, permission_id → Permission
```

#### Integration (per org)
```
id, uuid, org_id, name, description
provider: GITHUB | SLACK | STRIPE | HUBSPOT | LINEAR | NOTION
         | GOOGLE_DRIVE | SMTP | GMAIL | POSTHOG | INTERCOM
         | DATABASE_PG | DATABASE_MYSQL | DATABASE_MONGO | OPENAPI
status: ACTIVE | INACTIVE | ERROR
config: Json           # encrypted credentials
metadata: Json         # provider-specific metadata (schemas, scopes)
created_at, updated_at
```

#### IntegrationAction
```
id, integration_id, key (e.g. "create_issue"), label, description
enabled: Boolean
required_permission_key: String
```

#### DatabaseIntegration (extends Integration)
```
id, integration_id (unique FK)
connection_string: String (encrypted)
db_type: POSTGRES | MYSQL | MONGODB
schema_cache: Json      # refreshed before each query
allowed_ops: READ | INSERT | UPDATE | DELETE (flags)
last_schema_sync: DateTime
```

#### OpenApiIntegration (extends Integration)
```
id, integration_id (unique FK)
spec_url: String?
spec_json: Json         # parsed spec stored
auth_type: API_KEY | BEARER | OAUTH2 | CUSTOM_HEADERS
auth_config: Json (encrypted)
generated_tools: Json   # list of callable actions
```

#### AiProvider (per org)
```
id, org_id, provider: OPENAI | CLAUDE | GROK
api_key: String (encrypted), default_model: String
model_routing: Json     # rules like { task: 'long_context', model: 'claude-...' }
usage_limit_tokens: Int?, usage_limit_cost_usd: Decimal?
is_default: Boolean, created_at
```

#### Conversation
```
id, uuid, org_id, user_id, title, created_at, updated_at
```

#### Message
```
id, uuid, conversation_id, role: USER | ASSISTANT | SYSTEM | TOOL
content: String, metadata: Json (tool calls, output refs)
created_at
```

#### AgentExecution
```
id, uuid, message_id, org_id, user_id
status: PENDING | RUNNING | COMPLETED | FAILED | AWAITING_APPROVAL
input: Json, output: Json
started_at, completed_at, error: String?
```

#### ToolCall
```
id, execution_id → AgentExecution
integration_id → Integration?, tool_name: String
input: Json, output: Json
status: SUCCESS | FAILED, error: String?
tokens_used: Int, cost_usd: Decimal
duration_ms: Int, created_at
```

#### GeneratedFile
```
id, uuid, org_id, user_id, execution_id?
type: PDF | EXCEL | WORD | CHART | IMAGE | OTHER
filename, size_bytes, gcs_path, public_url
expires_at?, created_at
```

#### AuditLog
```
id, org_id, user_id, action: String, resource_type, resource_id
metadata: Json, ip_address: String, created_at
```

### Key Relationships
- User ↔ Organization → many-to-many via OrganizationMember
- Organization → many Integrations, Roles, AiProviders, Conversations
- Integration → many IntegrationActions
- Integration ← one DatabaseIntegration (optional) | OpenApiIntegration (optional)
- Conversation → many Messages → Messages → AgentExecutions → ToolCalls
- AgentExecution → many GeneratedFiles

---

## 4. API DESIGN

All routes are REST under `/api/v1`. Organization-scoped routes carry `orgId` resolved from JWT or path param.

### Auth
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
POST   /auth/switch-org        # issue new org-scoped JWT
```

### Organizations
```
GET    /organizations                        # orgs user belongs to
POST   /organizations                        # create org
GET    /organizations/:orgId
PATCH  /organizations/:orgId
DELETE /organizations/:orgId
```

### Members
```
GET    /organizations/:orgId/members
POST   /organizations/:orgId/members/invite
PATCH  /organizations/:orgId/members/:memberId
DELETE /organizations/:orgId/members/:memberId
```

### Roles & Permissions
```
GET    /organizations/:orgId/roles
POST   /organizations/:orgId/roles
PATCH  /organizations/:orgId/roles/:roleId
DELETE /organizations/:orgId/roles/:roleId
GET    /organizations/:orgId/roles/:roleId/permissions
PUT    /organizations/:orgId/roles/:roleId/permissions   # bulk set
GET    /permissions                                       # all available permissions
```

### Integrations
```
GET    /organizations/:orgId/integrations
POST   /organizations/:orgId/integrations
GET    /organizations/:orgId/integrations/:id
PATCH  /organizations/:orgId/integrations/:id
DELETE /organizations/:orgId/integrations/:id
POST   /organizations/:orgId/integrations/:id/test       # connectivity check
GET    /organizations/:orgId/integrations/:id/actions
PATCH  /organizations/:orgId/integrations/:id/actions/:actionId
POST   /organizations/:orgId/integrations/:id/sync-schema  # DB integrations
```

### AI Providers
```
GET    /organizations/:orgId/ai-providers
POST   /organizations/:orgId/ai-providers
PATCH  /organizations/:orgId/ai-providers/:id
DELETE /organizations/:orgId/ai-providers/:id
```

### Conversations & Messages
```
GET    /organizations/:orgId/conversations
POST   /organizations/:orgId/conversations
GET    /organizations/:orgId/conversations/:id
DELETE /organizations/:orgId/conversations/:id
POST   /organizations/:orgId/conversations/:id/messages   # triggers agent
GET    /organizations/:orgId/conversations/:id/messages
```

### Files
```
GET    /organizations/:orgId/files
GET    /organizations/:orgId/files/:id/download
DELETE /organizations/:orgId/files/:id
```

### Audit Logs
```
GET    /organizations/:orgId/audit-logs
```

### Agent Executions
```
GET    /organizations/:orgId/executions
GET    /organizations/:orgId/executions/:id
POST   /organizations/:orgId/executions/:id/approve    # human-in-the-loop
```

---

## 5. IMPLEMENTATION PHASES

### Phase 1 — Multi-Tenancy Foundation
**Goal:** Organizations, members, switching, RBAC framework
**Why:** Everything else depends on org isolation and permission checks
**Dependencies:** Existing auth module, User model

### Phase 2 — Integration Framework
**Goal:** Abstract base for all integrations, integration registry, action system, permission gating
**Why:** Provides the contract every integration must implement
**Dependencies:** Phase 1 (org context)

### Phase 3 — SaaS Integrations
**Goal:** GitHub, Slack, Stripe, HubSpot, Linear, Notion, Google Drive, SMTP, Gmail, PostHog, Intercom
**Why:** Core integrations that make the platform useful
**Dependencies:** Phase 2

### Phase 4 — Database Integrations
**Goal:** PostgreSQL, MySQL, MongoDB with schema introspection, safe query execution
**Why:** High-value use case (query your own data via AI)
**Dependencies:** Phase 2

### Phase 5 — OpenAPI Integrations
**Goal:** Parse OpenAPI/Swagger specs, auto-generate tools, support all auth types
**Why:** Makes the platform infinitely extensible without new code
**Dependencies:** Phase 2

### Phase 6 — AI Orchestration & Agent Runner
**Goal:** Agent framework, multi-tool orchestration, Code Interpreter, provider routing, structured outputs
**Why:** Core differentiator — the AI that calls the integrations
**Dependencies:** Phases 2–5

### Phase 7 — Output Generation
**Goal:** PDF, Excel, Word, charts/visualizations, interactive widgets
**Why:** Users need tangible deliverables, not just chat responses
**Dependencies:** Phase 6

### Phase 8 — Background Jobs & Observability
**Goal:** BullMQ long-running jobs, real-time WebSocket progress, audit logs, cost/token tracking
**Why:** Production readiness — long tasks, traceability, admin oversight
**Dependencies:** Phases 6–7

### Phase 9 — Frontend
**Goal:** Org switcher, integrations management UI, chat interface, file viewer, settings, admin panels
**Why:** Users interact with everything through the UI
**Dependencies:** All backend phases

---

## 6. INCREMENTAL TODO FILES

See `docs/tasks/` for individual task files:

- `task-01-multitenancy.md` — Organizations, Members, RBAC, Org Switcher
- `task-02-integration-framework.md` — Base classes, registry, action system
- `task-03-saas-integrations.md` — All 11 SaaS integrations
- `task-04-database-integrations.md` — PG/MySQL/MongoDB + schema sync
- `task-05-openapi-integrations.md` — OpenAPI spec parser + tool generator
- `task-06-ai-orchestration.md` — Agent runner, tool dispatch, multi-tool chains
- `task-07-output-generation.md` — PDF, Excel, Word, charts
- `task-08-background-jobs.md` — BullMQ jobs, WebSocket notifications, audit logs
- `task-09-frontend.md` — All frontend features

---

## 7. IMPLEMENTATION RULES FOR AI CODING AGENT

- Follow tasks strictly in order — later phases depend on earlier ones
- Never bypass org isolation: every DB query must include `org_id` filter
- Encrypt all secrets (integration credentials, AI API keys) at rest using AES-256 or KMS
- Every agent tool call must validate org permissions before executing
- Keep commits small and scoped to one subtask
- Write Zod DTOs for all API inputs; never trust raw request bodies
- Use Prisma transactions for any multi-table writes
- BullMQ jobs must be idempotent — safe to retry on failure
- AI agent must only access integrations explicitly enabled for the org
- All file downloads must go through signed GCS URLs — never expose raw GCS paths
- Prefer simplicity: no abstraction before it's needed by more than two consumers
- Every new NestJS module must be registered in `AppModule` or its parent feature module
