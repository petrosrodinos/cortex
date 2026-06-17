import axios from 'axios';
import { IntegrationProvider, OpenApiAuthType } from 'generated/prisma';
import { OpenApiAuthService } from './openapi-auth.service';
import { OpenApiIntegration } from './openapi.integration';

jest.mock('axios');

describe('OpenApiIntegration', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const prisma: any = {
    integrationAction: { findFirst: jest.fn() },
    openApiIntegration: { findUnique: jest.fn() },
  };
  const encryption: any = { decrypt: jest.fn() };
  const integration = new OpenApiIntegration(prisma, encryption, new OpenApiAuthService());

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.integrationAction.findFirst.mockResolvedValue({ enabled: true, key: 'getUser' });
    encryption.decrypt
      .mockReturnValueOnce(JSON.stringify({ type: OpenApiAuthType.BEARER }))
      .mockReturnValueOnce(JSON.stringify({ token: 'abc123' }));
    mockedAxios.request.mockResolvedValue({ data: { id: 'user_1' }, status: 200 });
    prisma.openApiIntegration.findUnique.mockResolvedValue({
      integration_uuid: 'integration-uuid',
      base_url: 'https://api.example.com/v1',
      auth_type: OpenApiAuthType.BEARER,
      auth_config: 'encrypted',
      generated_tools: [
        {
          key: 'getUser',
          name: 'openapi_integrat__getUser',
          description: 'Get user',
          parameters: {},
          operation: {
            operationId: 'getUser',
            method: 'GET',
            path: '/users/{id}',
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
              { name: 'expand', in: 'query', required: false, schema: { type: 'string' } },
            ],
          },
        },
      ],
    });
  });

  it('executes a generated tool as an authenticated HTTP request', async () => {
    const result = await integration.executeTool('openapi_integrat__getUser', { id: 'user_1', expand: 'teams' }, {
      uuid: 'integration-uuid',
      provider: IntegrationProvider.OPENAPI,
      config: 'encrypted',
    } as any);

    expect(mockedAxios.request).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.example.com/v1/users/user_1',
      headers: { Authorization: 'Bearer abc123' },
      params: { expand: 'teams' },
      data: undefined,
      timeout: 15_000,
    });
    expect(result).toEqual({ success: true, status: 200, data: { id: 'user_1' } });
  });
});
