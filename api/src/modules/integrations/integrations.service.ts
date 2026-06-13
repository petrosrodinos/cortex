import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationStatus } from 'generated/prisma';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { IntegrationRegistry } from './framework/integration-registry.service';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption_service: EncryptionService,
    private readonly integration_registry: IntegrationRegistry,
  ) {}

  async create(organizationUuid: string, dto: CreateIntegrationDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const integration = await tx.integration.create({
          data: {
            org_uuid: organizationUuid,
            name: dto.name,
            description: dto.description,
            provider: dto.provider,
            status: IntegrationStatus.ACTIVE,
            config: this.encryption_service.encrypt(JSON.stringify(dto.config)),
            metadata: dto.metadata,
          },
        });
        const handler = this.integration_registry.getByProvider(dto.provider);
        const default_actions = handler.defaultActions?.() ?? [];

        if (default_actions.length > 0) {
          await tx.integrationAction.createMany({
            data: default_actions.map((action) => ({
              integration_uuid: integration.uuid,
              key: action.key,
              label: action.label,
              description: action.description,
              enabled: action.enabled ?? true,
              required_permission_key: action.required_permission_key,
            })),
            skipDuplicates: true,
          });
        }

        return this.sanitizeIntegration(integration);
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(organizationUuid: string) {
    try {
      const integrations = await this.prisma.integration.findMany({
        where: { org_uuid: organizationUuid },
        include: { actions: true },
        orderBy: { created_at: 'desc' },
      });

      return integrations.map((integration) => this.sanitizeIntegration(integration));
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(organizationUuid: string, integrationUuid: string) {
    try {
      const integration = await this.prisma.integration.findFirst({
        where: { uuid: integrationUuid, org_uuid: organizationUuid },
        include: { actions: true },
      });

      if (!integration) {
        throw new NotFoundException('Integration not found');
      }

      return this.sanitizeIntegration(integration);
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(organizationUuid: string, integrationUuid: string, dto: UpdateIntegrationDto) {
    try {
      await this.requireIntegration(organizationUuid, integrationUuid);

      const integration = await this.prisma.integration.update({
        where: { uuid: integrationUuid },
        data: {
          name: dto.name,
          description: dto.description,
          status: dto.status,
          metadata: dto.metadata,
          ...(dto.config ? { config: this.encryption_service.encrypt(JSON.stringify(dto.config)) } : {}),
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
      return await this.prisma.integration.delete({ where: { uuid: integrationUuid } });
    } catch (error) {
      this.handleError(error);
    }
  }

  async testConnection(organizationUuid: string, integrationUuid: string) {
    try {
      const integration = await this.requireIntegration(organizationUuid, integrationUuid);
      const handler = this.integration_registry.getByProvider(integration.provider);
      const config = JSON.parse(this.encryption_service.decrypt(integration.config));

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

  private async requireIntegration(organizationUuid: string, integrationUuid: string) {
    const integration = await this.prisma.integration.findFirst({
      where: { uuid: integrationUuid, org_uuid: organizationUuid },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return integration;
  }

  private sanitizeIntegration<T extends { config?: string }>(integration: T) {
    const { config: _config, ...safe_integration } = integration;
    return safe_integration;
  }

  private handleError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unexpected integration error';
    throw new BadRequestException(message);
  }
}
