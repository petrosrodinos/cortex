import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  ComposioConnectionTier,
  ComposioSyncType,
  Prisma,
} from 'generated/prisma';
import { ComposioSyncService } from '../sync/composio-sync.service';
import { CreateComposioToolkitDto } from '../admin/dto/create-composio-toolkit.dto';
import { ListComposioToolkitsDto } from '../admin/dto/list-composio-toolkits.dto';
import { SyncComposioDto } from '../admin/dto/sync-composio.dto';
import { UpdateComposioToolkitDto } from '../admin/dto/update-composio-toolkit.dto';

@Injectable()
export class ComposioToolkitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly syncService: ComposioSyncService,
  ) {}

  async findAll(query: ListComposioToolkitsDto) {
    const page = this.toPositiveInt(query.page, 1);
    const limit = Math.min(this.toPositiveInt(query.limit, 25), 100);
    const where: Prisma.ComposioToolkitWhereInput = {};

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

    const enabled = this.toOptionalBoolean(query.is_enabled);
    if (enabled !== undefined) {
      where.is_enabled = enabled;
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.composioToolkit.count({ where }),
      this.prisma.composioToolkit.findMany({
        where,
        orderBy: [{ is_enabled: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { tools: true, enabled_orgs: true } } },
      }),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(slug: string) {
    return this.prisma.composioToolkit.findUniqueOrThrow({
      where: { slug },
      include: {
        tools: {
          orderBy: [{ is_enabled: 'desc' }, { name: 'asc' }],
        },
        _count: {
          select: { enabled_orgs: true },
        },
      },
    });
  }

  async update(slug: string, dto: UpdateComposioToolkitDto) {
    return this.prisma.composioToolkit.update({
      where: { slug },
      data: {
        ...(dto.is_enabled !== undefined ? { is_enabled: dto.is_enabled } : {}),
        ...(dto.connection_tiers
          ? { connection_tiers: dto.connection_tiers }
          : {}),
      },
    });
  }

  async create(dto: CreateComposioToolkitDto) {
    await this.syncService.syncToolkit(dto.slug);

    return this.prisma.composioToolkit.update({
      where: { slug: dto.slug },
      data: { is_enabled: true },
    });
  }

  async remove(slug: string) {
    return this.prisma.composioToolkit.update({
      where: { slug },
      data: { is_enabled: false },
    });
  }

  async sync(dto: SyncComposioDto) {
    const syncType = dto.sync_type ?? ComposioSyncType.FULL;

    if (syncType === ComposioSyncType.FULL) {
      return this.syncService.syncAll();
    }

    if (!dto.toolkit_slug) {
      throw new BadRequestException(
        'toolkit_slug is required for TOOLKIT and TOOLS sync',
      );
    }

    if (syncType === ComposioSyncType.TOOLKIT) {
      return this.syncService.syncToolkit(dto.toolkit_slug);
    }

    return this.syncService.syncToolsRun(dto.toolkit_slug);
  }

  async getSyncRun(syncRunUuid: string) {
    return this.syncService.getSyncRun(syncRunUuid);
  }

  async listSyncRuns(limit?: string) {
    return {
      data: await this.prisma.composioSyncRun.findMany({
        orderBy: { started_at: 'desc' },
        take: Math.min(this.toPositiveInt(limit, 25), 100),
      }),
    };
  }

  async refreshToolkit(slug: string) {
    await this.syncService.syncToolkit(slug);
    return this.findOne(slug);
  }

  async refreshTools(slug: string) {
    const syncRun = await this.syncService.syncToolsRun(slug);
    return {
      sync_run: syncRun,
      toolkit: await this.findOne(slug),
    };
  }

  async findTools(slug: string, query: ListComposioToolkitsDto) {
    const toolkit = await this.findToolkitUuid(slug);
    const where: Prisma.ComposioToolkitToolWhereInput = {
      toolkit_uuid: toolkit.uuid,
    };

    if (query.search) {
      where.OR = [
        { slug: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const enabled = this.toOptionalBoolean(query.is_enabled);
    if (enabled !== undefined) {
      where.is_enabled = enabled;
    }

    return this.prisma.composioToolkitTool.findMany({
      where,
      orderBy: [{ is_enabled: 'desc' }, { name: 'asc' }],
    });
  }

  async updateTool(toolkitSlug: string, toolSlug: string, isEnabled: boolean) {
    return this.prisma.composioToolkitTool.update({
      where: { uuid: await this.findToolUuid(toolkitSlug, toolSlug) },
      data: { is_enabled: isEnabled },
    });
  }

  async getStats(slug: string) {
    const toolkit = await this.findToolkitUuid(slug);
    const [connectedAccountsCount, activeTriggersCount] =
      await this.prisma.$transaction([
        this.prisma.composioConnectedAccount.count({
          where: { toolkit_uuid: toolkit.uuid },
        }),
        this.prisma.composioTrigger.count({
          where: { toolkit_uuid: toolkit.uuid, is_enabled: true },
        }),
      ]);

    return {
      connected_accounts_count: connectedAccountsCount,
      active_triggers_count: activeTriggersCount,
    };
  }

  private async findToolkitUuid(slug: string): Promise<{ uuid: string }> {
    return this.prisma.composioToolkit.findUniqueOrThrow({
      where: { slug },
      select: { uuid: true },
    });
  }

  private async findToolUuid(
    toolkitSlug: string,
    toolSlug: string,
  ): Promise<string> {
    const tool = await this.prisma.composioToolkitTool.findFirstOrThrow({
      where: { slug: toolSlug, toolkit: { slug: toolkitSlug } },
      select: { uuid: true },
    });

    return tool.uuid;
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
