import { ComposioConnectionTier } from 'generated/prisma';
import { CapabilitiesToolsFactory } from './capabilities-tools.factory';
import { CapabilitiesToolsService } from './capabilities-tools.service';

describe('CapabilitiesToolsFactory', () => {
  it('lists integrations and toolkits on demand', async () => {
    const capabilities = {
      listIntegrations: jest.fn().mockResolvedValue({ integrations: [] }),
      listToolkits: jest.fn().mockResolvedValue({ toolkits: [{ slug: 'linear', name: 'Linear', is_connected: true }] }),
      getDatabaseSchema: jest.fn(),
    };
    const prisma = { toolCall: { create: jest.fn() } };
    const idempotency = { getCachedResult: jest.fn().mockResolvedValue(null) };
    const factory = new CapabilitiesToolsFactory(
      capabilities as unknown as CapabilitiesToolsService,
      prisma as any,
      idempotency as any,
    );
    const tools = factory.buildTools({
      organizationUuid: 'org-uuid',
      userUuid: 'user-uuid',
      executionUuid: 'execution-uuid',
      toolkitSlugs: ['linear'],
      toolkitConnectionTiers: { linear: ComposioConnectionTier.ORG_SHARED },
    });

    await expect((tools.capabilities__list_toolkits as any).execute({})).resolves.toEqual({
      toolkits: [{ slug: 'linear', name: 'Linear', is_connected: true }],
    });

    expect(capabilities.listToolkits).toHaveBeenCalledWith({
      organizationUuid: 'org-uuid',
      userUuid: 'user-uuid',
      integrationUuids: undefined,
      toolkitSlugs: ['linear'],
      toolkitConnectionTiers: { linear: ComposioConnectionTier.ORG_SHARED },
    });
  });
});
