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

  it('dispatches a globally-prefixed tool to the matching active integration handler', async () => {
    const integration = {
      uuid: 'integration-uuid',
      org_uuid: 'organization-uuid',
      provider: IntegrationProvider.GITHUB,
      status: IntegrationStatus.ACTIVE,
    };
    prisma.integration.findFirst.mockResolvedValue(integration);
    const handler: any = {
      provider: IntegrationProvider.GITHUB,
      getTools: jest.fn(),
      testConnection: jest.fn(),
      executeTool: jest.fn().mockResolvedValue({ success: true, data: [{ name: 'repo' }] }),
    };
    const registry = new IntegrationRegistry(prisma);
    registry.register(handler);

    await expect(registry.executeTool('organization-uuid', 'github__list_repos', {})).resolves.toEqual({
      success: true,
      data: [{ name: 'repo' }],
    });
    expect(handler.executeTool).toHaveBeenCalledWith('github__list_repos', {}, integration);
  });

  it('returns a 404-style error when no active integration can serve the tool', async () => {
    prisma.integration.findFirst.mockResolvedValue(null);
    const registry = new IntegrationRegistry(prisma);
    registry.register({
      provider: IntegrationProvider.GITHUB,
      getTools: jest.fn(),
      testConnection: jest.fn(),
      executeTool: jest.fn(),
    });

    await expect(registry.executeTool('organization-uuid', 'github__list_repos', {})).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects tool names that do not use the global provider prefix', async () => {
    const registry = new IntegrationRegistry(prisma);

    await expect(registry.executeTool('organization-uuid', 'list_repos', {})).rejects.toBeInstanceOf(ForbiddenException);
  });
});
