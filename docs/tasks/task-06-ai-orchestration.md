# Task: AI Orchestration & Agent Runner

## Objective

Build the AI agent system that accepts user messages, determines which integrations to call, orchestrates multi-tool workflows (sequential and parallel), executes Code Interpreter for data analysis, and returns structured outputs. Support multiple AI providers per org with runtime routing.

## Requirements

- Use **Vercel AI SDK** (`ai` package) with `ToolLoopAgent` and `tool()` as the primary agent framework
- Support OpenAI, Claude, and Grok as AI providers per org via `@ai-sdk/openai`, `@ai-sdk/anthropic`, and xAI-compatible provider
- The agent discovers available tools dynamically from `IntegrationRegistry`
- Multi-tool chaining and parallel tool execution via `ToolLoopAgent` loop (`stopWhen`, `onStepFinish`)
- Sandboxed Code Interpreter via `@openai/agents/sandbox`
- Custom conversation memory layer backed by **Redis hot cache** + **Postgres durable store** (no external Mem0/Letta dependency)
- Human-in-the-loop approval for destructive actions (defined per action)
- Stream agent progress to frontend via WebSocket (BullMQ job events)
- Every tool call is persisted to `ToolCall` table for observability

## Subtasks

### Backend

- [ ] Prisma schema
  - Add `AgentExecution` model:
    ```
    id, uuid, message_id, org_id, user_id
    status: PENDING | RUNNING | COMPLETED | FAILED | AWAITING_APPROVAL
    input: Json, output: Json
    started_at, completed_at, error: String?
    ```
  - Add `ToolCall` model:
    ```
    id, execution_id → AgentExecution
    integration_id → Integration?, tool_name: String
    input: Json, output: Json
    status: SUCCESS | FAILED, error: String?
    tokens_used: Int, cost_usd: Decimal
    duration_ms: Int, created_at
    ```
  - Run `prisma migrate dev`

- [ ] AI provider adapter (`api/src/modules/ai/providers/`)
  - `ai-provider.interface.ts`: `{ createModel(apiKey, modelId): LanguageModel, createAgent(tools, model, instructions): ToolLoopAgent }`
  - `openai-provider.ts`: `@ai-sdk/openai` model factory
  - `claude-provider.ts`: `@ai-sdk/anthropic` model factory
  - `grok-provider.ts`: `@ai-sdk/openai` with xAI base URL
  - `ai-provider-factory.service.ts`: given `organizationUuid`, loads the org's default `AiProvider`, decrypts API key, instantiates correct adapter and returns a configured `ToolLoopAgent`

- [ ] Conversation memory (`api/src/modules/ai/memory/`)
  - `conversation-memory.interface.ts`: `{ getMessages, appendMessages, replaceMessages, invalidate }`
  - `conversation-memory.service.ts`: custom memory layer (Letta/Mem0-style session semantics, self-hosted)
    - **Redis (hot path):** store active `ModelMessage[]` per conversation for fast agent context loading
      - Key pattern: `chat:messages:{organizationUuid}:{conversationId}`
      - Value: JSON-serialized message array (roles, content, tool-call parts)
      - TTL: 24h sliding window on every append; extend on read
    - **Postgres (cold path):** `Message` table is source of truth
    - `getMessages(conversationId)`:
      1. Try Redis cache hit → return immediately
      2. On miss: load from Postgres, convert to `ModelMessage[]`, hydrate Redis, return
    - `appendMessages(conversationId, messages)`:
      1. Append to Redis list in cache
      2. Persist new rows to Postgres asynchronously (or in same transaction as execution completion)
    - `replaceMessages(conversationId, messages)`: overwrite Redis + sync Postgres (used after validation/migration)
    - `invalidate(conversationId)`: delete Redis key (on conversation delete or schema change)
  - Use existing `CacheService` / Redis via `AppCacheModule`; wire `cache-manager-redis-store` when `REDIS_URL` is set
  - Agent runner never queries Postgres directly for history — always goes through `ConversationMemoryService`

