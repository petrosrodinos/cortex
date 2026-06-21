import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  ComposioAccountStatus,
  IntegrationStatus,
} from 'generated/prisma';

export interface CapabilitiesToolsContext {
  organizationUuid: string;
  integrationUuids?: string[];
  toolkitSlugs?: string[];
}

@Injectable()
export class CapabilitiesToolsService {
  constructor(private readonly prisma: PrismaService) {}

  async listIntegrations(context: CapabilitiesToolsContext) {
    const integrations = await this.prisma.integration.findMany({
      where: {
        org_uuid: context.organizationUuid,
        status: IntegrationStatus.ACTIVE,
        ...(context.integrationUuids?.length
          ? { uuid: { in: context.integrationUuids } }
          : {}),
      },
      include: {
        actions: { where: { enabled: true }, select: { key: true } },
        database: { select: { uuid: true } },
      },
      orderBy: { name: 'asc' },
    });

    return {
      integrations: integrations.map((integration) => ({
        uuid: integration.uuid,
        name: integration.name,
        provider: integration.provider,
        actions: integration.actions.map((action) => action.key),
        has_database_schema: Boolean(integration.database),
      })),
    };
  }

  async listToolkits(context: CapabilitiesToolsContext) {
    const enabled = await this.prisma.organisationEnabledToolkit.findMany({
      where: {
        org_uuid: context.organizationUuid,
        is_enabled: true,
        toolkit: {
          is_enabled: true,
          ...(context.toolkitSlugs?.length
            ? { slug: { in: context.toolkitSlugs } }
            : {}),
        },
      },
      include: {
        toolkit: {
          select: {
            slug: true,
            name: true,
            description: true,
            connected_accounts: {
              where: {
                org_uuid: context.organizationUuid,
                status: ComposioAccountStatus.ACTIVE,
              },
              take: 1,
            },
          },
        },
      },
      orderBy: { toolkit: { name: 'asc' } },
    });

    return {
      toolkits: enabled.map((entry) => ({
        slug: entry.toolkit.slug,
        name: entry.toolkit.name,
        description: entry.toolkit.description,
        is_connected: entry.toolkit.connected_accounts.length > 0,
      })),
    };
  }

  async getDatabaseSchema(
    context: CapabilitiesToolsContext,
    integrationUuid: string,
  ) {
    const integration = await this.prisma.integration.findFirst({
      where: {
        uuid: integrationUuid,
        org_uuid: context.organizationUuid,
        status: IntegrationStatus.ACTIVE,
      },
      include: { database: true },
    });

    if (!integration?.database?.schema_cache) {
      throw new NotFoundException(
        'Database schema not available for this integration',
      );
    }

    return {
      integration_uuid: integration.uuid,
      name: integration.name,
      schema: integration.database.schema_cache,
    };
  }
}
