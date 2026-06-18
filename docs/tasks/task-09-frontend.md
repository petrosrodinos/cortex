# Task: Frontend — Complete UI

## Objective

Build all frontend screens and components for the Cortex platform, wiring them to the backend APIs built in previous phases. The UI must support org switching, full integration management, a real-time chat interface, file management, settings, and admin observability.

## Requirements

- Organization switcher in left sidebar — instant context switch
- Chat is the primary interface; all AI interactions happen here
- Integration management is self-serve for Admins
- Settings panels for roles, members, AI providers, usage limits
- All pages respond to real-time WebSocket events where relevant

## Subtasks

### Global Layout

- [x] `sidebar.tsx`: logo + current organization name + avatar, org switcher dropdown ("Create Organization" option), nav links (Dashboard, Conversations, Organizations, Integrations), collapse/expand on mobile
- [x] `dashboard-navbar.tsx`: breadcrumb + user menu
- [x] Protected route checks: `protected-route.tsx` guards routes based on login state

### Auth & Organization Switcher

- [x] `useAuth` hook: holds current user/org context from JWT
- [x] `organization.store.ts` (Zustand): `currentOrganization`, `userOrganizations`, `setCurrentOrganization`
- [x] Organization switcher: `organization-switcher.tsx` — calls `POST /auth/switch-organization`, updates JWT, refreshes org store
- [x] `user-menu-popover.tsx`: user profile/settings menu in navbar
- [ ] "Create organization" modal: name input → `POST /organizations` → auto-switch to new org (verify implementation)

### Chat Interface (`/dashboard/conversations/:uuid`)

- [x] `ConversationPage`: left panel conversation list + right panel message thread; new conversation button
- [x] `MessageThread` component: scrollable list of USER/ASSISTANT bubbles, Markdown renderer, tool call accordion, approval prompt card (Approve/Reject buttons)
- [x] `MessageInput` component: textarea, send on Enter, disabled while execution is RUNNING
- [x] `useExecution` hook: subscribes to Socket.io execution room, handles `tool:start`, `tool:complete`, `agent:complete`, `agent:error`, `agent:approval_required`
- [ ] `AssistantBubble`: verify `react-markdown` + `rehype-highlight` / `rehype-sanitize` is used (not `dangerouslySetInnerHTML`)
- [ ] File card for generated files in chat: type icon, filename, size, Download button
- [ ] Inline chart render: `<img>` from signed URL
- [ ] Widget render: `<iframe sandbox="allow-scripts">` for HTML widget outputs
- [ ] Attach files button

### Integrations

- [x] `IntegrationsPage` (`/dashboard/integrations`): grid of provider cards (connected vs. available), status badges (ACTIVE/ERROR/INACTIVE), Test Connection action
- [x] Add Integration Wizard: Step 1 provider selection, Step 2 dynamic credentials form (per-provider config in `provider-config-fields.ts`), Step 3 Test Connection, Step 4 Save — supports SaaS (GitHub, Slack, Stripe, HubSpot, Linear, Notion, Google Drive, SMTP, Gmail, PostHog, Intercom), Database (PostgreSQL, MySQL, MongoDB), OpenAPI, MCP
- [x] Integration Detail page (`/dashboard/integrations/:uuid`): provider name/status/date, Actions tab with enable/disable toggle, Schema Viewer + Sync Schema (DB), Endpoints list + Regenerate Tools (OpenAPI), MCP sync tools, Delete with confirmation

### Settings

- [x] Members management: table with name/email/role/status; add/remove members; role assignment — currently under `/dashboard/organizations` (Members tab)
- [x] Roles management: list of roles; Create/Edit role with permission checkboxes — currently under `/dashboard/organizations` (Roles & Permissions tab)
- [ ] Move Members & Roles into `/settings/members` and `/settings/roles` pages (or confirm current location is final)
- [ ] AI Providers page: cards per provider; Add provider modal (API key, default model, usage limits); set default toggle
- [ ] Usage page: charts using `recharts` or `chart.js` (token trends, cost breakdown, top conversations)
- [ ] Audit Logs page: data table with server-side pagination and filters
- [ ] Organization profile page (`/settings/organization`): org name, logo, etc.

### Files Page

- [ ] `/files` route and page
- [ ] Grid of `GeneratedFile` cards: type icon (PDF/Excel/Word/Chart), filename, size, created date
- [ ] Download button → `GET /files/:id/download` → redirect to signed URL
- [ ] Filter by type, date range
- [ ] `files.service.ts` — list + download

### Execution Detail Page

- [ ] `/executions/:id` route and page
- [ ] Timeline view of tool calls in order
- [ ] Each step: tool name, integration, input (collapsible JSON), output (collapsible JSON), duration, tokens, cost
- [ ] Total cost and tokens summary at the top
- [ ] Status chip: COMPLETED / FAILED / AWAITING_APPROVAL

### State & Services

- [x] `conversations.service.ts` — CRUD + send message (`src/features/conversations/services/`)
- [x] `integrations.service.ts` — full CRUD + test + sync + actions (`src/features/integrations/services/`)
- [x] `members` and `roles` services (`src/features/members/`, `src/features/roles/`)
- [x] Zustand stores: `auth.store`, `organization.store`, `websocket.store`
- [x] `use-execution.ts` hook — execution state tracking with Socket.io
- [ ] `files.service.ts` — list + download
- [ ] `settings.service.ts` — AI providers, usage, audit logs
- [ ] `executions.service.ts` — full execution detail (separate from conversations)
- [ ] `file.store.ts`, `conversation.store.ts`, `integration.store.ts` (Zustand, if not already present)

## Technical Notes

- Use TanStack Query for all API calls; Zustand only for UI state and real-time ephemeral state
- Org switch must flush all TanStack Query cache (`queryClient.clear()`) to prevent cross-org data leakage
- WebSocket reconnection: use existing `websocket-provider.tsx`; join execution room after creating message, leave on `agent:complete`
- Markdown renderer: use `react-markdown` with `rehype-sanitize` — never `dangerouslySetInnerHTML` raw AI output
- Widget `<iframe>`: `sandbox="allow-scripts"` — no `allow-same-origin` to prevent escape
- Tool call accordion: show a spinner while `tool:start` received but `tool:complete` not yet received
- Pagination: all list pages use cursor-based pagination from the API

## Acceptance Criteria

- [x] User can switch orgs from the sidebar; all data reloads scoped to new org
- [x] Sending a message shows tool call steps live as they execute
- [x] Approval prompt appears for destructive tools; approving/rejecting resumes the execution
- [x] All 11 SaaS integration config forms render correct fields
- [x] DB integration shows schema tree after connecting
- [x] OpenAPI integration shows endpoint count after parsing
- [ ] Generated PDF appears in chat as a downloadable file card
- [x] Members page: can invite, change role, and remove members
- [x] Roles page: can create a custom role with specific permissions
- [ ] Usage page shows correct token and cost charts
