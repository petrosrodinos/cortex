# 02 — Gap Analysis

## Decision Record (confirmed with product owner)

| Decision | Choice |
|----------|--------|
| Composio `user_id` | Hybrid: org-shared + user-personal (fixed rules per toolkit category) |
| Agent Composio mode | Meta tools via `session.tools()` (SEARCH, EXECUTE, MANAGE_CONNECTIONS) |
| Toolkit catalog | Admin-curated subset synced to DB |
| Email providers (SMTP/Resend/SendGrid) | Migrate to Composio toolkits; remove custom implementations |
| Admin access | SUPER_ADMIN only (`/admin` routes + UI) |
| Triggers | In scope |
| Gemini AI provider | Out of scope (OpenAI/Claude/Grok sufficient) |
| Session lifecycle | New session per execution; persist `composio_session_id` on conversation for reuse |
| Auth configs | Composio managed auth only |
| OAuth callback | `/dashboard/integrations/callback` on frontend |

---

## Feature-by-Feature Matrix

| Feature | Verdict | Justification |
|---------|---------|---------------|
| **13 SaaS integrations** (GitHub, Slack, etc.) | **Remove** | Replaced by Composio toolkits + connected accounts |
| **SMTP / Resend / SendGrid** | **Remove** | Migrate to Composio email toolkits (Gmail, Resend toolkit, etc.) |
| **Gmail / Google Drive** | **Remove** (as custom) | Composio Google toolkits + OAuth Connect Links |
| **Database integrations** | **Keep** | Not in Composio scope; retain `database_integrations` |
| **OpenAPI integrations** | **Keep** | Custom REST; retain parser + generator |
| **MCP integrations** (user servers) | **Keep** | User MCP servers ≠ Composio session MCP |
| **AI providers** (OpenAI/Claude/Grok) | **Keep** | LLM routing stays org-scoped |
| **Output generators** | **Keep** | `output__*` tools unchanged |
| **Document tools** | **Keep** | `document__*` unchanged |
| **Code interpreter** | **Keep** | Sandbox unchanged |
| **Organization tools** | **Keep** | Org profile/members tools unchanged |
| **Integration registry pattern** | **Refactor** | Becomes unified `ToolRegistry` with provider adapters |
| **`integrations` table for SaaS** | **Remove** | Replaced by Composio connected accounts + local catalog |
| **`integration_actions` for SaaS** | **Refactor** | Split: Composio tool permissions vs legacy action rows |
| **BYOC credential forms** | **Remove** | Composio Connect Links |
| **Manual OAuth token paste** | **Remove** | `session.authorize()` flow |
| **Provider catalog (frontend)** | **Replace** | Composio toolkit catalog from DB |
| **Per-provider SaaS modules** | **Remove** | ~13 NestJS modules deleted |
| **Tool execution via registry** | **Refactor** | Add `ComposioToolAdapter` for meta tools |
| **Human-in-the-loop approval** | **Keep** | Extend to Composio meta tool executions |
| **Tool call audit log** | **Keep** | Extend `tool_calls` with `provider_type`, `composio_tool_slug` |
| **Conversation integration picker** | **Refactor** | Select toolkits/connections vs legacy integration UUIDs |
| **Org RBAC permissions** | **Refactor** | Replace provider-specific keys with toolkit-scoped permissions |
| **Admin integration UI** | **New** | SUPER_ADMIN toolkit management |
| **Startup toolkit sync** | **New** | Idempotent upsert from Composio API |
| **Composio sessions** | **New** | Per-execution create; conversation stores session ID |
| **Composio triggers** | **New** | Webhook endpoint + trigger instance management |
| **OAuth callback route** | **New** | Frontend `/dashboard/integrations/callback` |
| **Composio SDK** | **New** | `@composio/core` + `@composio/vercel` |
| **Knowledge tools** | **N/A** | No dedicated knowledge tool system exists today (marketing copy only) |

---

## Hybrid Connection Tier Rules (fixed list)

### Org-shared (`user_id` = `org:{orgUuid}`)
Toolkits used as shared workspace resources:
- `slack`, `stripe`, `hubspot`, `linear`, `notion`, `posthog`, `intercom`
- Team/workspace CRM, analytics, billing, support

### User-personal (`user_id` = `user:{userUuid}`)
Toolkits tied to individual identity:
- `gmail`, `google_drive`, `github` (personal dev account)
- Email and personal productivity

### Admin-configurable override
`composio_toolkits.connection_tier` enum: `ORG_SHARED` | `USER_PERSONAL` — seeded from fixed list; SUPER_ADMIN can override per toolkit.

---

## Security Gaps to Fix During Refactor

| Gap | Fix |
|-----|-----|
| JWT org not validated against path param | Add `OrganizationContextGuard` validating `req.user.organization_uuid === params.organization_uuid` |
| Missing membership check on integration reads | Call `requireActiveMember()` on all org-scoped routes |
| Org-wide credential sharing | Hybrid model + Composio user_id isolation |
| No credential rotation UI | Composio handles token refresh; expose reconnect in UI |
