# Task: MCP Integrations — Server Connection & Tool Bridge

## Objective
Allow organizations to connect external Model Context Protocol (MCP) servers. The platform discovers tools from each server via the Vercel AI SDK MCP client, registers them as integration actions, and proxies tool execution back to the MCP server at runtime.

## Requirements
- Accept remote MCP servers over HTTP (Streamable HTTP) or SSE transports
- Discover tools from the server using `@ai-sdk/mcp` `createMCPClient` + `client.tools()`
- Support auth: None, Bearer token, custom headers, OAuth (`authProvider`)
- Discovered tools must follow OpenAI function-calling schema (via AI SDK tool adapter)
- Tool execution calls the MCP server through the same client connection
- Stdio transport is dev-only (local MCP servers); never expose stdio config in production UI
- Re-sync tools when the remote server changes without losing enable/disable state on unchanged tools

## Dependencies
- Upgrade `ai` to v6+ and add packages:
  - `@ai-sdk/mcp`
  - `@modelcontextprotocol/sdk` (for `StreamableHTTPClientTransport` when needed)
- Existing integration framework (`BaseIntegration`, `IntegrationRegistry`) from task-02
- Agent runner tool dispatch from task-06

## Subtasks

### Backend

- [ ] Prisma schema
  - Add `MCP` to `IntegrationProvider` enum
  - Add `McpTransportType` enum: `HTTP | SSE`
  - Add `McpAuthType` enum: `NONE | BEARER | CUSTOM_HEADERS | OAUTH`
  - Add `McpIntegration` model:
    ```
    id, uuid, integration_uuid (unique FK)
    server_url: String
    transport_type: McpTransportType @default(HTTP)
    auth_type: McpAuthType @default(NONE)
    auth_config: String              # encrypted JSON
    server_name: String?             # from MCP initialize handshake
    discovered_tools: Json           # cached tool definitions
    last_tool_sync: DateTime?
    ```
  - Run `prisma migrate dev`

- [ ] MCP client factory (`api/src/modules/integrations/mcp/mcp-client.factory.ts`)
  - `createClient(config: McpConnectionConfig): Promise<MCPClient>`
  - Build transport from `transport_type`:
    - `HTTP` → `{ type: 'http', url, headers, authProvider, redirect: 'error' }`
    - `SSE` → `{ type: 'sse', url, headers, authProvider, redirect: 'error' }`
  - Inject decrypted auth:
    - `BEARER` → `headers.Authorization = 'Bearer <token>'`
    - `CUSTOM_HEADERS` → merge configured header map
    - `OAUTH` → pass org-stored OAuth client provider instance
  - Always set `redirect: 'error'` on HTTP/SSE to prevent SSRF via redirects
  - Stdio helper for local dev/tests only (not registered in production module)

- [ ] Tool discovery service (`api/src/modules/integrations/mcp/mcp-tool-discovery.service.ts`)
  - `discoverTools(config): Promise<DiscoveredMcpTool[]>`
    1. `const client = await mcpClientFactory.createClient(config)`
    2. `const tools = await client.tools()` — schema discovery mode (all server tools)
    3. Map each tool to:
       ```typescript
       {
         name: string,              // kebab: mcp_<integId8>__<serverToolName>
         serverToolName: string,    // original MCP tool name
         description: string,
         parameters: JsonSchemaObject
       }
       ```
    4. `await client.close()` in `finally`
  - `limit`: cap at 100 tools per server
  - Persist `server_name` from client metadata when available

- [ ] MCP connection manager (`api/src/modules/integrations/mcp/mcp-connection-manager.service.ts`)
  - Short-lived clients for discovery and `testConnection`
  - Execution path: open client → call tool → close in `finally`
  - Optional: LRU cache of clients keyed by `integration_uuid` with 5-minute TTL for high-traffic orgs (must call `close()` on eviction)
  - Never share one client across concurrent executions for the same integration (race on tool calls)

- [ ] Auth config builder (`api/src/modules/integrations/mcp/mcp-auth.service.ts`)
  - `buildTransportAuth(authType, authConfig, decryptedCredentials)` → headers / `authProvider`
  - OAuth: implement `OAuthClientProvider` wrapper that reads tokens from encrypted integration config and refreshes when expired
  - `validateAuthorizationServerURL` allowlist when connecting to third-party MCP servers (org-configurable origins)

- [ ] MCP integration class (`api/src/modules/integrations/mcp/mcp.integration.ts`)
  - Extends `BaseIntegration`
  - `provider = IntegrationProvider.MCP`
  - `getTools(integration)`: reads from `discovered_tools` JSON field
  - `executeTool(toolName, input, integration)`:
    1. Find matching tool by `toolName` in `discovered_tools`
    2. Open MCP client via connection manager
    3. `const tools = await client.tools()`
    4. `await tools[serverToolName].execute(input, { messages: [], toolCallId })`
    5. Return structured result; map `isError` to `{ success: false }`
    6. Close client in `finally`
  - `testConnection(config)`:
    1. Connect to server
    2. Call `client.listResources()` or `client.tools()` to verify handshake
    3. Close client

