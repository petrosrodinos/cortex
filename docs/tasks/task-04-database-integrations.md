# Task: Database Integrations — PostgreSQL, MySQL, MongoDB

## Objective
Allow organizations to connect their own databases. The platform should introspect schema, keep it cached (refreshed before each query), and expose safe AI-callable query tools scoped to allowed operations.

## Requirements
- Support PostgreSQL, MySQL, MongoDB
- Connection strings are encrypted at rest
- Schema introspection runs at connect time and can be triggered manually
- The AI receives the schema as structured context before generating queries
- Allowed operations are configurable: READ, INSERT, UPDATE, DELETE
- Multiple databases per org (each is a separate `Integration` row + `DatabaseIntegration` row)

## Subtasks

### Backend

- [ ] Prisma schema
  - Add `DatabaseIntegration` model (see plan.md domain model)
  - Run `prisma migrate dev`

- [ ] Database adapter interface (`api/src/modules/integrations/databases/db-adapter.interface.ts`)
  ```typescript
  interface IDbAdapter {
    testConnection(): Promise<boolean>
    introspectSchema(): Promise<DatabaseSchema>
    executeQuery(sql: string, params?: any[]): Promise<QueryResult>
  }
  ```

- [ ] `DatabaseSchema` type
  ```typescript
  interface DatabaseSchema {
    tables: Array<{
      name: string
      columns: Array<{ name: string; type: string; nullable: boolean; primaryKey: boolean }>
    }>
  }
  ```

- [ ] PostgreSQL adapter (`api/src/modules/integrations/databases/adapters/postgres.adapter.ts`)
  - Use `pg` package
  - `introspectSchema`: query `information_schema.columns` filtered by `table_schema = 'public'`
  - `executeQuery`: use parameterized queries, enforce read-only connection pool for READ-only configs

- [ ] MySQL adapter (`api/src/modules/integrations/databases/adapters/mysql.adapter.ts`)
  - Use `mysql2/promise`
  - `introspectSchema`: query `information_schema.columns`

- [ ] MongoDB adapter (`api/src/modules/integrations/databases/adapters/mongo.adapter.ts`)
  - Use `mongodb` driver
  - `introspectSchema`: sample 100 docs per collection to infer field types (best-effort)
  - `executeQuery`: accept aggregation pipeline JSON (instead of SQL)

- [ ] `DatabaseIntegration` NestJS integration class (`api/src/modules/integrations/databases/database.integration.ts`)
  - Extends `BaseIntegration`
  - `getTools()`: returns tools based on allowed operations:
    - `db__query` — execute SQL/aggregation (always available if READ allowed)
    - `db__insert` — insert row (if INSERT allowed)
    - `db__update` — update rows (if UPDATE allowed)
    - `db__delete` — delete rows (if DELETE allowed)
    - `db__get_schema` — always available (returns current schema cache)
  - `executeTool`: instantiates the right adapter from `db_type`, executes, returns result
  - Before any query: refresh `schema_cache` if `last_schema_sync` > 1 hour ago

- [ ] `DatabaseIntegrationsService`
  - `create(orgId, dto)`: encrypt connection string, create `Integration` + `DatabaseIntegration`, run initial schema sync
  - `syncSchema(id)`: refresh schema_cache and `last_schema_sync`
  - `testConnection(id)`: adapter.testConnection()

- [ ] Query safety layer
  - For SQL databases, block dangerous patterns: `DROP`, `TRUNCATE`, `ALTER`, `CREATE`, `GRANT`
  - Check against `allowed_ops` before executing write operations
  - Enforce query timeout (10 seconds default)

- [ ] Register `DatabaseIntegrationsModule` in `SaasIntegrationsModule` (or its own `DatabaseIntegrationsModule` imported by `IntegrationsModule`)

### Frontend

- [ ] Database integration config form:
  - Select db type (PG / MySQL / MongoDB)
  - Connection string input (password-masked)
  - Allowed operations checkboxes
  - Test connection button shows schema preview on success
- [ ] Schema viewer: collapsible tree of tables/collections and columns
- [ ] Manual "Sync Schema" button on integration detail page

## Technical Notes
- Connection pools should be created lazily and cached per `integration_id` using a WeakMap or Map in the adapter factory — don't create a new pool on every tool call
- MongoDB schema inference: group by field name, show all observed types (e.g. `{ type: 'string | number' }`)
- Provide schema to AI agent as a formatted string: "Table: users, Columns: id(int PK), email(varchar), ..."
- SQL injection prevention: all user-provided values must go through parameterized queries, never string interpolation
- Read-only PG connection: use a pg Pool with a read-only PostgreSQL user if the org only allows READ

## Acceptance Criteria
- [ ] Can connect to a real PostgreSQL, MySQL, and MongoDB instance
- [ ] Schema is introspected and stored on first connect
- [ ] `db__get_schema` tool returns formatted schema description
- [ ] `db__query` executes a SELECT and returns rows
- [ ] Blocked SQL patterns (DROP, etc.) return an error without executing
- [ ] Manual sync refreshes `schema_cache` in DB
