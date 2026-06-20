import { ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  ComposioAccountStatus,
  ComposioConnectionTier,
} from 'generated/prisma';
import { ComposioConnectionsService } from './composio-connections.service';

describe('ComposioConnectionsService', () => {
  const createService = (toolkit?: any) => {
    const prisma: any = {
      composioToolkit: {
        findUnique: jest.fn().mockResolvedValue(
          toolkit ?? {
            uuid: 'toolkit-uuid',
            slug: 'slack',
            is_enabled: true,
            connection_tier: ComposioConnectionTier.ORG_SHARED,
          },
        ),
      },
      composioConnectedAccount: {
        upsert: jest.fn().mockResolvedValue({
          composio_account_id: 'account-uuid',
          status: ComposioAccountStatus.ACTIVE,
        }),
        findFirstOrThrow: jest.fn(),
        delete: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
    };
    const client = {
      toolkits: {
        authorize: jest.fn().mockResolvedValue({
          redirectUrl: 'https://composio.example/connect',
          id: 'request-uuid',
        }),
      },
      connectedAccounts: {
        waitForConnection: jest.fn().mockResolvedValue({
          id: 'account-uuid',
          userId: 'org:org-uuid',
          status: 'ACTIVE',
          name: 'Workspace',
        }),
        delete: jest.fn(),
      },
    };
    const composioClient = {
      getClient: jest.fn().mockReturnValue(client),
    };

    return {
      service: new ComposioConnectionsService(prisma, composioClient as any),
      prisma,
      client,
    };
  };

  const manager = {
    uuid: 'user-uuid',
    organization_permissions: ['org:integrations:manage'],
  };

  it('creates an org-shared connect link only for integration managers and audits it', async () => {
    const { service, prisma, client } = createService();

    await expect(
      service.connect('org-uuid', manager, { toolkit_slug: 'slack' }),
    ).resolves.toEqual({
      redirect_url: 'https://composio.example/connect',
      connection_request_id: 'request-uuid',
      toolkit_slug: 'slack',
    });

    expect(client.toolkits.authorize).toHaveBeenCalledWith(
      'org:org-uuid',
      'slack',
    );
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: 'composio.connect_link_created',
        org_uuid: 'org-uuid',
        user_uuid: 'user-uuid',
        resource_id: 'slack',
      }),
    });
  });

  it('rejects org-shared connections without manage permission', async () => {
    const { service } = createService();

    await expect(
      service.connect(
        'org-uuid',
        { uuid: 'user-uuid', organization_permissions: [] },
        { toolkit_slug: 'slack' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('mirrors a completed callback and writes an account-connected audit event', async () => {
    const { service, prisma, client } = createService({
      uuid: 'toolkit-uuid',
      slug: 'gmail',
      is_enabled: true,
      connection_tier: ComposioConnectionTier.USER_PERSONAL,
    });

    await expect(
      service.verifyCallback('org-uuid', manager, {
        toolkit_slug: 'gmail',
        connection_request_id: 'request-uuid',
      }),
    ).resolves.toEqual({
      status: 'active',
      connected_account_id: 'account-uuid',
    });

    expect(client.connectedAccounts.waitForConnection).toHaveBeenCalledWith(
      'request-uuid',
      10_000,
    );
    expect(prisma.composioConnectedAccount.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          org_uuid: 'org-uuid',
          user_uuid: null,
          toolkit_uuid: 'toolkit-uuid',
          status: ComposioAccountStatus.ACTIVE,
        }),
      }),
    );
    expect(prisma.auditLog.create).toHaveBeenLastCalledWith({
      data: expect.objectContaining({
        action: 'composio.account_connected',
        resource_id: 'account-uuid',
      }),
    });
  });

  it('returns not found when connecting a disabled toolkit', async () => {
    const { service } = createService({
      uuid: 'toolkit-uuid',
      slug: 'slack',
      is_enabled: false,
      connection_tier: ComposioConnectionTier.ORG_SHARED,
    });

    await expect(
      service.connect('org-uuid', manager, { toolkit_slug: 'slack' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
