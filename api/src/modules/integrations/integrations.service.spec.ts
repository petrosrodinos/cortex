import { IntegrationsService } from './integrations.service';
import { IntegrationProvider, IntegrationStatus } from 'generated/prisma';

describe('IntegrationsService', () => {
  const prisma: any = {
    integration: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    integrationAction: {
      createMany: jest.fn(),
    },
    $transaction: jest.fn(),
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
    prisma.$transaction.mockImplementation((callback) => callback(prisma));
    encryption.encrypt.mockReturnValue('ciphertext');
  });

  it('encrypts config and seeds provider actions when creating an integration', async () => {
    registry.getByProvider.mockReturnValue({
      defaultActions: jest.fn().mockReturnValue([
        {
          key: 'call',
          label: 'Call endpoint',
          description: 'Call an endpoint',
          required_permission_key: 'org:integrations:manage',
        },
      ]),
    });
    prisma.integration.create.mockResolvedValue({
      uuid: 'integration-uuid',
      provider: IntegrationProvider.OPENAPI,
      status: IntegrationStatus.ACTIVE,
    });
    const service = new IntegrationsService(prisma, encryption, registry);

    await service.create('organization-uuid', {
      name: 'OpenAPI',
      provider: IntegrationProvider.OPENAPI,
      config: { token: 'secret' },
    });

    expect(encryption.encrypt).toHaveBeenCalledWith(JSON.stringify({ token: 'secret' }));
    expect(prisma.integration.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        org_uuid: 'organization-uuid',
        config: 'ciphertext',
      }),
    });
    expect(prisma.integrationAction.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          integration_uuid: 'integration-uuid',
          key: 'call',
        }),
      ],
      skipDuplicates: true,
    });
  });
});
