import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { DatabaseOperation, DatabaseType, Integration, IntegrationProvider } from 'generated/prisma';
import { AiTool, IntegrationActionSeed } from '../framework/interfaces/ai-tool.interface';
import { BaseIntegration } from '../framework/base/base-integration';
import { DatabaseAdapterFactory } from './adapters/factory/database-adapter.factory';
import { MongoAdapter } from './adapters/mongo/mongo.adapter';
import { assertSqlQueryAllowed } from './database-query-safety';
import { formatDatabaseSchema } from './database-schema.formatter';
import { DatabaseSchema } from './adapters/interfaces/db-adapter.interface';

const ONE_HOUR_MS = 60 * 60 * 1000;

type DatabaseIntegrationRecord = {
  integration_uuid: string;
  db_type: DatabaseType;
  connection_string: string;
  allowed_ops: DatabaseOperation[];
  schema_cache?: DatabaseSchema | null;
  last_schema_sync?: Date | null;
};

const querySchema = z.object({
  integration_uuid: z.string().optional(),
  query: z.string().min(1),
  params: z.array(z.any()).optional(),
});

const getSchemaSchema = z.object({
  integration_uuid: z.string().optional(),
});

const insertSchema = z.object({
  integration_uuid: z.string().optional(),
  table: z.string().min(1).optional(),
  collection: z.string().min(1).optional(),
  values: z.record(z.string(), z.any()).optional(),
  document: z.record(z.string(), z.any()).optional(),
});

const updateSchema = z.object({
  integration_uuid: z.string().optional(),
  table: z.string().min(1).optional(),
  collection: z.string().min(1).optional(),
  values: z.record(z.string(), z.any()).optional(),
  filter: z.record(z.string(), z.any()).optional(),
  update: z.record(z.string(), z.any()).optional(),
  where: z.record(z.string(), z.any()).optional(),
});

const deleteSchema = z.object({
  integration_uuid: z.string().optional(),
  table: z.string().min(1).optional(),
  collection: z.string().min(1).optional(),
  filter: z.record(z.string(), z.any()).optional(),
  where: z.record(z.string(), z.any()).optional(),
});

@Injectable()
export class DatabaseIntegration extends BaseIntegration {
  readonly provider: IntegrationProvider = IntegrationProvider.DATABASE_PG;

  constructor(
    prisma: PrismaService,
    encryptionService: EncryptionService,
    private readonly adapterFactory: DatabaseAdapterFactory,
  ) {
    super(prisma, encryptionService);
  }

  defaultActions(): IntegrationActionSeed[] {
    return [
      {
        key: 'get_schema',
        label: 'Get database schema',
        description: 'Return the cached database schema and AI-ready schema text.',
      },
      {
        key: 'query',
        label: 'Query database',
        description: 'Execute a read query against the selected database integration.',
      },
      {
        key: 'insert',
        label: 'Insert database row',
        description: 'Insert a row or document into the selected database integration.',
      },
      {
        key: 'update',
        label: 'Update database rows',
        description: 'Update rows or documents in the selected database integration.',
      },
      {
        key: 'delete',
        label: 'Delete database rows',
        description: 'Delete rows or documents from the selected database integration.',
      },
    ];
  }

  buildToolDefinitions(integration: Integration): AiTool[] {
    return this.getTools(integration);
  }

