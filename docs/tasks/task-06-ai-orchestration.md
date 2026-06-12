# Task: AI Orchestration & Agent Runner

## Objective
Build the AI agent system that accepts user messages, determines which integrations to call, orchestrates multi-tool workflows (sequential and parallel), executes Code Interpreter for data analysis, and returns structured outputs. Support multiple AI providers per org with runtime routing.

## Requirements
- Use `@openai/agents` as the primary agent framework
- Support OpenAI, Claude, and Grok as AI providers per org
- The agent discovers available tools dynamically from `IntegrationRegistry`
- Multi-tool chaining and parallel tool execution
- Sandboxed Code Interpreter via `@openai/agents/sandbox`
- Human-in-the-loop approval for destructive actions (defined per action)
- Stream agent progress to frontend via WebSocket (BullMQ job events)
- Every tool call is persisted to `ToolCall` table for observability

## Subtasks

### Backend

- [ ] Prisma schema
  - Add `AgentExecution` model (see plan.md)
  - Add `ToolCall` model (see plan.md)
  - Run `prisma migrate dev`

- [ ] AI provider adapter (`api/src/modules/ai/providers/`)
  - `ai-provider.interface.ts`: `{ createAgent(tools, model, systemPrompt): IAgent }`
  - `openai-provider.ts`: wraps `@openai/agents` Agent
  - `claude-provider.ts`: wraps Vercel AI SDK `@ai-sdk/anthropic` with tool calling
  - `grok-provider.ts`: wraps Vercel AI SDK with xAI base URL
  - `ai-provider-factory.service.ts`: given `orgId`, loads the org's default `AiProvider`, decrypts API key, instantiates correct adapter

- [ ] Tool dispatcher (`api/src/modules/ai/agents/tool-dispatcher.service.ts`)
  - `dispatch(orgId, toolName, input, executionId)`:
    1. Look up integration by tool name prefix
    2. Validate action is enabled + user has permission
    3. Call `IntegrationRegistry.executeTool()`
    4. Persist `ToolCall` row (token count, duration, cost estimate)
    5. Return result or structured error

- [ ] Agent runner (`api/src/modules/ai/agents/agent-runner.service.ts`)
  - `run(orgId, userId, conversationId, userMessage, executionId)`:
    1. Load org's AI provider via factory
    2. Load enabled tools from `IntegrationRegistry.getAllTools(orgId)`
    3. Inject Code Interpreter tool from `@openai/agents/sandbox`
    4. Build system prompt (include database schemas for DB integrations)
    5. Run agent loop via `@openai/agents` runner
    6. For each tool call: delegate to `ToolDispatcher`, emit BullMQ event
    7. For approval-required tools: pause, create BullMQ job in AWAITING_APPROVAL state, emit WebSocket event, wait for approval
    8. On completion: persist final `Message` (role: ASSISTANT), update `AgentExecution` status
    9. Return final response content + any generated file references

- [ ] Conversations & Messages module (`api/src/modules/conversations/`)
  - `conversations.service.ts`: CRUD, ensure org isolation
  - `messages.service.ts`:
    - `sendMessage(orgId, userId, conversationId, content)`:
      1. Persist USER message
      2. Create `AgentExecution` row (PENDING)
      3. Enqueue BullMQ job `agent-run` with executionId
      4. Return immediately with `{ executionId, messageId }`
    - Streaming alternative: can also run agent inline and stream via SSE
  - Controller routes: see plan.md API design

- [ ] BullMQ agent processor (`api/src/core/queues/processors/agent.processor.ts`)
  - Queue name: `agent-run`
  - `process(job)`:
    1. Call `AgentRunner.run(...)`
    2. Emit WebSocket events for progress (tool calls starting/completing)
    3. On completion emit final `agent:complete` event with message content
    4. On failure update `AgentExecution.status = FAILED`

- [ ] WebSocket gateway integration
  - Existing `websocket-provider.tsx` in frontend connects to Socket.io
  - Backend emits to room `org:<orgId>:execution:<executionId>`:
    - `tool:start` — `{ toolName, input }`
    - `tool:complete` — `{ toolName, result, durationMs }`
    - `agent:complete` — `{ content, files[], executionId }`
    - `agent:error` — `{ error }`
    - `agent:approval_required` — `{ toolName, input, executionId }`

- [ ] Human approval endpoint
  - `POST /organizations/:orgId/executions/:id/approve` — resumes paused BullMQ job
  - `POST /organizations/:orgId/executions/:id/reject` — cancels with rejection message

- [ ] Output type detector (`api/src/modules/ai/agents/output-detector.ts`)
  - Analyzes agent's final response intent and sets `metadata.outputType`
  - Types: `TEXT | FILE_PDF | FILE_EXCEL | FILE_WORD | CHART | TABLE | WIDGET`
  - Detected from prompt + tool results (e.g. if user said "create Excel report" → FILE_EXCEL)

- [ ] `AiModule` registers all sub-services, exports `AgentRunner`

### Frontend

- [ ] Chat interface: `app/src/pages/conversations/`
  - Message list (USER + ASSISTANT bubbles)
  - Tool call progress: animated accordion showing live tool execution steps
  - Input bar with send button
  - "Approval required" prompt: show tool name + input, Approve/Reject buttons
- [ ] Execution status hook: `useExecution(executionId)` — subscribes to WebSocket room
- [ ] Conversation list sidebar panel

## Technical Notes
- System prompt must include: org name, current date, available database schemas (formatted), and which integrations are connected
- `@openai/agents` runner: use `run()` with `stream: true` to get tool-call events incrementally
- Cost estimation: maintain a pricing table by model (tokens in/out cost per 1M) in `api/src/shared/ai/ai-pricing.ts` (already exists) — charge after each tool call
- `ToolCall.tokens_used` + `ToolCall.cost_usd` enables per-org usage dashboard
- Approval-required tools: mark `IntegrationAction.requires_approval = true` for destructive ops (merge PR, delete, create refund)
- Agent must never be given decrypted integration credentials — pass integration IDs; the dispatcher retrieves and uses them server-side

## Acceptance Criteria
- [ ] Sending a message creates an AgentExecution and enqueues a job
- [ ] Frontend receives real-time tool call events over WebSocket
- [ ] Agent successfully calls 2+ integrations in one message (multi-tool)
- [ ] Code Interpreter executes Python and returns output/chart
- [ ] Destructive tool pauses for approval; approving resumes the agent
- [ ] All ToolCall rows are persisted with duration, tokens, and cost
- [ ] Switching AI provider (org setting) routes to correct model without code change
