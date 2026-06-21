import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ComposioClientService } from '@/integrations/composio/composio-client.service';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  ComposioConnectionTier,
  ComposioSyncStatus,
  ComposioSyncType,
  Prisma,
} from 'generated/prisma';

type UnknownRecord = Record<string, any>;

@Injectable()
export class ComposioSyncService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ComposioSyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly composioClient: ComposioClientService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    void this.syncAll().catch((error) => {
      this.logger.error('Composio startup sync failed', error?.stack ?? error);
    });
  }

  async syncAll() {
    const run = await this.prisma.composioSyncRun.create({
      data: { sync_type: ComposioSyncType.FULL },
    });

    let toolkitsUpserted = 0;
    let toolsUpserted = 0;

    try {
      for await (const toolkit of this.listToolkits()) {
        await this.upsertToolkit(toolkit);
        toolkitsUpserted += 1;

        if (await this.shouldSyncTools(toolkit)) {
          toolsUpserted += await this.syncToolsForToolkit(
            this.getSlug(toolkit),
          );
        }
      }

      return this.prisma.composioSyncRun.update({
        where: { uuid: run.uuid },
        data: {
          status: ComposioSyncStatus.COMPLETED,
          toolkits_upserted: toolkitsUpserted,
          tools_upserted: toolsUpserted,
          completed_at: new Date(),
        },
      });
    } catch (error) {
      await this.prisma.composioSyncRun.update({
        where: { uuid: run.uuid },
        data: {
          status: ComposioSyncStatus.FAILED,
          error: error instanceof Error ? error.message : String(error),
          completed_at: new Date(),
        },
      });
      throw error;
    }
  }

  async syncToolsForToolkit(toolkitSlug: string): Promise<number> {
    const toolkit = await this.prisma.composioToolkit.findUniqueOrThrow({
      where: { slug: toolkitSlug },
      select: { uuid: true },
    });
    let synced = 0;

    for await (const tool of this.listTools(toolkitSlug)) {
      const slug = this.getSlug(tool);
      if (!slug) {
        continue;
      }

      await this.prisma.composioToolkitTool.upsert({
        where: {
          toolkit_uuid_slug: {
            toolkit_uuid: toolkit.uuid,
            slug,
          },
        },
        create: {
          toolkit_uuid: toolkit.uuid,
          slug,
          name: this.getString(tool, ['name']) ?? slug,
          description: this.getString(tool, ['description']) ?? '',
          input_schema: this.toJson(
            tool.inputParameters ?? tool.input_schema ?? tool.inputSchema ?? {},
          ),
          output_schema: this.toNullableJson(
            tool.outputParameters ?? tool.output_schema ?? tool.outputSchema,
          ),
          tags: this.getStringArray(tool, ['tags']),
          composio_version: this.getString(tool, [
            'version',
            'composio_version',
          ]),
          last_synced_at: new Date(),
        },
        update: {
          name: this.getString(tool, ['name']) ?? slug,
          description: this.getString(tool, ['description']) ?? '',
          input_schema: this.toJson(
            tool.inputParameters ?? tool.input_schema ?? tool.inputSchema ?? {},
          ),
          output_schema: this.toNullableJson(
            tool.outputParameters ?? tool.output_schema ?? tool.outputSchema,
          ),
          tags: this.getStringArray(tool, ['tags']),
          composio_version: this.getString(tool, [
            'version',
            'composio_version',
          ]),
          last_synced_at: new Date(),
        },
      });

      synced += 1;
    }

    return synced;
  }

  async syncToolkit(toolkitSlug: string) {
    const run = await this.prisma.composioSyncRun.create({
      data: { sync_type: ComposioSyncType.TOOLKIT },
    });

    try {
      const toolkit = await (
        this.composioClient.getClient() as any
      ).toolkits.get(toolkitSlug);
      await this.upsertToolkit(toolkit);

      return this.prisma.composioSyncRun.update({
        where: { uuid: run.uuid },
        data: {
          status: ComposioSyncStatus.COMPLETED,
          toolkits_upserted: 1,
          completed_at: new Date(),
        },
      });
    } catch (error) {
      await this.failRun(run.uuid, error);
      throw error;
    }
  }

  async syncToolsRun(toolkitSlug: string) {
    const run = await this.prisma.composioSyncRun.create({
      data: { sync_type: ComposioSyncType.TOOLS },
    });

    try {
      const toolsUpserted = await this.syncToolsForToolkit(toolkitSlug);

      return this.prisma.composioSyncRun.update({
        where: { uuid: run.uuid },
        data: {
          status: ComposioSyncStatus.COMPLETED,
          tools_upserted: toolsUpserted,
          completed_at: new Date(),
        },
      });
    } catch (error) {
      await this.failRun(run.uuid, error);
      throw error;
    }
  }

  async getSyncRun(syncRunUuid: string) {
    return this.prisma.composioSyncRun.findUniqueOrThrow({
      where: { uuid: syncRunUuid },
    });
  }

  private async *listToolkits(): AsyncGenerator<UnknownRecord> {
    const composio = this.composioClient.getClient() as any;
    let cursor: string | undefined;

    do {
      const page = await composio.client.toolkits.list({
        limit: 1000,
        ...(cursor ? { cursor } : {}),
      });
      const items = this.getItems(page);

      for (const item of items) {
        yield item;
      }

      cursor = this.getNextCursor(page);
    } while (cursor);
  }

  private async *listTools(toolkitSlug: string): AsyncGenerator<UnknownRecord> {
    const composio = this.composioClient.getClient() as any;
    let cursor: string | undefined;

    do {
      const page = await composio.client.tools.list({
        toolkit_slug: toolkitSlug,
        limit: 1000,
        ...(cursor ? { cursor } : {}),
      });
      const items = this.getItems(page);

      for (const item of items) {
        yield item;
      }

      cursor = this.getNextCursor(page);
    } while (cursor);
  }

  private async upsertToolkit(toolkit: UnknownRecord): Promise<void> {
    const slug = this.getSlug(toolkit);
    if (!slug) {
      return;
    }

    const existing = await this.prisma.composioToolkit.findUnique({
      where: { slug },
      select: { is_enabled: true },
    });

    await this.prisma.composioToolkit.upsert({
      where: { slug },
      create: {
        slug,
        name: this.getString(toolkit, ['name']) ?? slug,
        description: this.getString(toolkit, [
          'description',
          'meta.description',
        ]),
        logo_url: this.getString(toolkit, [
          'logo',
          'logoUrl',
          'meta.logo',
          'meta.logoUrl',
        ]),
        categories: this.getStringArray(toolkit, [
          'categories',
          'meta.categories',
        ]),
        tool_count:
          this.getNumber(toolkit, [
            'toolsCount',
            'tool_count',
            'meta.toolsCount',
            'meta.tools_count',
          ]) ?? 0,
        auth_schemes: this.toJson(
          toolkit.authSchemes ?? toolkit.auth_schemes ?? [],
        ),
        connection_tiers: this.defaultConnectionTiers(),
        composio_metadata: this.toJson(toolkit),
        last_synced_at: new Date(),
      },
      update: {
        name: this.getString(toolkit, ['name']) ?? slug,
        description: this.getString(toolkit, [
          'description',
          'meta.description',
        ]),
        logo_url: this.getString(toolkit, [
          'logo',
          'logoUrl',
          'meta.logo',
          'meta.logoUrl',
        ]),
        categories: this.getStringArray(toolkit, [
          'categories',
          'meta.categories',
        ]),
        tool_count:
          this.getNumber(toolkit, [
            'toolsCount',
            'tool_count',
            'meta.toolsCount',
            'meta.tools_count',
          ]) ?? 0,
        auth_schemes: this.toJson(
          toolkit.authSchemes ?? toolkit.auth_schemes ?? [],
        ),
        composio_metadata: this.toJson(toolkit),
        last_synced_at: new Date(),
      },
    });
  }

  private async failRun(syncRunUuid: string, error: unknown): Promise<void> {
    await this.prisma.composioSyncRun.update({
      where: { uuid: syncRunUuid },
      data: {
        status: ComposioSyncStatus.FAILED,
        error: error instanceof Error ? error.message : String(error),
        completed_at: new Date(),
      },
    });
  }

  private async shouldSyncTools(toolkit: UnknownRecord): Promise<boolean> {
    const slug = this.getSlug(toolkit);
    if (!slug) {
      return false;
    }

    const existing = await this.prisma.composioToolkit.findUnique({
      where: { slug },
      select: { is_enabled: true },
    });

    return existing?.is_enabled ?? true;
  }

  private defaultConnectionTiers(): ComposioConnectionTier[] {
    return [ComposioConnectionTier.ORG_SHARED];
  }

  private getItems(page: any): UnknownRecord[] {
    if (Array.isArray(page)) {
      return page;
    }

    const items =
      page?.items ?? page?.data ?? page?.toolkits ?? page?.tools ?? [];
    return Array.isArray(items) ? items : [];
  }

  private getNextCursor(page: any): string | undefined {
    if (Array.isArray(page)) {
      return undefined;
    }

    const cursor =
      page?.nextCursor ??
      page?.next_cursor ??
      page?.cursor ??
      page?.pagination?.nextCursor ??
      page?.pagination?.next_cursor;

    return typeof cursor === 'string' && cursor.length > 0 ? cursor : undefined;
  }

  private getSlug(value: UnknownRecord): string {
    return this.getString(value, ['slug', 'name', 'key']) ?? '';
  }

  private getString(value: UnknownRecord, paths: string[]): string | undefined {
    for (const path of paths) {
      const result = this.getPath(value, path);
      if (typeof result === 'string' && result.trim()) {
        return result;
      }
    }
    return undefined;
  }

  private getNumber(value: UnknownRecord, paths: string[]): number | undefined {
    for (const path of paths) {
      const result = this.getPath(value, path);
      if (typeof result === 'number') {
        return result;
      }
    }
    return undefined;
  }

  private getStringArray(value: UnknownRecord, paths: string[]): string[] {
    for (const path of paths) {
      const result = this.getPath(value, path);
      if (Array.isArray(result)) {
        return result.filter(
          (item): item is string => typeof item === 'string',
        );
      }
    }
    return [];
  }

  private getPath(value: UnknownRecord, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], value);
  }

  private toJson(value: unknown): Prisma.InputJsonValue {
    return (value ?? {}) as Prisma.InputJsonValue;
  }

  private toNullableJson(
    value: unknown,
  ): Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue {
    if (value === undefined || value === null) {
      return Prisma.DbNull;
    }
    return value as Prisma.InputJsonValue;
  }
}