  getTools(integration: Integration & { database?: Pick<DatabaseIntegrationRecord, 'allowed_ops' | 'schema_cache'> | null }): AiTool[] {
    const allowedOps = integration.database?.allowed_ops ?? [DatabaseOperation.READ];
    const schemaText = formatDatabaseSchema(integration.database?.schema_cache);
    const tools: AiTool[] = [
      this.tool('get_schema', 'Return the cached schema for a connected database integration.', getSchemaParameters()),
    ];

    if (allowedOps.includes(DatabaseOperation.READ)) {
      tools.push(
        this.tool(
          'query',
          `Execute a safe read query. Current schema:\n${schemaText}`,
          queryParameters(),
        ),
      );
    }

    if (allowedOps.includes(DatabaseOperation.INSERT)) {
      tools.push(this.tool('insert', 'Insert a row or document using structured values.', insertParameters()));
    }

    if (allowedOps.includes(DatabaseOperation.UPDATE)) {
      tools.push(this.tool('update', 'Update rows or documents using structured filters and values.', updateParameters()));
    }

    if (allowedOps.includes(DatabaseOperation.DELETE)) {
      tools.push(this.tool('delete', 'Delete rows or documents using structured filters.', deleteParameters()));
    }

    return tools;
  }

  async testConnection(config: Record<string, any>): Promise<boolean> {
    const dbType = config.dbType as DatabaseType | undefined;
    const connectionString = config.connectionString as string | undefined;

    if (!dbType || !connectionString) {
      return false;
    }

    const adapter = await this.adapterFactory.getAdapter(`draft:${dbType}:${connectionString}`, dbType, connectionString);
    return await adapter.testConnection();
  }

