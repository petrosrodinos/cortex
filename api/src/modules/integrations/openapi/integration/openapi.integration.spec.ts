import axios from 'axios';
import { IntegrationProvider, OpenApiAuthType } from 'generated/prisma';
import { OpenApiAuthService } from '../auth/openapi-auth.service';
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
      spec_url: 'https://api.example.com/openapi.json',
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
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
              { name: 'expand', in: 'query', required: false, schema: { type: 'string' } },
            ],
          },
        },
        {
          key: 'loginUser',
          name: 'openapi_integrat__loginUser',
          description: 'Login user',
          parameters: {},
          operation: {
            operationId: 'loginUser',
            method: 'GET',
            path: '/user/login',
            parameters: [
              { name: 'username', in: 'query', required: false, schema: { type: 'string' } },
              { name: 'password', in: 'query', required: false, schema: { type: 'string' } },
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

  it('skips auth headers for operations without security requirements', async () => {
    encryption.decrypt
      .mockReset()
      .mockReturnValueOnce(JSON.stringify({ type: OpenApiAuthType.BEARER }))
      .mockReturnValueOnce(JSON.stringify({ token: 'abc123' }));
    prisma.integrationAction.findFirst.mockResolvedValue({ enabled: true, key: 'loginUser' });

    await integration.executeTool(
      'openapi_integrat__loginUser',
      { username: 'petrosrod', password: '12345' },
      {
        uuid: 'integration-uuid',
        provider: IntegrationProvider.OPENAPI,
        config: 'encrypted',
      } as any,
    );

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.example.com/v1/user/login',
        headers: {},
        params: { username: 'petrosrod', password: '12345' },
      }),
    );
  });

  it('resolves relative base URLs using the stored spec URL', async () => {
    prisma.openApiIntegration.findUnique.mockResolvedValue({
      integration_uuid: 'integration-uuid',
      spec_url: 'https://petstore3.swagger.io/api/v3/openapi.json',
      base_url: '/api/v3',
      auth_type: OpenApiAuthType.NONE,
      auth_config: 'encrypted',
      generated_tools: [
        {
          key: 'loginUser',
          name: 'openapi_integrat__loginUser',
          description: 'Login user',
          parameters: {},
          operation: {
            operationId: 'loginUser',
            method: 'GET',
            path: '/user/login',
            parameters: [
              { name: 'username', in: 'query', required: false, schema: { type: 'string' } },
              { name: 'password', in: 'query', required: false, schema: { type: 'string' } },
            ],
          },
        },
      ],
    });
    encryption.decrypt
      .mockReset()
      .mockReturnValueOnce(JSON.stringify({ type: OpenApiAuthType.NONE }))
      .mockReturnValueOnce(JSON.stringify({}));
    prisma.integrationAction.findFirst.mockResolvedValue({ enabled: true, key: 'loginUser' });
    mockedAxios.request.mockResolvedValue({ data: 'logged-in-session-id', status: 200 });

    const result = await integration.executeTool(
      'openapi_integrat__loginUser',
      { username: 'petrosrod', password: '12345' },
      {
        uuid: 'integration-uuid',
        provider: IntegrationProvider.OPENAPI,
        config: 'encrypted',
      } as any,
    );

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://petstore3.swagger.io/api/v3/user/login',
      }),
    );
    expect(result).toEqual({
      success: true,
      status: 200,
      data: 'logged-in-session-id',
    });
  });
});
