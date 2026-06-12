# Task: Integration Framework — Base Architecture

## Objective
Build the abstract integration framework: base class/interface every integration implements, the integration registry, action system, credential encryption, and connectivity testing — before any specific integration is added.

## Requirements
- Every integration (SaaS, Database, OpenAPI) shares a common contract
- Integration configs (credentials, connection strings) must be encrypted at rest
- The AI agent can discover and call any enabled integration action through a unified tool-calling interface
- Admins can enable/disable individual actions per integration
- The framework must be extensible: adding a new integration requires only implementing the base interface

## Subtasks

### Backend

- [ ] Prisma schema additions
  - `Integration` model (see plan.md domain model)
  - `IntegrationAction` model: `id, integration_id, key, label, description, enabled, required_permission_key`
  - Run `prisma migrate dev`

- [ ] Encryption service (`api/src/shared/utils/encryption.service.ts`)
  - AES-256-GCM encrypt/decrypt using `ENV.ENCRYPTION_KEY` (32-byte hex env var)
  - Methods: `encrypt(plaintext: string): string`, `decrypt(ciphertext: string): string`
  - Used wherever credentials are stored/retrieved from DB

- [ ] Define `IIntegration` interface (`api/src/modules/integrations/framework/integration.interface.ts`)
  ```typescript
  interface IIntegration {
    provider: IntegrationProvider
    getTools(integration: Integration): AiTool[]
    testConnection(config: Record<string, any>): Promise<boolean>
    executeTool(toolName: string, input: Record<string, any>, integration: Integration): Promise<any>
  }
  ```

- [ ] `BaseIntegration` abstract class (`api/src/modules/integrations/framework/base-integration.ts`)
  - Implements `IIntegration`
  - `decryptConfig(integration)`: returns decrypted config JSON
  - `validateAction(integration, toolName)`: checks action is enabled in DB
  - `buildToolDefinitions()`: abstract — each subclass returns OpenAI tool schemas

- [ ] `IntegrationRegistry` service (`api/src/modules/integrations/framework/integration-registry.service.ts`)
  - Map of `provider → IIntegration instance`
  - `register(integration: IIntegration)`: called from each integration module's `onModuleInit`
  - `getByProvider(provider)`: resolve handler
  - `getAllTools(orgId)`: aggregate enabled tools across all active integrations for an org

- [ ] `IntegrationsModule` + `IntegrationsService` + `IntegrationsController`
  - `integrationsService.create(orgId, dto)`: encrypt config, persist, seed actions
  - `integrationsService.testConnection(id)`: delegate to registry handler
  - `integrationsService.getEnabledTools(orgId)`: for AI agent use
  - Controller routes: see plan.md API design `/integrations` section
  - Guard with `@OrgPermission('org:integrations:manage')` on mutating routes

- [ ] `IntegrationActionsService`
  - `toggleAction(integrationId, actionId, enabled)` 
  - `getActions(integrationId)`

- [ ] Seed integration actions when integration is created
  - Each provider class exposes `static defaultActions(): IntegrationActionSeed[]`
  - Called during `integrationsService.create` to insert default action rows

### Frontend

- [ ] `Integration` TypeScript interface and enums in `app/src/interfaces/integration.interface.ts`
- [ ] `integrations.service.ts` API client
- [ ] Integrations list page: `app/src/pages/integrations/` — cards per connected integration, status badge
- [ ] Add integration modal: select provider → fill credentials form → test connection → save
- [ ] Integration detail page: list of actions with enable/disable toggles

## Technical Notes
- `config` field in `Integration` must be encrypted before `prisma.integration.create` and decrypted only inside `BaseIntegration.decryptConfig` — never exposed to API responses
- `IntegrationRegistry` is a singleton NestJS `@Injectable({ scope: Scope.DEFAULT })` 
- Tools returned by `getAllTools` follow OpenAI function-calling schema: `{ type: 'function', function: { name, description, parameters } }`
- Tool names must be globally unique across integrations — prefix with provider: `github__create_issue`, `stripe__list_customers`

## Acceptance Criteria
- [ ] Can create an integration with encrypted credentials saved to DB
- [ ] `testConnection` endpoint returns success/failure without exposing credentials
- [ ] Actions are auto-seeded on integration creation
- [ ] Toggling an action updates DB and agent cannot call disabled actions
- [ ] `IntegrationRegistry.getAllTools(orgId)` returns only tools from ACTIVE integrations with enabled actions
