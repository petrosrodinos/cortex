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

export interface CreateDatabaseIntegrationDto {
  name: string;
  description?: string;
  provider: 'DATABASE_PG' | 'DATABASE_MYSQL' | 'DATABASE_MONGO';
  connectionString: string;
  allowedOps: DatabaseOperation[];
}

export interface TestDatabaseConnectionDto {
  provider: 'DATABASE_PG' | 'DATABASE_MYSQL' | 'DATABASE_MONGO';
  connectionString: string;
}

export interface TestDatabaseConnectionResponse {
  success: boolean;
  schema: DatabaseSchema;
  schema_text: string;
}
