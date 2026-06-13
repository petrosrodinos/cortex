import { DatabaseOperation, DatabaseType, IntegrationProvider } from 'generated/prisma';
import { DatabaseSchema } from './db-adapter.interface';

export const DATABASE_PROVIDERS = [
  IntegrationProvider.DATABASE_PG,
  IntegrationProvider.DATABASE_MYSQL,
  IntegrationProvider.DATABASE_MONGO,
] as const;

export const DEFAULT_DATABASE_ALLOWED_OPS = [DatabaseOperation.READ];

export interface DatabaseIntegrationConfig {
  connectionString: string;
  allowedOps: DatabaseOperation[];
}

export interface DatabaseIntegrationDetails {
  uuid: string;
  integration_uuid: string;
  db_type: DatabaseType;
  allowed_ops: DatabaseOperation[];
  schema_cache?: DatabaseSchema | null;
  schema_text: string;
  last_schema_sync?: Date | string | null;
}

export function providerToDatabaseType(provider: IntegrationProvider): DatabaseType {
  switch (provider) {
    case IntegrationProvider.DATABASE_PG:
      return DatabaseType.POSTGRESQL;
    case IntegrationProvider.DATABASE_MYSQL:
      return DatabaseType.MYSQL;
    case IntegrationProvider.DATABASE_MONGO:
      return DatabaseType.MONGODB;
    default:
      throw new Error(`Provider ${provider} is not a database provider`);
  }
}

export function databaseTypeToProvider(type: DatabaseType): IntegrationProvider {
  switch (type) {
    case DatabaseType.POSTGRESQL:
      return IntegrationProvider.DATABASE_PG;
    case DatabaseType.MYSQL:
      return IntegrationProvider.DATABASE_MYSQL;
    case DatabaseType.MONGODB:
      return IntegrationProvider.DATABASE_MONGO;
  }
}
