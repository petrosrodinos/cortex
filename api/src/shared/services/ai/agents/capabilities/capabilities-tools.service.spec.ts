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
              connected_accounts: [{ uuid: 'account-1' }],
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
              connected_accounts: [],
              _count: { tools: 2 },
            },
          },
        ]),
      },
    };

    return {
      service: new CapabilitiesToolsService(prisma as any),
      prisma,
    };
  };

  it('lists only tool-eligible integrations and org-enabled toolkits', async () => {
    const { service } = createService();

    await expect(service.listEnabledAgentTools('org-uuid')).resolves.toEqual({
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
        },
        {
          uuid: 'toolkit-b',
          slug: 'slack',
          name: 'Slack',
          description: 'Chat',
          logo_url: null,
          tool_count: 2,
          is_connected: false,
        },
      ],
    });
  });

  it('uses all enabled tools when no scope is provided', async () => {
    const { service } = createService();

    await expect(
      service.resolveAgentToolScope('org-uuid'),
    ).resolves.toEqual({
      integrationUuids: ['integration-a'],
      toolkitSlugs: ['gmail', 'slack'],
    });
  });

  it('uses only selected integrations and toolkits when scope is provided', async () => {
    const { service } = createService();

    await expect(
      service.resolveAgentToolScope(
        'org-uuid',
        ['integration-a'],
        ['gmail'],
      ),
    ).resolves.toEqual({
      integrationUuids: ['integration-a'],
      toolkitSlugs: ['gmail'],
    });
  });

  it('drops unknown integration and toolkit selections', async () => {
    const { service } = createService();

    await expect(
      service.resolveAgentToolScope(
        'org-uuid',
        ['integration-a', 'missing-integration'],
        ['gmail', 'missing-toolkit'],
      ),
    ).resolves.toEqual({
      integrationUuids: ['integration-a'],
      toolkitSlugs: ['gmail'],
    });
  });

  it('scopes to none when an empty selection is provided', async () => {
    const { service } = createService();

    await expect(
      service.resolveAgentToolScope('org-uuid', [], []),
    ).resolves.toEqual({
      integrationUuids: [],
      toolkitSlugs: [],
    });
  });
});
