import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { IntegrationProvider, IntegrationStatus } from 'generated/prisma';
import { DATABASE_PROVIDERS } from '../databases/database-integration.types';
import { AiTool } from './ai-tool.interface';
import { IIntegration } from './integration.interface';

@Injectable({ scope: Scope.DEFAULT })
export class IntegrationRegistry {
  private readonly integrations = new Map<IntegrationProvider, IIntegration>();

  constructor(private readonly prisma: PrismaService) {}

  register(integration: IIntegration) {
    this.integrations.set(integration.provider, integration);
  }

  getByProvider(provider: IntegrationProvider) {
    const integration = this.integrations.get(provider);

    if (!integration) {
      throw new BadRequestException(`Integration provider ${provider} is not registered`);
    }

    return integration;
  }

  async executeTool(organizationUuid: string, toolName: string, input: Record<string, any>) {
    if (toolName.startsWith('db__')) {
      return await this.executeDatabaseTool(organizationUuid, toolName, input);
    }

    if (toolName.startsWith('openapi_')) {
      return await this.executeOpenApiTool(organizationUuid, toolName, input);
    }

    const [providerKey] = toolName.split('__');

    if (!providerKey || providerKey === toolName) {
      throw new ForbiddenException('Integration tool names must be provider-prefixed');
    }

    const provider = providerKey.toUpperCase() as IntegrationProvider;
    const handler = this.getByProvider(provider);
    const integration = await this.prisma.integration.findFirst({
      where: {
        org_uuid: organizationUuid,
        provider,
        status: IntegrationStatus.ACTIVE,
      },
    });

    if (!integration) {
      throw new NotFoundException(`No active ${provider} integration is available`);
    }

    return await handler.executeTool(toolName, input, integration);
  }

  async getAllTools(organizationUuid: string): Promise<AiTool[]> {
    const integrations = await this.prisma.integration.findMany({
      where: {
        org_uuid: organizationUuid,
        status: IntegrationStatus.ACTIVE,
      },
      include: {
        database: true,
        openapi: true,
        actions: {
          where: { enabled: true },
        },
      },
    });

    const tools = integrations.flatMap((integration) => {
      const handler = this.integrations.get(integration.provider);

      if (!handler) {
        return [];
      }

      const enabled_tool_names = new Set(
        integration.actions.flatMap((action) => [
          `${integration.provider.toLowerCase()}__${action.key}`,
          ...(DATABASE_PROVIDERS.includes(integration.provider as any) ? [`db__${action.key}`] : []),
          ...(integration.provider === IntegrationProvider.OPENAPI ? [`openapi_${integration.uuid.slice(0, 8)}__${action.key}`] : []),
        ]),
      );

      return handler.getTools(integration).filter((tool) => enabled_tool_names.has(tool.function.name));
    });

    const deduped = new Map<string, AiTool>();

    for (const tool of tools) {
      if (!deduped.has(tool.function.name)) {
        deduped.set(tool.function.name, tool);
      }
    }

    return Array.from(deduped.values());
  }

  private async executeDatabaseTool(organizationUuid: string, toolName: string, input: Record<string, any>) {
    const integrationUuid = input?.integration_uuid;
    const integration = integrationUuid
      ? await this.prisma.integration.findFirst({
          where: {
            uuid: integrationUuid,
            org_uuid: organizationUuid,
            provider: { in: [...DATABASE_PROVIDERS] },
            status: IntegrationStatus.ACTIVE,
          },
        })
      : await this.resolveOnlyActiveDatabaseIntegration(organizationUuid);

    if (!integration) {
      throw new NotFoundException('No active database integration is available');
    }

    const handler = this.getByProvider(integration.provider);
    return await handler.executeTool(toolName, input, integration);
  }

  private async resolveOnlyActiveDatabaseIntegration(organizationUuid: string) {
    const integrations = await this.prisma.integration.findMany({
      where: {
        org_uuid: organizationUuid,
        provider: { in: [...DATABASE_PROVIDERS] },
        status: IntegrationStatus.ACTIVE,
      },
      take: 2,
    });

    if (integrations.length > 1) {
      throw new BadRequestException('integration_uuid is required when multiple database integrations are active');
    }

    return integrations[0] ?? null;
  }

  private async executeOpenApiTool(organizationUuid: string, toolName: string, input: Record<string, any>) {
    const match = toolName.match(/^openapi_([^_]+)__(.+)$/);

    if (!match) {
      throw new ForbiddenException('OpenAPI tool names must include an integration prefix');
    }

    const integration = await this.prisma.integration.findFirst({
      where: {
        org_uuid: organizationUuid,
        provider: IntegrationProvider.OPENAPI,
        status: IntegrationStatus.ACTIVE,
        uuid: { startsWith: match[1] },
      },
    });

    if (!integration) {
      throw new NotFoundException('No active OpenAPI integration is available for this tool');
    }

    const handler = this.getByProvider(IntegrationProvider.OPENAPI);
    return await handler.executeTool(toolName, input, integration);
  }
}
