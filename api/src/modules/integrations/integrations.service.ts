import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider, IntegrationStatus } from 'generated/prisma';
import { DATABASE_PROVIDERS } from './databases/database-integration.types';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { IntegrationRegistry } from './framework/registry/integration-registry.service';

const RETAINED_INTEGRATION_PROVIDERS = [
  ...DATABASE_PROVIDERS,
  IntegrationProvider.OPENAPI,
  IntegrationProvider.MCP,
];

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption_service: EncryptionService,
    private readonly integration_registry: IntegrationRegistry,
  ) {}

  async findAll(organizationUuid: string) {
    try {
      const integrations = await this.prisma.integration.findMany({
        where: {
          org_uuid: organizationUuid,
          provider: { in: RETAINED_INTEGRATION_PROVIDERS },
        },
        include: { actions: true, database: true, openapi: true, mcp: true },
        orderBy: { created_at: 'desc' },
      });

      return integrations.map((integration) =>
        this.sanitizeIntegration(integration),
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(organizationUuid: string, integrationUuid: string) {
    try {
      const integration = await this.prisma.integration.findFirst({
        where: {
          uuid: integrationUuid,
          org_uuid: organizationUuid,
          provider: { in: RETAINED_INTEGRATION_PROVIDERS },
        },
        include: { actions: true, database: true, openapi: true, mcp: true },
      });

      if (!integration) {
        throw new NotFoundException('Integration not found');
      }

      return this.sanitizeIntegration(integration);
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    organizationUuid: string,
    integrationUuid: string,
    dto: UpdateIntegrationDto,
  ) {
    try {
      await this.requireIntegration(organizationUuid, integrationUuid);

      const integration = await this.prisma.integration.update({
        where: { uuid: integrationUuid },
        data: {
          name: dto.name,
          description: dto.description,
          status: dto.status,
          metadata: dto.metadata,
          ...(dto.config
            ? {
                config: this.encryption_service.encrypt(
                  JSON.stringify(dto.config),
                ),
              }
            : {}),
        },
      });

      return this.sanitizeIntegration(integration);
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(organizationUuid: string, integrationUuid: string) {
    try {
      await this.requireIntegration(organizationUuid, integrationUuid);
      return await this.prisma.integration.delete({
        where: { uuid: integrationUuid },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async testConnection(organizationUuid: string, integrationUuid: string) {
    try {
      const integration = await this.requireIntegration(
        organizationUuid,
        integrationUuid,
      );
      const handler = this.integration_registry.getByProvider(
        integration.provider,
      );
      const config = JSON.parse(
        this.encryption_service.decrypt(integration.config),
      );

      return { success: await handler.testConnection(config) };
    } catch (error) {
      this.handleError(error);
    }
  }

  async getEnabledTools(organizationUuid: string) {
    try {
      return await this.integration_registry.getAllTools(organizationUuid);
    } catch (error) {
      this.handleError(error);
    }
  }

  private async requireIntegration(
    organizationUuid: string,
    integrationUuid: string,
  ) {
    const integration = await this.prisma.integration.findFirst({
      where: {
        uuid: integrationUuid,
        org_uuid: organizationUuid,
        provider: { in: RETAINED_INTEGRATION_PROVIDERS },
      },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return integration;
  }

  private sanitizeIntegration<
    T extends { config?: string; database?: any; openapi?: any; mcp?: any },
  >(integration: T) {
    const {
      config: _config,
      database,
      openapi,
      mcp,
      ...safe_integration
    } = integration;

    if (!database && !openapi && !mcp) {
      return safe_integration;
    }

    const safe_database = database
      ? (() => {
          const { connection_string: _connection_string, ...rest } = database;
          return rest;
        })()
      : undefined;
    const safe_openapi = openapi
      ? (() => {
          const { auth_config: _auth_config, ...rest } = openapi;
          return rest;
        })()
      : undefined;
    const safe_mcp = mcp
      ? (() => {
          const { auth_config: _auth_config, ...rest } = mcp;
          return rest;
        })()
      : undefined;

    return {
      ...safe_integration,
      ...(database ? { database: safe_database } : {}),
      ...(openapi ? { openapi: safe_openapi } : {}),
      ...(mcp ? { mcp: safe_mcp } : {}),
    };
  }

  private handleError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : 'Unexpected integration error';
    throw new BadRequestException(message);
  }
}