  async executeTool(toolName: string, input: Record<string, any>, integration: Integration): Promise<any> {
    try {
      const actionKey = this.resolveActionKey(toolName);
      await this.validateAction(integration, toolName);
      const database = await this.requireDatabaseIntegration(integration.uuid);
      const adapter = await this.adapterFactory.getAdapter(
        database.integration_uuid,
        database.db_type,
        this.encryption_service.decrypt(database.connection_string),
      );

      if (actionKey === 'get_schema') {
        return {
          schema: database.schema_cache ?? { tables: [] },
          schema_text: formatDatabaseSchema(database.schema_cache),
          last_schema_sync: database.last_schema_sync,
        };
      }

      const freshDatabase = await this.refreshSchemaIfStale(database, adapter);

      if (actionKey === 'query') {
        const parsed = querySchema.parse(input ?? {});
        this.requireOperation(freshDatabase, DatabaseOperation.READ);

        if (freshDatabase.db_type !== DatabaseType.MONGODB) {
          assertSqlQueryAllowed(parsed.query, freshDatabase.allowed_ops);
        }

        return await adapter.executeQuery(parsed.query, parsed.params ?? []);
      }

      if (actionKey === 'insert') {
        return await this.executeInsert(input, freshDatabase, adapter);
      }

      if (actionKey === 'update') {
        return await this.executeUpdate(input, freshDatabase, adapter);
      }

      if (actionKey === 'delete') {
        return await this.executeDelete(input, freshDatabase, adapter);
      }

      throw new BadRequestException(`Unsupported database action: ${actionKey}`);
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }

      return { success: false, error: 'Database tool execution failed' };
    }
  }

  protected resolveActionKey(toolName: string) {
    if (toolName.startsWith('db__')) {
      return toolName.slice('db__'.length);
    }

    return super.resolveActionKey(toolName);
  }

  private async requireDatabaseIntegration(integrationUuid: string): Promise<DatabaseIntegrationRecord> {
    const database = await this.prisma.databaseIntegration.findUnique({
      where: { integration_uuid: integrationUuid },
    });

    if (!database) {
      throw new BadRequestException('Database integration configuration was not found');
    }

    return database as unknown as DatabaseIntegrationRecord;
  }

  private async refreshSchemaIfStale(database: DatabaseIntegrationRecord, adapter: any): Promise<DatabaseIntegrationRecord> {
    const lastSync = database.last_schema_sync?.getTime() ?? 0;

    if (database.schema_cache && Date.now() - lastSync <= ONE_HOUR_MS) {
      return database;
    }

    const schema = await adapter.introspectSchema();
    await this.prisma.databaseIntegration.update({
      where: { integration_uuid: database.integration_uuid },
      data: { schema_cache: schema, last_schema_sync: expectDate() },
    });

    return { ...database, schema_cache: schema, last_schema_sync: new Date() };
  }

  private async executeInsert(input: Record<string, any>, database: DatabaseIntegrationRecord, adapter: any) {
    this.requireOperation(database, DatabaseOperation.INSERT);
    const parsed = insertSchema.parse(input ?? {});

    if (database.db_type === DatabaseType.MONGODB) {
      this.requireMongoAdapter(adapter);
      return await adapter.insert(parsed.collection ?? requiredName(parsed.table, 'collection'), parsed.document ?? parsed.values ?? {});
    }

    const table = requiredName(parsed.table, 'table');
    const values = requiredRecord(parsed.values, 'values');
    const columns = Object.keys(values).map((column) => quoteIdentifier(column, database.db_type));
    const params = Object.values(values);
    const placeholders = params.map((_value, index) => parameterPlaceholder(database.db_type, index)).join(', ');
    const sql = `insert into ${quoteIdentifier(table, database.db_type)} (${columns.join(', ')}) values (${placeholders})`;

    assertSqlQueryAllowed(sql, database.allowed_ops);
    return await adapter.executeQuery(sql, params);
  }

  private async executeUpdate(input: Record<string, any>, database: DatabaseIntegrationRecord, adapter: any) {
    this.requireOperation(database, DatabaseOperation.UPDATE);
    const parsed = updateSchema.parse(input ?? {});

    if (database.db_type === DatabaseType.MONGODB) {
      this.requireMongoAdapter(adapter);
      return await adapter.update(
        parsed.collection ?? requiredName(parsed.table, 'collection'),
        parsed.filter ?? parsed.where ?? {},
        parsed.update ?? { $set: parsed.values ?? {} },
      );
    }

    const table = requiredName(parsed.table, 'table');
    const values = requiredRecord(parsed.values, 'values');
    const where = requiredRecord(parsed.where, 'where');
    const assignments = Object.keys(values).map(
      (column, index) => `${quoteIdentifier(column, database.db_type)} = ${parameterPlaceholder(database.db_type, index)}`,
    );
    const whereClauses = Object.keys(where).map(
      (column, index) =>
        `${quoteIdentifier(column, database.db_type)} = ${parameterPlaceholder(database.db_type, index + assignments.length)}`,
    );
    const sql = `update ${quoteIdentifier(table, database.db_type)} set ${assignments.join(', ')} where ${whereClauses.join(' and ')}`;

    assertSqlQueryAllowed(sql, database.allowed_ops);
    return await adapter.executeQuery(sql, [...Object.values(values), ...Object.values(where)]);
  }

  private async executeDelete(input: Record<string, any>, database: DatabaseIntegrationRecord, adapter: any) {
    this.requireOperation(database, DatabaseOperation.DELETE);
    const parsed = deleteSchema.parse(input ?? {});

    if (database.db_type === DatabaseType.MONGODB) {
      this.requireMongoAdapter(adapter);
      return await adapter.delete(parsed.collection ?? requiredName(parsed.table, 'collection'), parsed.filter ?? parsed.where ?? {});
    }

    const table = requiredName(parsed.table, 'table');
    const where = requiredRecord(parsed.where, 'where');
    const whereClauses = Object.keys(where).map(
      (column, index) => `${quoteIdentifier(column, database.db_type)} = ${parameterPlaceholder(database.db_type, index)}`,
    );
    const sql = `delete from ${quoteIdentifier(table, database.db_type)} where ${whereClauses.join(' and ')}`;

    assertSqlQueryAllowed(sql, database.allowed_ops);
    return await adapter.executeQuery(sql, Object.values(where));
  }

  private requireOperation(database: DatabaseIntegrationRecord, operation: DatabaseOperation) {
    if (!database.allowed_ops.includes(operation)) {
      throw new ForbiddenException(`${operation} operation is not allowed for this database integration`);
    }
  }

  private requireMongoAdapter(adapter: any): asserts adapter is MongoAdapter {
    if (!(adapter instanceof MongoAdapter)) {
      throw new BadRequestException('MongoDB operation requires a MongoDB adapter');
    }
  }

  private tool(actionKey: string, description: string, parameters: Record<string, any>): AiTool {
    return {
      type: 'function',
      function: {
        name: `db__${actionKey}`,
        description,
        parameters,
      },
    };
  }
}