- [ ] Tool dispatcher (`api/src/modules/ai/agents/tool-dispatcher.service.ts`)
  - `dispatch(organizationUuid, toolName, input, executionId)`:
    1. Look up integration by tool name prefix
    2. Validate action is enabled + user has permission
    3. Call `IntegrationRegistry.executeTool()`
    4. Persist `ToolCall` row (token count, duration, cost estimate)
    5. Return result or structured error

- [ ] Integration tool bridge (`api/src/modules/ai/agents/integration-tools.factory.ts`)
  - `buildTools(organizationUuid, executionId)`: maps `IntegrationRegistry.getAllTools()` into AI SDK `tool()` definitions
  - Each tool `execute` delegates to `ToolDispatcher.dispatch()`
  - Destructive tools set `needsApproval: true` when `IntegrationAction.requires_approval = true`
  - Inject Code Interpreter tool from `@openai/agents/sandbox` alongside integration tools

- [ ] Agent runner (`api/src/modules/ai/agents/agent-runner.service.ts`)
  - `run(organizationUuid, userId, conversationId, userMessage, executionId)`:
    1. Load org's AI provider via factory
    2. Load conversation history via `ConversationMemoryService.getMessages(conversationId)`
    3. Append user message to memory (Redis + Postgres USER row)
    4. Load enabled tools from `integration-tools.factory.buildTools()`
    5. Inject Code Interpreter tool from `@openai/agents/sandbox`
    6. Build system prompt (include database schemas for DB integrations)
    7. Create `ToolLoopAgent` with model, instructions, tools, `stopWhen: stepCountIs(20)`
    8. Run agent via `agent.generate({ messages })` or `agent.stream({ messages })`
    9. Use `onStepFinish` to emit BullMQ/WebSocket events per tool call step
    10. For approval-required tools: pause execution, set `AgentExecution.status = AWAITING_APPROVAL`, emit WebSocket event, resume on approval
    11. On completion: append assistant `ModelMessage` to memory, persist final `Message` (role: ASSISTANT), update `AgentExecution` status
    12. Return final response content + any generated file references

- [ ] Conversations & Messages module (`api/src/modules/conversations/`)
  - `conversations.service.ts`: CRUD, ensure org isolation
  - `messages.service.ts`:
    - `sendMessage(organizationUuid, userId, conversationId, content)`:
      1. Persist USER message (Postgres + Redis via `ConversationMemoryService`)
      2. Create `AgentExecution` row (PENDING)
      3. Enqueue BullMQ job `agent-run` with executionId
      4. Return immediately with `{ executionId, messageId }`
    - Streaming alternative: run agent inline via `agent.stream()` and pipe chunks over SSE
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
  - Backend emits to room `org:<organizationUuid>:execution:<executionId>`:
    - `tool:start` — `{ toolName, input }`
    - `tool:complete` — `{ toolName, result, durationMs }`
    - `agent:complete` — `{ content, files[], executionId }`
    - `agent:error` — `{ error }`
    - `agent:approval_required` — `{ toolName, input, executionId }`

- [ ] Human approval endpoint
  - `POST /organizations/:organizationUuid/executions/:id/approve` — resumes paused BullMQ job
  - `POST /organizations/:organizationUuid/executions/:id/reject` — cancels with rejection message

- [ ] Output type detector (`api/src/modules/ai/agents/output-detector.ts`)
  - Analyzes agent's final response intent and sets `metadata.outputType`
  - Types: `TEXT | FILE_PDF | FILE_EXCEL | FILE_WORD | CHART | TABLE | WIDGET`
  - Detected from prompt + tool results (e.g. if user said "create Excel report" → FILE_EXCEL)

- [ ] `AiModule` registers all sub-services, exports `AgentRunner` and `ConversationMemoryService`

