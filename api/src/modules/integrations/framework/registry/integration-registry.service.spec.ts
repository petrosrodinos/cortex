import { IntegrationRegistry } from './integration-registry.service';
import { IntegrationProvider, IntegrationStatus } from 'generated/prisma';

describe('IntegrationRegistry', () => {
  const prisma: any = {
    integration: {
      findMany: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('aggregates tools only for active integrations and enabled actions', async () => {
    const registry = new IntegrationRegistry(prisma);
    registry.register({
      provider: IntegrationProvider.OPENAPI,
      getTools: jest.fn().mockReturnValue([
        { type: 'function', function: { name: 'openapi__enabled', description: 'Enabled', parameters: {} } },
        { type: 'function', function: { name: 'openapi__disabled', description: 'Disabled', parameters: {} } },
      ]),
      testConnection: jest.fn(),
      executeTool: jest.fn(),
    });
    prisma.integration.findMany.mockResolvedValue([
      {
        uuid: 'integration-uuid',
        provider: IntegrationProvider.OPENAPI,
        status: IntegrationStatus.ACTIVE,
        actions: [{ key: 'enabled', enabled: true }],
      },
    ]);

    await expect(registry.getAllTools('organization-uuid')).resolves.toEqual([
      { type: 'function', function: { name: 'openapi__enabled', description: 'Enabled', parameters: {} } },
    ]);
  });
});
