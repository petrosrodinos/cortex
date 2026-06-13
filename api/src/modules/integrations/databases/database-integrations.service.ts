import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { DatabaseOperation, IntegrationStatus, Prisma } from 'generated/prisma';
import { IntegrationRegistry } from '../framework/integration-registry.service';
import { DatabaseAdapterFactory } from './adapters/database-adapter.factory';
import { formatDatabaseSchema } from './database-schema.formatter';
import {
  DATABASE_PROVIDERS,
  DEFAULT_DATABASE_ALLOWED_OPS,
  providerToDatabaseType,
} from './database-integration.types';
import { CreateDatabaseIntegrationDto } from './dto/create-database-integration.dto';
import { TestDatabaseConnectionDto } from './dto/test-database-connection.dto';

@Injectable()
export class DatabaseIntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService,
    private readonly adapterFactory: DatabaseAdapterFactory,
    private readonly integrationRegistry: IntegrationRegistry,
  ) {}

  async create(organizationUuid: string, dto: CreateDatabaseIntegrationDto) {
    try {
      this.assertDatabaseProvider(dto.provider);
      const dbType = providerToDatabaseType(dto.provider);
      const allowedOps = normalizeAllowedOps(dto.allowedOps);
      const adapter = await this.adapterFactory.getAdapter(`draft:${dbType}:${dto.connectionString}`, dbType, dto.connectionString);

      await adapter.testConnection();
      const schema = await adapter.introspectSchema();

      const integration = await this.prisma.$transaction(async (tx) => {
        const created = await tx.integration.create({
          data: {
            org_uuid: organizationUuid,
            name: dto.name,
            description: dto.description,
            provider: dto.provider,
            status: IntegrationStatus.ACTIVE,
            config: this.encryptionService.encrypt(JSON.stringify({})),
          },
        });

        await tx.databaseIntegration.create({
          data: {
            integration_uuid: created.uuid,
            db_type: dbType,
            connection_string: this.encryptionService.encrypt(dto.connectionString),
            allowed_ops: allowedOps,
            schema_cache: schema as unknown as Prisma.InputJsonValue,
            last_schema_sync: new Date(),
          },
        });

        const handler = this.integrationRegistry.getByProvider(dto.provider);
        const defaultActions = handler.defaultActions?.() ?? [];

        if (defaultActions.length) {
          await tx.integrationAction.createMany({
            data: defaultActions.map((action) => ({
              integration_uuid: created.uuid,
              key: action.key,
              label: action.label,
              description: action.description,
              enabled: action.key === 'get_schema' || allowedOps.includes(action.key.toUpperCase() as DatabaseOperation),
              required_permission_key: action.required_permission_key,
            })),
            skipDuplicates: true,
          });
        }

        return await tx.integration.findUniqueOrThrow({
          where: { uuid: created.uuid },
          include: { actions: true, database: true },
        });
      });

      return this.sanitizeDatabaseIntegration(integration);
    } catch (error) {
      this.handleError(error);
    }
  }

  async testDraftConnection(dto: TestDatabaseConnectionDto) {
    try {
      this.assertDatabaseProvider(dto.provider);
      const dbType = providerToDatabaseType(dto.provider);
      const adapter = await this.adapterFactory.getAdapter(`draft:${dbType}:${dto.connectionString}`, dbType, dto.connectionString);

      await adapter.testConnection();
      const schema = await adapter.introspectSchema();

      return {
        success: true,
        schema,
        schema_text: formatDatabaseSchema(schema),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async getDetails(organizationUuid: string, integrationUuid: string) {
    try {
      const integration = await this.requireDatabaseIntegration(organizationUuid, integrationUuid);
      return this.sanitizeDatabaseIntegration(integration);
    } catch (error) {
      this.handleError(error);
    }
  }

  async syncSchema(organizationUuid: string, integrationUuid: string) {
    try {
      const integration = await this.requireDatabaseIntegration(organizationUuid, integrationUuid);
      const database = integration.database;

      if (!database) {
        throw new NotFoundException('Database integration not found');
      }

      const adapter = await this.adapterFactory.getAdapter(
        database.integration_uuid,
        database.db_type,
        this.encryptionService.decrypt(database.connection_string),
      );
      const schema = await adapter.introspectSchema();
      const updated = await this.prisma.databaseIntegration.update({
        where: { integration_uuid: integrationUuid },
        data: {
          schema_cache: schema as unknown as Prisma.InputJsonValue,
          last_schema_sync: new Date(),
        },
      });

      return {
        ...updated,
        connection_string: undefined,
        schema_text: formatDatabaseSchema(schema),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async testConnection(organizationUuid: string, integrationUuid: string) {
    try {
      const integration = await this.requireDatabaseIntegration(organizationUuid, integrationUuid);
      const database = integration.database;

      if (!database) {
        throw new NotFoundException('Database integration not found');
      }

      const adapter = await this.adapterFactory.getAdapter(
        database.integration_uuid,
        database.db_type,
        this.encryptionService.decrypt(database.connection_string),
      );

      return { success: await adapter.testConnection() };
    } catch (error) {
      this.handleError(error);
    }
  }

  private async requireDatabaseIntegration(organizationUuid: string, integrationUuid: string) {
    const integration = await this.prisma.integration.findFirst({
      where: {
        uuid: integrationUuid,
        org_uuid: organizationUuid,
        provider: { in: [...DATABASE_PROVIDERS] },
      },
      include: { actions: true, database: true },
    });

    if (!integration) {
      throw new NotFoundException('Database integration not found');
    }

    return integration;
  }

  private sanitizeDatabaseIntegration(integration: any) {
    const { config: _config, database, ...safeIntegration } = integration;

    return {
      ...safeIntegration,
      database: database
        ? {
            uuid: database.uuid,
            integration_uuid: database.integration_uuid,
            db_type: database.db_type,
            schema_cache: database.schema_cache,
            schema_text: formatDatabaseSchema(database.schema_cache),
            allowed_ops: database.allowed_ops,
            last_schema_sync: database.last_schema_sync,
            created_at: database.created_at,
            updated_at: database.updated_at,
          }
        : null,
    };
  }

  private assertDatabaseProvider(provider: any) {
    if (!DATABASE_PROVIDERS.includes(provider)) {
      throw new BadRequestException('Provider must be DATABASE_PG, DATABASE_MYSQL, or DATABASE_MONGO');
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unexpected database integration error';
    throw new BadRequestException(message);
  }
}

function normalizeAllowedOps(allowedOps?: DatabaseOperation[]) {
  const unique = new Set([...(allowedOps?.length ? allowedOps : DEFAULT_DATABASE_ALLOWED_OPS), DatabaseOperation.READ]);
  return Array.from(unique);
}
