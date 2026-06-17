import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider, IntegrationStatus, OpenApiAuthType, Prisma } from 'generated/prisma';
import { OpenApiAuthService } from '../auth/openapi-auth.service';
import { CreateOpenApiIntegrationDto } from '../dto/create-openapi-integration.dto';
import { ParseOpenApiSpecDto } from '../dto/parse-openapi-spec.dto';
import { OpenApiParserService } from '../parser/openapi-parser.service';
import { ToolGeneratorService } from '../tools/tool-generator.service';

@Injectable()
export class OpenApiIntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryptionService: EncryptionService,
    private readonly parser: OpenApiParserService,
    private readonly generator: ToolGeneratorService,
    private readonly authService: OpenApiAuthService,
  ) {}

  async parsePreview(dto: ParseOpenApiSpecDto) {
    try {
      const parsed = await this.parser.parse({ specUrl: dto.specUrl, rawJson: dto.rawJson });
      const authConfig = this.authService.inferAuthConfig(parsed.securitySchemes);

      return {
        baseUrl: parsed.baseUrl,
        operationsCount: parsed.operations.length,
        securitySchemes: parsed.securitySchemes,
        inferredAuthType: authConfig.type,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(organizationUuid: string, dto: CreateOpenApiIntegrationDto) {
    try {
      const parsed = await this.parser.parse({ specUrl: dto.specUrl, rawJson: dto.rawJson });
      const authConfig = this.authService.inferAuthConfig(parsed.securitySchemes, {
        ...(dto.authConfig ?? {}),
        type: dto.authType ?? dto.authConfig?.type,
      } as any);
      const credentials = dto.credentials ?? {};

      const integration = await this.prisma.$transaction(async (tx) => {
        const created = await tx.integration.create({
          data: {
            org_uuid: organizationUuid,
            name: dto.name,
            description: dto.description,
            provider: IntegrationProvider.OPENAPI,
            status: IntegrationStatus.ACTIVE,
            config: this.encryptionService.encrypt(JSON.stringify(credentials)),
          },
        });
        const tools = this.generator.generateTools(parsed, created.uuid);

        await tx.openApiIntegration.create({
          data: {
            integration_uuid: created.uuid,
            spec_url: dto.specUrl,
            spec_json: parsed.specJson as Prisma.InputJsonValue,
            base_url: parsed.baseUrl,
            auth_type: authConfig.type,
            auth_config: this.encryptionService.encrypt(JSON.stringify(authConfig)),
            generated_tools: tools as unknown as Prisma.InputJsonValue,
          },
        });

        await tx.integrationAction.createMany({
          data: tools.map((tool) => ({
            integration_uuid: created.uuid,
            key: tool.key,
            label: tool.key,
            description: tool.description,
            enabled: true,
          })),
          skipDuplicates: true,
        });

        return await tx.integration.findUniqueOrThrow({
          where: { uuid: created.uuid },
          include: { actions: true, openapi: true },
        });
      });

      return this.sanitize(integration);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getDetails(organizationUuid: string, integrationUuid: string) {
    try {
      return this.sanitize(await this.requireOpenApiIntegration(organizationUuid, integrationUuid));
    } catch (error) {
      this.handleError(error);
    }
  }

  async regenerateTools(organizationUuid: string, integrationUuid: string) {
    try {
      const integration = await this.requireOpenApiIntegration(organizationUuid, integrationUuid);
      const openapi = integration.openapi;

      if (!openapi) {
        throw new NotFoundException('OpenAPI integration not found');
      }

      const parsed = await this.parser.parse({
        specUrl: openapi.spec_url ?? undefined,
        rawJson: !openapi.spec_url ? (openapi.spec_json as Record<string, any>) : undefined,
      });
      const tools = this.generator.generateTools(parsed, integration.uuid);
      const existingByKey = new Map(integration.actions.map((action) => [action.key, action]));
      const toolKeys = new Set(tools.map((tool) => tool.key));

      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.openApiIntegration.update({
          where: { integration_uuid: integrationUuid },
          data: {
            spec_json: parsed.specJson as Prisma.InputJsonValue,
            base_url: parsed.baseUrl,
            generated_tools: tools as unknown as Prisma.InputJsonValue,
          },
        });

        await tx.integrationAction.deleteMany({
          where: {
            integration_uuid: integrationUuid,
            key: { notIn: Array.from(toolKeys) },
          },
        });

        for (const tool of tools) {
          const existing = existingByKey.get(tool.key);

          await tx.integrationAction.upsert({
            where: {
              integration_uuid_key: {
                integration_uuid: integrationUuid,
                key: tool.key,
              },
            },
            update: {
              label: tool.key,
              description: tool.description,
              enabled: existing?.enabled ?? true,
            },
            create: {
              integration_uuid: integrationUuid,
              key: tool.key,
              label: tool.key,
              description: tool.description,
              enabled: true,
            },
          });
        }

        return await tx.integration.findUniqueOrThrow({
          where: { uuid: integrationUuid },
          include: { actions: true, openapi: true },
        });
      });

      return this.sanitize(updated);
    } catch (error) {
      this.handleError(error);
    }
  }

  async testConnection(organizationUuid: string, integrationUuid: string) {
    try {
      const integration = await this.requireOpenApiIntegration(organizationUuid, integrationUuid);
      const openapi = integration.openapi;

      if (!openapi) {
        throw new NotFoundException('OpenAPI integration not found');
      }

      if (openapi.spec_url) {
        await axios.get(openapi.spec_url, { timeout: 10_000 });
      }

      return { success: true };
    } catch (error) {
      this.handleError(error);
    }
  }

  private async requireOpenApiIntegration(organizationUuid: string, integrationUuid: string) {
    const integration = await this.prisma.integration.findFirst({
      where: {
        uuid: integrationUuid,
        org_uuid: organizationUuid,
        provider: IntegrationProvider.OPENAPI,
      },
      include: { actions: true, openapi: true },
    });

    if (!integration) {
      throw new NotFoundException('OpenAPI integration not found');
    }

    return integration;
  }

  private sanitize(integration: any) {
    const { config: _config, openapi, ...safeIntegration } = integration;

    return {
      ...safeIntegration,
      openapi: openapi
        ? {
            uuid: openapi.uuid,
            integration_uuid: openapi.integration_uuid,
            spec_url: openapi.spec_url,
            spec_json: openapi.spec_json,
            base_url: openapi.base_url,
            auth_type: openapi.auth_type,
            generated_tools: openapi.generated_tools,
            created_at: openapi.created_at,
            updated_at: openapi.updated_at,
          }
        : null,
    };
  }

  private handleError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unexpected OpenAPI integration error';
    throw new BadRequestException(message);
  }
}
