import { IntegrationProvider, IntegrationStatus, OpenApiAuthType } from 'generated/prisma';
import { OpenApiIntegrationsService } from './openapi-integrations.service';

describe('OpenApiIntegrationsService', () => {
  const prisma: any = {
    integration: { create: jest.fn(), findUniqueOrThrow: jest.fn() },
    openApiIntegration: { create: jest.fn() },
    integrationAction: { createMany: jest.fn() },
    $transaction: jest.fn(),
  };
  const encryption: any = { encrypt: jest.fn() };
  const parser: any = { parse: jest.fn() };
  const generator: any = { generateTools: jest.fn() };
  const auth: any = { inferAuthConfig: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((callback) => callback(prisma));
    encryption.encrypt.mockImplementation((value) => `encrypted:${value}`);
    parser.parse.mockResolvedValue({
      baseUrl: 'https://api.example.com',
      specJson: { openapi: '3.0.3' },
      operations: [{ operationId: 'getUser', method: 'GET', path: '/users/{id}', parameters: [] }],
      securitySchemes: {},
    });
    generator.generateTools.mockReturnValue([
      { key: 'getUser', name: 'openapi_abcdef12__getUser', description: 'Get user', parameters: {}, operation: {} },
    ]);
    auth.inferAuthConfig.mockReturnValue({ type: OpenApiAuthType.BEARER });
    prisma.integration.create.mockResolvedValue({
      uuid: 'abcdef12-3456',
      provider: IntegrationProvider.OPENAPI,
      status: IntegrationStatus.ACTIVE,
    });
    prisma.integration.findUniqueOrThrow.mockResolvedValue({
      uuid: 'abcdef12-3456',
      provider: IntegrationProvider.OPENAPI,
      config: 'encrypted:{}',
      openapi: { auth_config: 'encrypted:{}' },
      actions: [],
    });
  });

  it('parses spec, encrypts credentials/auth config, stores generated tools, and seeds actions', async () => {
    const service = new OpenApiIntegrationsService(prisma, encryption, parser, generator, auth);

    await service.create('org-uuid', {
      name: 'Public API',
      specUrl: 'https://api.example.com/openapi.json',
      authType: OpenApiAuthType.BEARER,
      credentials: { token: 'secret' },
    });

    expect(parser.parse).toHaveBeenCalledWith({ specUrl: 'https://api.example.com/openapi.json', rawJson: undefined });
    expect(generator.generateTools).toHaveBeenCalledWith(expect.objectContaining({ baseUrl: 'https://api.example.com' }), 'abcdef12-3456');
    expect(encryption.encrypt).toHaveBeenCalledWith(JSON.stringify({ token: 'secret' }));
    expect(encryption.encrypt).toHaveBeenCalledWith(JSON.stringify({ type: OpenApiAuthType.BEARER }));
    expect(prisma.openApiIntegration.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        integration_uuid: 'abcdef12-3456',
        spec_url: 'https://api.example.com/openapi.json',
        base_url: 'https://api.example.com',
      }),
    });
    expect(prisma.integrationAction.createMany).toHaveBeenCalledWith({
      data: [expect.objectContaining({ integration_uuid: 'abcdef12-3456', key: 'getUser' })],
      skipDuplicates: true,
    });
  });
});
