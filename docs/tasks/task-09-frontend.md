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

### Routing Structure

```
/sign-in
/sign-up
/dashboard                          → redirect to /conversations
/conversations                      → list + open first
/conversations/:id                  → chat view
/integrations                       → integrations list
/integrations/new                   → add integration wizard
/integrations/:id                   → integration detail + actions
/files                              → generated files grid
/executions/:id                     → execution detail/trace
/settings
  /settings/organization            → org profile
  /settings/members                 → members management
  /settings/roles                   → roles & permissions
  /settings/ai-providers            → AI provider management
  /settings/usage                   → usage dashboard
  /settings/audit-logs              → audit log viewer
  /settings/billing                 → (future)
```

### Global Layout

- [ ] Update `sidebar.tsx`:
  - Top: Cortex logo + current organization name + avatar
  - Bottom: organization switcher dropdown (list of user's organizations, "Create Organization" option)
  - Nav links: Conversations, Integrations, Files, Settings
  - Collapse/expand on mobile
- [ ] `dashboard-navbar.tsx`: breadcrumb + user menu (existing, extend with org context)
- [ ] Protected route checks: org JWT required for all `/settings/*` and org-scoped pages

### Auth & Organization Switcher

- [ ] `useAuth` hook: extend to hold current org from JWT claims
- [ ] `organization.store.ts` (Zustand): `currentOrganizationanization`, `userOrganizations`, `setCurrentOrganizationanizationanization`
- [ ] Organization switcher: clicking an organization calls `POST /auth/switch-organization`, updates JWT in storage, refreshes organization store, navigates to `/conversations`
- [ ] "Create organization" modal: name input → `POST /organizations` → auto-switch to new organization

### Chat Interface (`/conversations/:id`)

- [ ] `ConversationPage`
  - Left panel: conversation list (auto-refresh on new message)
  - Right panel: message thread
  - New conversation button creates conversation + focuses input

- [ ] `MessageThread` component
  - Scrollable list of `MessageBubble` (USER: right, ASSISTANT: left)
  - `UserBubble`: plain text
  - `AssistantBubble`: Markdown renderer (`react-markdown` + `rehype-highlight`)
  - Tool call accordion: collapsible steps showing tool name → input → result
  - Approval prompt card: tool name + input JSON, Approve/Reject buttons
  - File card for generated files: type icon, filename, size, Download button
  - Inline chart render: `<img>` from signed URL
  - Widget render: `<iframe sandbox>` for HTML widget outputs

- [ ] `MessageInput` component
  - Textarea with auto-resize
  - Send on Enter (Shift+Enter for newline)
  - Disabled while execution is RUNNING (show spinner)
  - Attach files button (future)

- [ ] `useExecution` hook
  - Subscribes to Socket.io room `organization-${organizationUuid}-exec-${executionId}`
  - Events: `tool:start`, `tool:complete`, `agent:complete`, `agent:error`, `agent:approval_required`
  - Updates local state for the active execution

### Integrations

- [ ] `IntegrationsPage`: grid of provider cards (connected vs. available)
  - Status badge: ACTIVE (green) / ERROR (red) / INACTIVE (grey)
  - Quick action: Test Connection

- [ ] Add Integration Wizard (`/integrations/new`)
  - Step 1: Select provider (grid of logos)
  - Step 2: Fill credentials form (dynamic fields per provider)
  - Step 3: Test Connection → show schema preview (for DB) or endpoint count (for OpenAPI)
  - Step 4: Save

- [ ] Integration Detail page (`/integrations/:id`)
  - Provider name, status, created date
  - Actions tab: list of all actions with enable/disable toggle
  - For DB integrations: Schema Viewer (collapsible tree) + Sync Schema button
  - For OpenAPI integrations: Endpoints list + Regenerate Tools button
  - Delete integration button (with confirmation modal)

### Settings

- [ ] Members page: table with name, email, role, status; Invite by email modal; change role dropdown; remove member button
- [ ] Roles page: list of roles; Create/Edit role modal with permission checkboxes grouped by category
- [ ] AI Providers page: cards per provider; Add provider modal (API key, default model, usage limits); set default toggle
- [ ] Usage page: charts using `recharts` or `chart.js` (token trends, cost breakdown, top conversations)
- [ ] Audit Logs page: data table with server-side pagination and filters

### Files Page

- [ ] Grid of `GeneratedFile` cards: type icon (PDF/Excel/Word/Chart), filename, size, created date
- [ ] Download button → GET `/files/:id/download` → redirect to signed URL
- [ ] Filter by type, date range

### Execution Detail Page

- [ ] Timeline view of tool calls in order
- [ ] Each step shows: tool name, integration, input (collapsible JSON), output (collapsible JSON), duration, tokens, cost
- [ ] Total cost and tokens summary at the top
- [ ] Status chip: COMPLETED / FAILED / AWAITING_APPROVAL

### State & Services

- [ ] `conversations.service.ts` — CRUD + send message
- [ ] `integrations.service.ts` — full CRUD + test + sync
- [ ] `files.service.ts` — list + download
- [ ] `settings.service.ts` — members, roles, AI providers, usage
- [ ] `executions.service.ts` — get execution detail
- [ ] Zustand stores: `conversation.store.ts`, `integration.store.ts`, `file.store.ts`

## Technical Notes
- Use TanStack Query for all API calls; Zustand only for UI state and real-time ephemeral state
- Org switch must flush all TanStack Query cache (`queryClient.clear()`) to prevent cross-org data leakage
- WebSocket reconnection: use existing `websocket-provider.tsx`; join execution room after creating message, leave on `agent:complete`
- Markdown renderer: use `react-markdown` with `rehype-sanitize` — never dangerouslySetInnerHTML raw AI output
- Widget `<iframe>`: `sandbox="allow-scripts"` — no `allow-same-origin` to prevent escape
- Tool call accordion: show a spinner while `tool:start` received but `tool:complete` not yet received
- Pagination: all list pages use cursor-based pagination from the API

## Acceptance Criteria
- [ ] User can switch orgs from the sidebar; all data reloads scoped to new org
- [ ] Sending a message shows tool call steps live as they execute
- [ ] Approval prompt appears for destructive tools; approving resumes and completes the response
- [ ] All 11 SaaS integration config forms render correct fields
- [ ] DB integration shows schema tree after connecting
- [ ] OpenAPI integration shows endpoint count after parsing
- [ ] Generated PDF appears in chat as a downloadable file card
- [ ] Members page: can invite, change role, and remove members
- [ ] Roles page: can create a custom role with specific permissions
- [ ] Usage page shows correct token and cost charts
