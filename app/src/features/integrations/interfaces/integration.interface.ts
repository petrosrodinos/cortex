export const IntegrationProviders = {
  GITHUB: 'GITHUB',
  SLACK: 'SLACK',
  STRIPE: 'STRIPE',
  HUBSPOT: 'HUBSPOT',
  LINEAR: 'LINEAR',
  NOTION: 'NOTION',
  GOOGLE_DRIVE: 'GOOGLE_DRIVE',
  SMTP: 'SMTP',
  GMAIL: 'GMAIL',
  POSTHOG: 'POSTHOG',
  INTERCOM: 'INTERCOM',
  DATABASE_PG: 'DATABASE_PG',
  DATABASE_MYSQL: 'DATABASE_MYSQL',
  DATABASE_MONGO: 'DATABASE_MONGO',
  OPENAPI: 'OPENAPI',
} as const;

export type IntegrationProvider = (typeof IntegrationProviders)[keyof typeof IntegrationProviders];

export const IntegrationStatuses = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ERROR: 'ERROR',
} as const;

export type IntegrationStatus = (typeof IntegrationStatuses)[keyof typeof IntegrationStatuses];

export const DatabaseOperations = {
  READ: 'READ',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;

export type DatabaseOperation = (typeof DatabaseOperations)[keyof typeof DatabaseOperations];

export const DatabaseTypes = {
  POSTGRESQL: 'POSTGRESQL',
  MYSQL: 'MYSQL',
  MONGODB: 'MONGODB',
} as const;

export type DatabaseType = (typeof DatabaseTypes)[keyof typeof DatabaseTypes];

export const OpenApiAuthTypes = {
  NONE: 'NONE',
  API_KEY: 'API_KEY',
  BEARER: 'BEARER',
  OAUTH2: 'OAUTH2',
  CUSTOM_HEADERS: 'CUSTOM_HEADERS',
} as const;

export type OpenApiAuthType = (typeof OpenApiAuthTypes)[keyof typeof OpenApiAuthTypes];

export interface DatabaseColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}

export interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
}

export interface DatabaseSchema {
  tables: DatabaseTable[];
}

export interface DatabaseIntegrationDetails {
  uuid: string;
  integration_uuid: string;
  db_type: DatabaseType;
  schema_cache?: DatabaseSchema | null;
  schema_text?: string;
  allowed_ops: DatabaseOperation[];
  last_schema_sync?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GeneratedOpenApiTool {
  key: string;
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  operation: Record<string, unknown>;
}

export interface OpenApiIntegrationDetails {
  uuid: string;
  integration_uuid: string;
  spec_url?: string | null;
  spec_json?: Record<string, unknown>;
  base_url: string;
  auth_type: OpenApiAuthType;
  generated_tools: GeneratedOpenApiTool[];
  created_at?: string;
  updated_at?: string;
}

export interface IntegrationAction {
  id: number;
  uuid: string;
  integration_uuid: string;
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  required_permission_key?: string | null;
}

export interface Integration {
  id: number;
  uuid: string;
  org_uuid: string;
  name: string;
  description?: string | null;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  metadata?: Record<string, unknown> | null;
  database?: DatabaseIntegrationDetails | null;
  openapi?: OpenApiIntegrationDetails | null;
  created_at: string;
  updated_at: string;
  actions?: IntegrationAction[];
}

export interface CreateIntegrationDto {
  name: string;
  description?: string;
  provider: IntegrationProvider;
  config: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface UpdateIntegrationDto {
  name?: string;
  description?: string | null;
  status?: IntegrationStatus;
  config?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ToggleIntegrationActionDto {
  enabled: boolean;
}

export interface TestIntegrationResponse {
  success: boolean;
}

export interface CreateDatabaseIntegrationDto {
  name: string;
  description?: string;
  provider: Extract<IntegrationProvider, 'DATABASE_PG' | 'DATABASE_MYSQL' | 'DATABASE_MONGO'>;
  connectionString: string;
  allowedOps: DatabaseOperation[];
}

export interface TestDatabaseConnectionDto {
  provider: Extract<IntegrationProvider, 'DATABASE_PG' | 'DATABASE_MYSQL' | 'DATABASE_MONGO'>;
  connectionString: string;
}

export interface TestDatabaseConnectionResponse {
  success: boolean;
  schema: DatabaseSchema;
  schema_text: string;
}

export interface ParseOpenApiSpecDto {
  specUrl?: string;
  rawJson?: string | Record<string, unknown>;
}

export interface ParseOpenApiSpecResponse {
  baseUrl: string;
  operationsCount: number;
  securitySchemes: Record<string, unknown>;
  inferredAuthType: OpenApiAuthType;
}

export interface CreateOpenApiIntegrationDto {
  name: string;
  description?: string;
  specUrl?: string;
  rawJson?: string | Record<string, unknown>;
  authType?: OpenApiAuthType;
  authConfig?: Record<string, unknown>;
  credentials?: Record<string, unknown>;
}
