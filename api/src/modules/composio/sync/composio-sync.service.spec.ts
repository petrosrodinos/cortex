import {
  ComposioConnectionTier,
  ComposioSyncStatus,
  ComposioSyncType,
} from 'generated/prisma';
import { ComposioSyncService } from './composio-sync.service';

describe('ComposioSyncService', () => {
  const createService = (overrides?: {
    toolkitPages?: any[];
    toolPages?: any[];
    existingToolkit?: any;
  }) => {
    const prisma: any = {
      composioSyncRun: {
        create: jest.fn().mockResolvedValue({ uuid: 'sync-run-uuid' }),
        update: jest.fn().mockResolvedValue({ uuid: 'sync-run-uuid' }),
      },
      composioToolkit: {
        findUnique: jest
          .fn()
          .mockResolvedValue(overrides?.existingToolkit ?? null),
        findUniqueOrThrow: jest
          .fn()
          .mockResolvedValue({ uuid: 'toolkit-uuid' }),
        upsert: jest.fn(),
      },
      composioToolkitTool: {
        upsert: jest.fn(),
      },
    };
    const toolkitPages = overrides?.toolkitPages ?? [
      {
        items: [
          {
            slug: 'slack',
            name: 'Slack',
            description: 'Team chat',
            toolsCount: 1,
            categories: ['communication'],
          },
        ],
      },
    ];
    const toolPages = overrides?.toolPages ?? [
      {
        items: [
          {
            slug: 'slack_send_message',
            name: 'Send message',
            description: 'Send a channel message',
            inputParameters: { type: 'object' },
          },
        ],
      },
    ];
    const client = {
      toolkits: {
        get: jest.fn().mockImplementation(() => toolkitPages.shift()),
      },
      tools: {
        getRawComposioTools: jest.fn().mockImplementation(() => toolPages.shift()),
      },
    };
    const composioClient = {
      getClient: jest.fn().mockReturnValue(client),
    };

    return {
      service: new ComposioSyncService(prisma, composioClient as any),
      prisma,
      client,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('syncs toolkits and enabled toolkit tools from Composio pages', async () => {
    const { service, prisma, client } = createService();

    await service.syncAll();

    expect(prisma.composioSyncRun.create).toHaveBeenCalledWith({
      data: { sync_type: ComposioSyncType.FULL },
    });
    expect(prisma.composioToolkit.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: 'slack' },
        create: expect.objectContaining({
          slug: 'slack',
          name: 'Slack',
          connection_tier: ComposioConnectionTier.ORG_SHARED,
        }),
      }),
    );
    expect(client.tools.getRawComposioTools).toHaveBeenCalledWith({
      toolkits: ['slack'],
      limit: 500,
      cursor: undefined,
    });
    expect(prisma.composioToolkitTool.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          toolkit_uuid_slug: {
            toolkit_uuid: 'toolkit-uuid',
            slug: 'slack_send_message',
          },
        },
      }),
    );
    expect(prisma.composioSyncRun.update).toHaveBeenCalledWith({
      where: { uuid: 'sync-run-uuid' },
      data: expect.objectContaining({
        status: ComposioSyncStatus.COMPLETED,
        toolkits_upserted: 1,
        tools_upserted: 1,
      }),
    });
  });

  it('syncs toolkit arrays returned directly by the Composio SDK', async () => {
    const { service, prisma } = createService({
      toolkitPages: [
        [
          {
            slug: 'github',
            name: 'GitHub',
            description: 'Code hosting',
            meta: { toolsCount: 2 },
            categories: ['developer-tools'],
          },
        ],
      ],
    });

    await service.syncAll();

    expect(prisma.composioToolkit.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: 'github' },
        create: expect.objectContaining({
          slug: 'github',
          name: 'GitHub',
          tool_count: 2,
        }),
      }),
    );
    expect(prisma.composioSyncRun.update).toHaveBeenCalledWith({
      where: { uuid: 'sync-run-uuid' },
      data: expect.objectContaining({
        status: ComposioSyncStatus.COMPLETED,
        toolkits_upserted: 1,
      }),
    });
  });

  it('records a failed sync run when Composio throws', async () => {
    const { service, prisma, client } = createService();
    client.toolkits.get.mockRejectedValueOnce(new Error('bad api key'));

    await expect(service.syncAll()).rejects.toThrow('bad api key');

    expect(prisma.composioSyncRun.update).toHaveBeenCalledWith({
      where: { uuid: 'sync-run-uuid' },
      data: expect.objectContaining({
        status: ComposioSyncStatus.FAILED,
        error: 'bad api key',
      }),
    });
  });
});
