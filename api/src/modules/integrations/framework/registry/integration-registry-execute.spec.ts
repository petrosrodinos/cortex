import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { IntegrationRegistry } from './integration-registry.service';
import { IntegrationProvider, IntegrationStatus } from 'generated/prisma';

describe('IntegrationRegistry executeTool', () => {
  const prisma: any = {
    integration: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects tool names that do not use the global provider prefix', async () => {
    const registry = new IntegrationRegistry(prisma);

    await expect(
      registry.executeTool('organization-uuid', 'list_repos', {}),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects removed SaaS-style provider-prefixed tools', async () => {
    const registry = new IntegrationRegistry(prisma);

    await expect(
      registry.executeTool('organization-uuid', 'github__list_repos', {}),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('dispatches a prefixed MCP tool to the matching active MCP integration handler', async () => {
    const integration = {
      uuid: 'mcp-integration-uuid',
      org_uuid: 'organization-uuid',
      provider: IntegrationProvider.MCP,
      status: IntegrationStatus.ACTIVE,
    };
    prisma.integration.findFirst.mockResolvedValue(integration);
    const handler: any = {
      provider: IntegrationProvider.MCP,
      getTools: jest.fn(),
      testConnection: jest.fn(),
      executeTool: jest
        .fn()
        .mockResolvedValue({ success: true, data: { ok: true } }),
    };
    const registry = new IntegrationRegistry(prisma);
    registry.register(handler);

    await expect(
      registry.executeTool('organization-uuid', 'mcp_mcp-inte__search', {
        query: 'test',
      }),
    ).resolves.toEqual({
      success: true,
      data: { ok: true },
    });
    expect(handler.executeTool).toHaveBeenCalledWith(
      'mcp_mcp-inte__search',
      { query: 'test' },
      integration,
    );
  });
});