### Frontend

- [ ] Chat interface: `app/src/pages/conversations/`
  - Message list (USER + ASSISTANT bubbles)
  - Tool call progress: animated accordion showing live tool execution steps
  - Input bar with send button
  - "Approval required" prompt: show tool name + input, Approve/Reject buttons
- [ ] Execution status hook: `useExecution(executionId)` — subscribes to WebSocket room
- [ ] Conversation list sidebar panel

## Technical Notes

### AI SDK agent pattern

```ts
import { ToolLoopAgent, tool, stepCountIs } from 'ai';

const agent = new ToolLoopAgent({
  model: providerModel,
  instructions: systemPrompt,
  tools: integrationTools,
  stopWhen: stepCountIs(20),
});

const result = await agent.generate({
  messages: await conversationMemory.getMessages(conversationId),
  onStepFinish: async ({ toolCalls, usage }) => {
    await emitToolProgress(toolCalls, usage);
  },
});
```

- Use `agent.stream()` when piping to SSE; use `onStepFinish` for tool-call progress events
- Provider adapters return a `LanguageModel` instance; `ToolLoopAgent` is constructed per run with org-specific tools
- Convert `IntegrationRegistry` OpenAI-style function schemas to AI SDK `tool({ inputSchema: z.object(...), execute })` via `integration-tools.factory`

### Conversation memory (Redis + Postgres)

| Layer | Role | Access pattern |
| --- | --- | --- |
| Redis | Hot cache for active chat context | `getMessages` reads here first |
| Postgres `Message` | Durable source of truth | Hydrate Redis on cache miss; persist on append |
| `ConversationMemoryService` | Unified API | Agent runner + messages service use only this |

- Redis key: `chat:messages:{organizationUuid}:{conversationId}`
- Message format in cache: `ModelMessage[]` (compatible with `agent.generate({ messages })`)
- On `sendMessage`: append user message to Redis immediately so next agent run has zero DB latency for active chats
- On agent completion: append assistant message to Redis + Postgres in same flow
- On conversation open (cold start): load last N messages from Postgres, hydrate Redis
- Future extension: add summarization layer for conversations exceeding token budget (compress older turns into a SYSTEM summary message, keep recent turns verbatim)

### Other notes

- System prompt must include: org name, current date, available database schemas (formatted), and which integrations are connected
- Cost estimation: maintain a pricing table by model (tokens in/out cost per 1M) in `api/src/integrations/ai/utils/ai-pricing.ts` — charge after each tool call via `onStepFinish` usage data
- `ToolCall.tokens_used` + `ToolCall.cost_usd` enables per-org usage dashboard
- Approval-required tools: mark `IntegrationAction.requires_approval = true` for destructive ops (merge PR, delete, create refund); use AI SDK tool approval flow to pause the agent loop
- Agent must never be given decrypted integration credentials — pass integration IDs; the dispatcher retrieves and uses them server-side
- Agent loop uses AI SDK (`ToolLoopAgent`), not `@openai/agents` runner — exception: `@openai/agents/sandbox` for Code Interpreter only
- Do not use external memory providers (Mem0, Letta); all session semantics are handled by `ConversationMemoryService`

## Acceptance Criteria

- [ ] Sending a message creates an AgentExecution and enqueues a job
- [ ] Active conversation messages are served from Redis on subsequent turns (verify cache hit in logs/tests)
- [ ] Cache miss correctly hydrates from Postgres and repopulates Redis
- [ ] Frontend receives real-time tool call events over WebSocket
- [ ] Agent successfully calls 2+ integrations in one message (multi-tool via `ToolLoopAgent`)
- [ ] Code Interpreter executes Python and returns output/chart
- [ ] Destructive tool pauses for approval; approving resumes the agent
- [ ] All ToolCall rows are persisted with duration, tokens, and cost
- [ ] Switching AI provider (org setting) routes to correct model without code change