export class PostgresDatabaseIntegration extends DatabaseIntegration {
  readonly provider = IntegrationProvider.DATABASE_PG;

  constructor(prisma: PrismaService, encryptionService: EncryptionService, adapterFactory: DatabaseAdapterFactory) {
    super(prisma, encryptionService, adapterFactory);
  }
}

export class MysqlDatabaseIntegration extends DatabaseIntegration {
  readonly provider = IntegrationProvider.DATABASE_MYSQL;

  constructor(prisma: PrismaService, encryptionService: EncryptionService, adapterFactory: DatabaseAdapterFactory) {
    super(prisma, encryptionService, adapterFactory);
  }
}

export class MongoDatabaseIntegration extends DatabaseIntegration {
  readonly provider = IntegrationProvider.DATABASE_MONGO;

  constructor(prisma: PrismaService, encryptionService: EncryptionService, adapterFactory: DatabaseAdapterFactory) {
    super(prisma, encryptionService, adapterFactory);
  }
}

function queryParameters() {
  return jsonSchema(
    {
      integration_uuid: { type: 'string', description: 'Target database integration UUID. Required when multiple databases exist.' },
      query: { type: 'string', description: 'SQL query or MongoDB aggregation JSON with collection and pipeline.' },
      params: { type: 'array', items: {}, description: 'Parameterized SQL values.' },
    },
    ['query'],
  );
}

function getSchemaParameters() {
  return jsonSchema({
    integration_uuid: { type: 'string', description: 'Target database integration UUID. Required when multiple databases exist.' },
  });
}

function insertParameters() {
  return jsonSchema({
    integration_uuid: { type: 'string' },
    table: { type: 'string' },
    collection: { type: 'string' },
    values: { type: 'object', additionalProperties: true },
    document: { type: 'object', additionalProperties: true },
  });
}

function updateParameters() {
  return jsonSchema({
    integration_uuid: { type: 'string' },
    table: { type: 'string' },
    collection: { type: 'string' },
    values: { type: 'object', additionalProperties: true },
    where: { type: 'object', additionalProperties: true },
    filter: { type: 'object', additionalProperties: true },
    update: { type: 'object', additionalProperties: true },
  });
}

function deleteParameters() {
  return jsonSchema({
    integration_uuid: { type: 'string' },
    table: { type: 'string' },
    collection: { type: 'string' },
    where: { type: 'object', additionalProperties: true },
    filter: { type: 'object', additionalProperties: true },
  });
}

function jsonSchema(properties: Record<string, any> = {}, required: string[] = []) {
  return { type: 'object', properties, required, additionalProperties: false };
}

function quoteIdentifier(identifier: string, dbType: DatabaseType) {
  if (!/^[A-Za-z_][A-Za-z0-9_$]*$/.test(identifier)) {
    throw new BadRequestException(`Invalid database identifier: ${identifier}`);
  }

  return dbType === DatabaseType.MYSQL ? `\`${identifier}\`` : `"${identifier}"`;
}

function parameterPlaceholder(dbType: DatabaseType, index: number) {
  return dbType === DatabaseType.POSTGRESQL ? `$${index + 1}` : '?';
}

function requiredName(value: string | undefined, label: string) {
  if (!value) {
    throw new BadRequestException(`${label} is required`);
  }

  return value;
}

function requiredRecord(value: Record<string, any> | undefined, label: string) {
  if (!value || Object.keys(value).length === 0) {
    throw new BadRequestException(`${label} must contain at least one field`);
  }

  return value;
}

function expectDate() {
  return new Date();
}
