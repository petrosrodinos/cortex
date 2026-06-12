# Task: OpenAPI Integrations — Spec Parser & Tool Generator

## Objective
Allow organizations to connect any external API by providing an OpenAPI/Swagger spec (URL or JSON). The platform parses the spec, generates AI-callable tools from each endpoint, and stores auth configuration for runtime execution.

## Requirements
- Accept: OpenAPI 3.x URL, Swagger 2.x URL, raw JSON paste
- Auto-generate one tool per API endpoint
- Support auth: API Key (header/query), Bearer Token, OAuth2, Custom Headers
- Generated tools must follow OpenAI function-calling schema
- Tool execution makes real HTTP calls to the external API at runtime

## Subtasks

### Backend

- [ ] Prisma schema
  - Add `OpenApiIntegration` model (see plan.md domain model)
  - Run `prisma migrate dev`

- [ ] OpenAPI parser service (`api/src/modules/integrations/openapi/openapi-parser.service.ts`)
  - Fetch spec from URL (Axios GET) or accept raw JSON
  - Parse using `@readme/openapi-parser` or `swagger-parser`
  - Normalize Swagger 2.x to OpenAPI 3.x using `swagger2openapi`
  - Extract: operations (operationId, summary, description, parameters, requestBody)
  - Return `ParsedSpec` type: `{ baseUrl, operations: ParsedOperation[], securitySchemes }`

- [ ] Tool generator (`api/src/modules/integrations/openapi/tool-generator.service.ts`)
  - For each `ParsedOperation`, generate:
    ```typescript
    {
      name: string,                 // kebab: openapi__<operationId>
      description: string,          // from summary + description
      parameters: JsonSchemaObject  // merged from path params + query params + requestBody
    }
    ```
  - Store generated tools in `OpenApiIntegration.generated_tools` (Json field)
  - Create one `IntegrationAction` per generated tool

- [ ] Auth config builder (`api/src/modules/integrations/openapi/openapi-auth.service.ts`)
  - Parses `securitySchemes` from spec
  - Maps to `auth_type` and `auth_config` format
  - `buildRequestAuth(authConfig, decryptedCredentials)`: returns headers/params to inject

- [ ] OpenAPI integration class (`api/src/modules/integrations/openapi/openapi.integration.ts`)
  - Extends `BaseIntegration`
  - `getTools()`: reads from `generated_tools` JSON field
  - `executeTool(toolName, input, integration)`:
    1. Find matching operation by tool name
    2. Build URL from `baseUrl` + path template (substitute path params)
    3. Build query params, headers, and body from `input`
    4. Inject auth headers via `buildRequestAuth`
    5. Execute with Axios
    6. Return response data

- [ ] `OpenApiIntegrationsService`
  - `create(organizationUuid, dto)`: parse spec → generate tools → encrypt auth config → persist
  - `regenerateTools(id)`: re-parse spec and overwrite `generated_tools` + actions
  - `testConnection(id)`: hit the spec URL or a health endpoint from the spec

- [ ] Register `OpenApiIntegrationsModule` in `IntegrationsModule`

### Frontend

- [ ] OpenAPI integration setup form:
  - Radio: "Paste URL" / "Paste JSON"
  - URL input or JSON textarea
  - "Parse Spec" button → shows preview of discovered endpoints count
  - Auth type selector (API Key / Bearer / OAuth2 / Custom Headers)
  - Auth config fields (dynamic based on auth type selection)
- [ ] Actions list: after creation show all generated tools with enable/disable toggles
- [ ] "Regenerate Tools" button on integration detail page

## Technical Notes
- `operationId` may not be unique across all orgs — prefix tool name with integration UUID fragment: `openapi_<integId8>__<operationId>`
- If spec has no `operationId`, generate from `METHOD_/path/template` → `GET_/users/{id}` → `get_users_id`
- Request body schema from OpenAPI may be complex (nested `$ref`) — resolve all `$ref` before generating tool parameter schema
- Limit generated tools per spec to 100 to prevent abuse
- Store raw spec JSON (after normalization) in `spec_json` for re-parsing without network calls
- Never expose `auth_config` in API responses — decrypt only inside `openapi.integration.ts`

## Acceptance Criteria
- [ ] Provide a public OpenAPI URL (e.g. PetStore) → tools are generated and stored
- [ ] Provide raw JSON spec → tools are generated and stored
- [ ] Calling a generated tool makes a real HTTP request to the external API
- [ ] Bearer token auth is injected as `Authorization: Bearer <token>` header
- [ ] API key auth is injected as header or query param based on spec security scheme
- [ ] Regenerating tools from an updated spec updates actions without losing enabled/disabled state on unchanged tools