- [ ] `McpIntegrationsService`
  - `create(organizationUuid, dto)`: validate URL → discover tools → encrypt auth → persist `Integration` + `McpIntegration` + seed `IntegrationAction` rows
  - `syncTools(id)`: re-run discovery, merge new tools, preserve `enabled` on unchanged action keys
  - `testConnection(id)`: delegate to `McpIntegration.testConnection`

- [ ] Controller (`api/src/modules/integrations/mcp/mcp-integrations.controller.ts`)
  - `POST /organizations/:orgUuid/integrations/mcp` — create
  - `POST /organizations/:orgUuid/integrations/mcp/:id/sync-tools` — re-discover
  - `POST /organizations/:orgUuid/integrations/mcp/:id/test` — test connection
  - Guard mutating routes with `@OrgPermission('org:integrations:manage')`

- [ ] Register `McpIntegrationsModule` in `IntegrationsModule` and `IntegrationRegistry`

- [ ] Agent runner integration (task-06)
  - MCP tools flow through existing `ToolDispatcher` → `IntegrationRegistry.executeTool()`
  - No special-case in agent loop — MCP tools are standard `AiTool` definitions
  - Elicitation (server requests user input mid-tool): emit `agent:approval_required` or dedicated `agent:elicitation_required` WebSocket event; resume after user submits

### Frontend

- [ ] Add `MCP` to provider enum and `provider-config-fields.ts`
- [ ] MCP integration setup form:
  - Server URL input (validate `https://` in production)
  - Transport selector: HTTP (default) / SSE
  - Auth type: None / Bearer / Custom Headers / OAuth
  - Dynamic auth fields based on selection
  - "Test Connection" button → shows server name + discovered tool count
  - "Connect" saves integration
- [ ] Integration detail page:
  - List discovered tools with enable/disable toggles
  - "Sync Tools" button (calls sync endpoint)
  - Last synced timestamp
  - Connection status badge (ACTIVE / ERROR)

## Technical Notes

### AI SDK usage
```typescript
import { createMCPClient } from '@ai-sdk/mcp';

const client = await createMCPClient({
  transport: {
    type: 'http',
    url: serverUrl,
    headers: authHeaders,
    redirect: 'error',
  },
});

const tools = await client.tools();
const result = await tools['tool-name'].execute(
  { query: '...' },
  { messages: [], toolCallId: 'call_123' },
);

await client.close();
```

- Use schema discovery (`client.tools()` with no args) at connect/sync time — store resulting JSON schemas in `discovered_tools`
- For execution, prefer re-opening client and calling `tools()[serverToolName].execute()` rather than storing raw execute functions
- `createMCPClient` is lightweight: no session resumption, no server notifications — design for connect → call → close per execution
- Close clients in `finally` blocks; use `onFinish` callback only when MCP tools are passed directly into `streamText` / `generateText` inside a single request handler (not the default agent path here)

### Security
- Validate `server_url` is HTTPS in non-local environments
- Block private IP ranges and `localhost` in production (`10.x`, `172.16–31.x`, `192.168.x`, `127.x`, `::1`)
- Set `redirect: 'error'` on all HTTP/SSE transports
- Never return `auth_config` or decrypted tokens in API responses
- OAuth: implement `validateAuthorizationServerURL` against org allowlist
- Stdio transport must not be configurable via public API — dev/test only

### Tool naming
- Prefix: `mcp_<integrationUuidFirst8>__<serverToolName>`
- `IntegrationAction.key` = `<serverToolName>` (portion after `__`)
- Tool names must be globally unique across all integrations (same rule as OpenAPI/SaaS)

### Caching & sync
- Store `discovered_tools` JSON after every successful discovery
- On sync: compare by `serverToolName`; add new actions as `enabled: true`; mark removed tools' actions as disabled (do not delete rows — preserve audit history)
- Update `last_tool_sync` on every sync

### Error handling
- Connection failures set `Integration.status = ERROR` and store error message in `metadata.lastError`
- Tool execution errors: return `{ success: false, error: string }` — do not throw unless action validation fails
- MCP `isError: true` responses map to failed tool results in `ToolCall` table

## Acceptance Criteria
- [ ] Connect to a public HTTP MCP server → tools are discovered and stored as `IntegrationAction` rows
- [ ] Bearer token auth is sent in `Authorization` header on every MCP request
- [ ] Custom headers auth injects configured headers on transport
- [ ] Calling a discovered tool executes against the real MCP server and returns data
- [ ] `sync-tools` picks up newly added server tools without resetting enabled state on existing tools
- [ ] `test-connection` succeeds against a reachable server and fails with a clear error against an unreachable one
- [ ] SSRF: connection to `http://127.0.0.1` or private IPs is rejected in production
- [ ] Agent can call MCP tools alongside SaaS/OpenAPI tools in the same conversation via `IntegrationRegistry`
