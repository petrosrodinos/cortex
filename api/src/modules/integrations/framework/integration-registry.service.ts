import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { IntegrationProvider, IntegrationStatus } from 'generated/prisma';
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

  async getAllTools(organizationUuid: string): Promise<AiTool[]> {
    const integrations = await this.prisma.integration.findMany({
      where: {
        org_uuid: organizationUuid,
        status: IntegrationStatus.ACTIVE,
      },
      include: {
        actions: {
          where: { enabled: true },
        },
      },
    });

    return integrations.flatMap((integration) => {
      const handler = this.integrations.get(integration.provider);

      if (!handler) {
        return [];
      }

      const enabled_tool_names = new Set(
        integration.actions.map((action) => `${integration.provider.toLowerCase()}__${action.key}`),
      );

      return handler.getTools(integration).filter((tool) => enabled_tool_names.has(tool.function.name));
    });
  }
}
