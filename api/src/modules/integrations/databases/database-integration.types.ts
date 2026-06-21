import { DatabaseOperation, DatabaseType, IntegrationProvider } from 'generated/prisma';
import { DatabaseSchema } from './adapters/interfaces/db-adapter.interface';

export const DATABASE_PROVIDERS = [
  IntegrationProvider.DATABASE_PG,
  IntegrationProvider.DATABASE_MYSQL,
  IntegrationProvider.DATABASE_MONGO,
] as const;

export const DEFAULT_DATABASE_ALLOWED_OPS = [DatabaseOperation.READ];

export function databaseActionKeyToOperation(
  actionKey: string,
): DatabaseOperation | null {
  switch (actionKey) {
    case 'query':
      return DatabaseOperation.READ;
    case 'insert':
      return DatabaseOperation.INSERT;
    case 'update':
      return DatabaseOperation.UPDATE;
    case 'delete':
      return DatabaseOperation.DELETE;
    default:
      return null;
  }
}

export function isDatabaseActionEnabledForOps(
  actionKey: string,
  allowedOps: DatabaseOperation[],
): boolean {
  if (actionKey === 'get_schema') {
    return true;
  }

  const operation = databaseActionKeyToOperation(actionKey);
  return operation !== null && allowedOps.includes(operation);
}

const DATABASE_ACTION_KEYS = [
  'get_schema',
  'query',
  'insert',
  'update',
  'delete',
] as const;

export function getEffectiveDatabaseActionKeys(
  allowedOps: DatabaseOperation[],
): string[] {
  return DATABASE_ACTION_KEYS.filter((key) =>
    isDatabaseActionEnabledForOps(key, allowedOps),
  );
}

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
