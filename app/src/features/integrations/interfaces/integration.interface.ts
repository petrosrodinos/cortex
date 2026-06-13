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
