import { IntegrationsService } from './integrations.service';
import { IntegrationProvider, IntegrationStatus } from 'generated/prisma';

describe('IntegrationsService', () => {
  const prisma: any = {
    integration: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };
  const encryption: any = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };
  const registry: any = {
    getByProvider: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists only retained DB/OpenAPI/MCP integrations', async () => {
    prisma.integration.findMany.mockResolvedValue([
      {
        uuid: 'openapi-uuid',
        provider: IntegrationProvider.OPENAPI,
        status: IntegrationStatus.ACTIVE,
        config: 'ciphertext',
        actions: [],
        openapi: { uuid: 'openapi-details-uuid', auth_config: 'ciphertext' },
      },
    ]);
    const service = new IntegrationsService(prisma, encryption, registry);

    await expect(service.findAll('organization-uuid')).resolves.toEqual([
      expect.objectContaining({
        uuid: 'openapi-uuid',
        provider: IntegrationProvider.OPENAPI,
        openapi: { uuid: 'openapi-details-uuid' },
      }),
    ]);

    expect(prisma.integration.findMany).toHaveBeenCalledWith({
      where: {
        org_uuid: 'organization-uuid',
        provider: {
          in: [
            IntegrationProvider.DATABASE_PG,
            IntegrationProvider.DATABASE_MYSQL,
            IntegrationProvider.DATABASE_MONGO,
            IntegrationProvider.OPENAPI,
            IntegrationProvider.MCP,
          ],
        },
      },
      include: { actions: true, database: true, openapi: true, mcp: true },
      orderBy: { created_at: 'desc' },
    });
  });

  it('does not return removed SaaS integrations by UUID', async () => {
    prisma.integration.findFirst.mockResolvedValue(null);
    const service = new IntegrationsService(prisma, encryption, registry);

    await expect(
      service.findOne('organization-uuid', 'github-integration-uuid'),
    ).rejects.toThrow('Integration not found');
  });
});
