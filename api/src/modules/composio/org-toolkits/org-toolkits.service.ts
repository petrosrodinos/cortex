import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ComposioConnectionTier, Prisma } from 'generated/prisma';
import { CountOrgToolkitsDto } from './dto/count-org-toolkits.dto';
import { ListOrgToolkitToolsDto } from './dto/list-org-toolkit-tools.dto';
import { ListOrgToolkitsDto } from './dto/list-org-toolkits.dto';
import { UpdateOrgToolPermissionDto } from './dto/update-org-tool-permission.dto';

@Injectable()
export class OrgToolkitsService {
  constructor(private readonly prisma: PrismaService) {}

  async countToolkits(organizationUuid: string, query: CountOrgToolkitsDto) {
    const where = this.buildToolkitListWhere(organizationUuid, query);
    const count = await this.prisma.composioToolkit.count({ where });
    return { count };
  }

  async listToolkits(organizationUuid: string, query: ListOrgToolkitsDto) {
    const page = this.toPositiveInt(query.page, 1);
    const limit = Math.min(this.toPositiveInt(query.limit, 25), 100);
    const where = this.buildToolkitListWhere(organizationUuid, query);

    const [total, toolkits] = await this.prisma.$transaction([
      this.prisma.composioToolkit.count({ where }),
      this.prisma.composioToolkit.findMany({
        where,
        orderBy: [{ name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          enabled_orgs: { where: { org_uuid: organizationUuid }, take: 1 },
          connected_accounts: {
            where: { org_uuid: organizationUuid },
            orderBy: { created_at: 'desc' },
          },
          _count: { select: { tools: { where: { is_enabled: true } } } },
        },
      }),
    ]);

    return {
      data: toolkits.map((toolkit) => ({
        uuid: toolkit.uuid,
        slug: toolkit.slug,
        name: toolkit.name,
        description: toolkit.description,
        logo_url: toolkit.logo_url,
        categories: toolkit.categories,
        connection_tiers: toolkit.connection_tiers,
        is_connected: toolkit.connected_accounts.length > 0,
        connected_accounts: toolkit.connected_accounts.map((account) => ({
          id: account.uuid,
          account_id: account.composio_account_id,
          composio_account_id: account.composio_account_id,
          label: account.account_label,
          status: account.status,
          user_uuid: account.user_uuid,
          connection_tier: account.user_uuid
            ? ComposioConnectionTier.USER_PERSONAL
            : ComposioConnectionTier.ORG_SHARED,
        })),
        is_org_enabled: toolkit.enabled_orgs[0]?.is_enabled ?? false,
        tool_count: toolkit._count.tools,
      })),
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getToolkit(organizationUuid: string, slug: string) {
    const toolkit = await this.prisma.composioToolkit.findFirst({
      where: { slug, is_enabled: true },
      include: {
        enabled_orgs: { where: { org_uuid: organizationUuid }, take: 1 },
        connected_accounts: {
          where: { org_uuid: organizationUuid },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!toolkit) {
      throw new NotFoundException('Composio toolkit not found');
    }

    const isOrgEnabled = toolkit.enabled_orgs[0]?.is_enabled ?? false;

    return {
      toolkit: {
        uuid: toolkit.uuid,
        slug: toolkit.slug,
        name: toolkit.name,
        description: toolkit.description,
        logo_url: toolkit.logo_url,
        categories: toolkit.categories,
        connection_tiers: toolkit.connection_tiers,
        is_org_enabled: isOrgEnabled,
        tool_count: toolkit.tool_count,
      },
      connections: toolkit.connected_accounts.map((account) => ({
        ...account,
        account_id: account.composio_account_id,
        connection_tier: account.user_uuid
          ? ComposioConnectionTier.USER_PERSONAL
          : ComposioConnectionTier.ORG_SHARED,
      })),
    };
  }

  async listToolkitTools(
    organizationUuid: string,
    slug: string,
    query: ListOrgToolkitToolsDto,
  ) {
    const page = this.toPositiveInt(query.page, 1);
    const limit = Math.min(this.toPositiveInt(query.limit, 25), 100);
    const toolkit = await this.prisma.composioToolkit.findFirst({
      where: { slug, is_enabled: true },
      select: {
        uuid: true,
        enabled_orgs: {
          where: { org_uuid: organizationUuid },
          take: 1,
          select: { is_enabled: true },
        },
      },
    });

    if (!toolkit) {
      throw new NotFoundException('Composio toolkit not found');
    }

    const isOrgEnabled = toolkit.enabled_orgs[0]?.is_enabled ?? false;
    const where: Prisma.ComposioToolkitToolWhereInput = {
      toolkit_uuid: toolkit.uuid,
      is_enabled: true,
    };

    if (query.search) {
      where.OR = [
        { slug: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, tools] = await this.prisma.$transaction([
      this.prisma.composioToolkitTool.count({ where }),
      this.prisma.composioToolkitTool.findMany({
        where,
        orderBy: [{ is_enabled: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          permissions: { where: { org_uuid: organizationUuid }, take: 1 },
        },
      }),
    ]);

    return {
      data: tools.map((tool) => {
        const permission = tool.permissions[0];

        return {
          uuid: tool.uuid,
          slug: tool.slug,
          name: tool.name,
          description: tool.description,
          enabled:
            isOrgEnabled && tool.is_enabled && (permission?.enabled ?? true),
          requires_approval: permission?.requires_approval ?? false,
          required_permission_key: permission?.required_permission_key ?? null,
        };
      }),
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async enableToolkit(organizationUuid: string, slug: string) {
    const toolkit = await this.findEnabledToolkit(slug);

    const enabledToolkit = await this.prisma.organisationEnabledToolkit.upsert({
      where: {
        org_uuid_toolkit_uuid: {
          org_uuid: organizationUuid,
          toolkit_uuid: toolkit.uuid,
        },
      },
      create: {
        org_uuid: organizationUuid,
        toolkit_uuid: toolkit.uuid,
        is_enabled: true,
      },
      update: { is_enabled: true },
      include: { toolkit: true },
    });

    await this.enableAllToolkitTools(organizationUuid, slug);

    return enabledToolkit;
  }

  async enableAllToolkitTools(organizationUuid: string, slug: string) {
    const toolkit = await this.findEnabledToolkit(slug);
    const tools = await this.prisma.composioToolkitTool.findMany({
      where: { toolkit_uuid: toolkit.uuid, is_enabled: true },
      select: { uuid: true },
    });

    if (tools.length === 0) {
      return;
    }

    const toolUuids = tools.map((tool) => tool.uuid);

    await this.prisma.organisationToolPermission.createMany({
      data: toolUuids.map((toolUuid) => ({
        org_uuid: organizationUuid,
        tool_uuid: toolUuid,
        enabled: true,
        requires_approval: false,
      })),
      skipDuplicates: true,
    });

    await this.prisma.organisationToolPermission.updateMany({
      where: {
        org_uuid: organizationUuid,
        tool_uuid: { in: toolUuids },
      },
      data: { enabled: true },
    });
  }

  async disableToolkit(organizationUuid: string, slug: string) {
    const toolkit = await this.findEnabledToolkit(slug);

    return this.prisma.organisationEnabledToolkit.upsert({
      where: {
        org_uuid_toolkit_uuid: {
          org_uuid: organizationUuid,
          toolkit_uuid: toolkit.uuid,
        },
      },
      create: {
        org_uuid: organizationUuid,
        toolkit_uuid: toolkit.uuid,
        is_enabled: false,
      },
      update: { is_enabled: false },
      include: { toolkit: true },
    });
  }

  async updateToolPermission(
    organizationUuid: string,
    toolSlug: string,
    dto: UpdateOrgToolPermissionDto,
  ) {
    const tool = await this.findUniqueToolBySlug(toolSlug);

    return this.prisma.organisationToolPermission.upsert({
      where: {
        org_uuid_tool_uuid: {
          org_uuid: organizationUuid,
          tool_uuid: tool.uuid,
        },
      },
      create: {
        org_uuid: organizationUuid,
        tool_uuid: tool.uuid,
        enabled: dto.enabled ?? tool.is_enabled,
        requires_approval: dto.requires_approval ?? false,
        required_permission_key: dto.required_permission_key,
      },
      update: {
        ...(dto.enabled !== undefined ? { enabled: dto.enabled } : {}),
        ...(dto.requires_approval !== undefined
          ? { requires_approval: dto.requires_approval }
          : {}),
        ...(dto.required_permission_key !== undefined
          ? { required_permission_key: dto.required_permission_key }
          : {}),
      },
      include: {
        tool: { include: { toolkit: { select: { slug: true, name: true } } } },
      },
    });
  }

  async listEnabledTools(organizationUuid: string) {
    const enabledToolkits =
      await this.prisma.organisationEnabledToolkit.findMany({
        where: {
          org_uuid: organizationUuid,
          is_enabled: true,
          toolkit: { is_enabled: true },
        },
        include: {
          toolkit: {
            include: {
              tools: {
                where: { is_enabled: true },
                orderBy: { name: 'asc' },
                include: {
                  permissions: {
                    where: { org_uuid: organizationUuid },
                    take: 1,
                  },
                },
              },
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

    return {
      data: enabledToolkits.flatMap((enabledToolkit) =>
        enabledToolkit.toolkit.tools
          .filter((tool) => tool.permissions[0]?.enabled ?? true)
          .map((tool) => ({
            uuid: tool.uuid,
            slug: tool.slug,
            name: tool.name,
            toolkit_slug: enabledToolkit.toolkit.slug,
            enabled: true,
            requires_approval: tool.permissions[0]?.requires_approval ?? false,
            required_permission_key:
              tool.permissions[0]?.required_permission_key ?? null,
          })),
      ),
    };
  }

  private buildToolkitListWhere(
    organizationUuid: string,
    query: Pick<ListOrgToolkitsDto, 'search' | 'category' | 'tier' | 'connected'>,
  ): Prisma.ComposioToolkitWhereInput {
    const where: Prisma.ComposioToolkitWhereInput = { is_enabled: true };

    if (query.search) {
      where.OR = [
        { slug: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.categories = { has: query.category };
    }

    if (query.tier) {
      where.connection_tiers = { has: this.parseConnectionTier(query.tier) };
    }

    const connected = this.toOptionalBoolean(query.connected);
    if (connected === true) {
      where.connected_accounts = { some: { org_uuid: organizationUuid } };
    }

    if (connected === false) {
      where.connected_accounts = { none: { org_uuid: organizationUuid } };
    }

    return where;
  }

  private async findEnabledToolkit(slug: string): Promise<{ uuid: string }> {
    const toolkit = await this.prisma.composioToolkit.findFirst({
      where: { slug, is_enabled: true },
      select: { uuid: true },
    });

    if (!toolkit) {
      throw new NotFoundException('Composio toolkit not found');
    }

    return toolkit;
  }

  private async findUniqueToolBySlug(toolSlug: string) {
    const tools = await this.prisma.composioToolkitTool.findMany({
      where: { slug: toolSlug, toolkit: { is_enabled: true } },
      take: 2,
      select: { uuid: true, is_enabled: true },
    });

    if (tools.length === 0) {
      throw new NotFoundException('Composio tool not found');
    }

    if (tools.length > 1) {
      throw new BadRequestException('Composio tool slug is ambiguous');
    }

    return tools[0];
  }

  private parseConnectionTier(value: string): ComposioConnectionTier {
    const normalized = value.toUpperCase();

    if (
      normalized === ComposioConnectionTier.ORG_SHARED ||
      normalized === ComposioConnectionTier.USER_PERSONAL
    ) {
      return normalized;
    }

    throw new BadRequestException('Invalid connection tier');
  }

  private toPositiveInt(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }

  private toOptionalBoolean(value: string | undefined): boolean | undefined {
    if (value === undefined) {
      return undefined;
    }

    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return undefined;
  }
}
