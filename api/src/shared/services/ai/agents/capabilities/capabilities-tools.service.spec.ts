import { ComposioConnectionTier } from 'generated/prisma';
import { CapabilitiesToolsService } from './capabilities-tools.service';

describe('CapabilitiesToolsService', () => {
  const createService = () => {
    const prisma = {
      integration: {
        findMany: jest.fn().mockResolvedValue([
          {
            uuid: 'integration-a',
            name: 'Warehouse DB',
            provider: 'DATABASE_PG',
            actions: [{ key: 'query', enabled: true }],
            database: { allowed_ops: ['READ'] },
          },
          {
            uuid: 'integration-b',
            name: 'Disabled API',
            provider: 'OPENAPI',
            actions: [{ key: 'list_items', enabled: false }],
            database: null,
          },
        ]),
      },
      organisationEnabledToolkit: {
        findMany: jest.fn().mockResolvedValue([
          {
            toolkit: {
              uuid: 'toolkit-a',
              slug: 'gmail',
              name: 'Gmail',
              description: 'Email',
              logo_url: null,
              connection_tiers: [ComposioConnectionTier.USER_PERSONAL],
              connected_accounts: [{ user_uuid: 'user-uuid', account_label: null }],
              _count: { tools: 3 },
            },
          },
          {
            toolkit: {
              uuid: 'toolkit-b',
              slug: 'slack',
              name: 'Slack',
              description: 'Chat',
              logo_url: null,
              connection_tiers: [
                ComposioConnectionTier.ORG_SHARED,
                ComposioConnectionTier.USER_PERSONAL,
              ],
              connected_accounts: [],
              _count: { tools: 2 },
            },
          },
        ]),
      },
      composioToolkit: {
        findMany: jest.fn().mockImplementation(({ where }: any) => {
          const slugs = where?.slug?.in ?? [];
          const toolkits = [];

          if (slugs.includes('gmail') || slugs.length === 0) {
            toolkits.push({
              slug: 'gmail',
              name: 'Gmail',
              connected_accounts: [{ user_uuid: 'user-uuid' }],
            });
          }

          if (slugs.includes('slack') || slugs.length === 0) {
            toolkits.push({
              slug: 'slack',
              name: 'Slack',
              connected_accounts: [],
            });
          }

          return Promise.resolve(
            toolkits.filter((toolkit) => slugs.length === 0 || slugs.includes(toolkit.slug)),
          );
        }),
      },
    };

    return {
      service: new CapabilitiesToolsService(prisma as any),
      prisma,
    };
  };

  it('lists only tool-eligible integrations and org-enabled toolkits', async () => {
    const { service } = createService();

    await expect(service.listEnabledAgentTools('org-uuid', 'user-uuid')).resolves.toEqual({
      integrations: [
        {
          uuid: 'integration-a',
          name: 'Warehouse DB',
          provider: 'DATABASE_PG',
          actions: ['get_schema', 'query'],
        },
      ],
      toolkits: [
        {
          uuid: 'toolkit-a',
          slug: 'gmail',
          name: 'Gmail',
          description: 'Email',
          logo_url: null,
          tool_count: 3,
          is_connected: true,
          connection_tiers: [ComposioConnectionTier.USER_PERSONAL],
          connected_accounts: [
            {
              connection_tier: ComposioConnectionTier.USER_PERSONAL,
              account_label: null,
            },
          ],
        },
        {
          uuid: 'toolkit-b',
          slug: 'slack',
          name: 'Slack',
          description: 'Chat',
          logo_url: null,
          tool_count: 2,
          is_connected: false,
          connection_tiers: [
            ComposioConnectionTier.ORG_SHARED,
            ComposioConnectionTier.USER_PERSONAL,
          ],
          connected_accounts: [],
        },
      ],
    });
  });

  it('uses all enabled tools when no scope is provided', async () => {
    const { service } = createService();

    await expect(
      service.resolveAgentToolScope('org-uuid', 'user-uuid'),
    ).resolves.toEqual({
      integrationUuids: ['integration-a'],
      toolkitSlugs: ['gmail', 'slack'],
      toolkitConnectionTiers: {
        gmail: ComposioConnectionTier.USER_PERSONAL,
      },
    });
  });

  it('uses only selected integrations and toolkits when scope is provided', async () => {
    const { service } = createService();

    await expect(
      service.resolveAgentToolScope(
        'org-uuid',
        'user-uuid',
        ['integration-a'],
        ['gmail'],
      ),
    ).resolves.toEqual({
      integrationUuids: ['integration-a'],
      toolkitSlugs: ['gmail'],
      toolkitConnectionTiers: {
        gmail: ComposioConnectionTier.USER_PERSONAL,
      },
    });
  });

  it('drops unknown integration and toolkit selections', async () => {
    const { service } = createService();

    await expect(
      service.resolveAgentToolScope(
        'org-uuid',
        'user-uuid',
        ['integration-a', 'missing-integration'],
        ['gmail', 'missing-toolkit'],
      ),
    ).resolves.toEqual({
      integrationUuids: ['integration-a'],
      toolkitSlugs: ['gmail'],
      toolkitConnectionTiers: {
        gmail: ComposioConnectionTier.USER_PERSONAL,
      },
    });
  });

  it('scopes to none when an empty selection is provided', async () => {
    const { service } = createService();

    await expect(
      service.resolveAgentToolScope('org-uuid', 'user-uuid', [], []),
    ).resolves.toEqual({
      integrationUuids: [],
      toolkitSlugs: [],
      toolkitConnectionTiers: undefined,
    });
  });
});
