import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
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
            connection_tiers: [ComposioConnectionTier.ORG_SHARED],
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
      authConfigs: {
        list: jest.fn().mockResolvedValue({
          items: [{ id: 'ac_slack' }],
        }),
        create: jest.fn(),
      },
      connectedAccounts: {
        link: jest.fn().mockResolvedValue({
          redirectUrl: 'https://composio.example/connect',
          id: 'request-uuid',
        }),
        list: jest.fn().mockResolvedValue({ items: [] }),
        get: jest.fn(),
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
    const configService = {
      get: jest.fn().mockReturnValue('http://localhost:3001'),
    };
    const orgToolkitsService = {
      enableToolkit: jest.fn().mockResolvedValue({}),
    };

    return {
      service: new ComposioConnectionsService(
        prisma,
        composioClient as any,
        configService as any,
        orgToolkitsService as any,
      ),
      prisma,
      client,
      configService,
      orgToolkitsService,
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

    expect(client.authConfigs.list).toHaveBeenCalledWith({
      toolkit: 'slack',
    });
    expect(client.connectedAccounts.link).toHaveBeenCalledWith(
      'org:org-uuid',
      'ac_slack',
      {
        callbackUrl:
          'http://localhost:3001/dashboard/integrations/callback?toolkit_slug=slack',
      },
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

  it('mirrors a completed callback from connected_account_id and writes an account-connected audit event', async () => {
    const { service, prisma, client, orgToolkitsService } = createService({
      uuid: 'toolkit-uuid',
      slug: 'gmail',
      is_enabled: true,
      connection_tiers: [ComposioConnectionTier.USER_PERSONAL],
    });
    client.connectedAccounts.get.mockResolvedValue({
      id: 'account-uuid',
      userId: 'user:user-uuid',
      status: 'ACTIVE',
      name: 'Inbox',
    });

    await expect(
      service.verifyCallback('org-uuid', manager, {
        toolkit_slug: 'gmail',
        connected_account_id: 'account-uuid',
      }),
    ).resolves.toEqual({
      status: 'active',
      connected_account_id: 'account-uuid',
      toolkit_slug: 'gmail',
    });

    expect(client.connectedAccounts.get).toHaveBeenCalledWith('account-uuid');
    expect(prisma.composioConnectedAccount.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          org_uuid: 'org-uuid',
          user_uuid: 'user-uuid',
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
    expect(orgToolkitsService.enableToolkit).toHaveBeenCalledWith(
      'org-uuid',
      'gmail',
    );
  });

  it('falls back to the derived composio user id when the remote account omits it', async () => {
    const { service, prisma, client } = createService({
      uuid: 'toolkit-uuid',
      slug: 'resend',
      is_enabled: true,
      connection_tiers: [ComposioConnectionTier.ORG_SHARED],
    });
    client.connectedAccounts.get.mockResolvedValue({
      id: 'ca_vHW28l8qCiTg',
      status: 'ACTIVE',
    });
    prisma.composioConnectedAccount.upsert.mockResolvedValue({
      composio_account_id: 'ca_vHW28l8qCiTg',
      status: ComposioAccountStatus.ACTIVE,
    });

    await expect(
      service.verifyCallback('org-uuid', manager, {
        toolkit_slug: 'resend',
        connected_account_id: 'ca_vHW28l8qCiTg',
        connection_tier: ComposioConnectionTier.ORG_SHARED,
      }),
    ).resolves.toEqual({
      status: 'active',
      connected_account_id: 'ca_vHW28l8qCiTg',
      toolkit_slug: 'resend',
    });

    expect(prisma.composioConnectedAccount.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          composio_user_id: 'org:org-uuid',
          composio_account_id: 'ca_vHW28l8qCiTg',
        }),
      }),
    );
  });

  it('mirrors a completed callback and writes an account-connected audit event', async () => {
    const { service, prisma, client, orgToolkitsService } = createService({
      uuid: 'toolkit-uuid',
      slug: 'gmail',
      is_enabled: true,
      connection_tiers: [ComposioConnectionTier.USER_PERSONAL],
    });

    await expect(
      service.verifyCallback('org-uuid', manager, {
        toolkit_slug: 'gmail',
        connection_request_id: 'request-uuid',
      }),
    ).resolves.toEqual({
      status: 'active',
      connected_account_id: 'account-uuid',
      toolkit_slug: 'gmail',
    });

    expect(client.connectedAccounts.waitForConnection).toHaveBeenCalledWith(
      'request-uuid',
      10_000,
    );
    expect(prisma.composioConnectedAccount.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          org_uuid: 'org-uuid',
          user_uuid: 'user-uuid',
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
    expect(orgToolkitsService.enableToolkit).toHaveBeenCalledWith(
      'org-uuid',
      'gmail',
    );
  });

  it('uses an existing custom auth config without creating a managed config', async () => {
    const { service, client } = createService({
      uuid: 'toolkit-uuid',
      slug: 'resend',
      is_enabled: true,
      connection_tiers: [ComposioConnectionTier.ORG_SHARED],
    });
    client.authConfigs.list.mockResolvedValue({
      items: [{ id: 'ac_resend_custom', isComposioManaged: false }],
    });

    await expect(
      service.connect('org-uuid', manager, { toolkit_slug: 'resend' }),
    ).resolves.toEqual({
      redirect_url: 'https://composio.example/connect',
      connection_request_id: 'request-uuid',
      toolkit_slug: 'resend',
    });

    expect(client.authConfigs.create).not.toHaveBeenCalled();
    expect(client.connectedAccounts.link).toHaveBeenCalledWith(
      'org:org-uuid',
      'ac_resend_custom',
      {
        callbackUrl:
          'http://localhost:3001/dashboard/integrations/callback?toolkit_slug=resend',
      },
    );
  });

  it('creates a custom API key auth config when managed auth is unavailable', async () => {
    const { service, client } = createService({
      uuid: 'toolkit-uuid',
      slug: 'resend',
      is_enabled: true,
      auth_schemes: ['API_KEY'],
      connection_tiers: [ComposioConnectionTier.ORG_SHARED],
    });
    client.authConfigs.list.mockResolvedValue({ items: [] });
    client.authConfigs.create
      .mockRejectedValueOnce({
        error: {
          error: {
            slug: 'Auth_Config_DefaultAuthConfigNotFound',
            message:
              'Default auth config not found for toolkit "resend". Composio does not have managed credentials for this toolkit.',
          },
        },
      })
      .mockResolvedValueOnce({ id: 'ac_resend_custom' });

    await expect(
      service.connect('org-uuid', manager, { toolkit_slug: 'resend' }),
    ).resolves.toEqual({
      redirect_url: 'https://composio.example/connect',
      connection_request_id: 'request-uuid',
      toolkit_slug: 'resend',
    });

    expect(client.authConfigs.create).toHaveBeenNthCalledWith(1, 'resend', {
      type: 'use_composio_managed_auth',
      name: 'resend Composio auth',
    });
    expect(client.authConfigs.create).toHaveBeenNthCalledWith(2, 'resend', {
      type: 'use_custom_auth',
      name: 'resend user credentials',
      authScheme: 'API_KEY',
      credentials: {},
    });
    expect(client.connectedAccounts.link).toHaveBeenCalledWith(
      'org:org-uuid',
      'ac_resend_custom',
      {
        callbackUrl:
          'http://localhost:3001/dashboard/integrations/callback?toolkit_slug=resend',
      },
    );
  });

  it('passes allowMultiple when the toolkit supports org and personal tiers', async () => {
    const { service, client } = createService({
      uuid: 'toolkit-uuid',
      slug: 'gmail',
      is_enabled: true,
      connection_tiers: [
        ComposioConnectionTier.ORG_SHARED,
        ComposioConnectionTier.USER_PERSONAL,
      ],
    });
    client.authConfigs.list.mockResolvedValue({
      items: [{ id: 'ac_gmail' }],
    });

    await service.connect('org-uuid', manager, {
      toolkit_slug: 'gmail',
      connection_tier: ComposioConnectionTier.USER_PERSONAL,
    });

    expect(client.connectedAccounts.link).toHaveBeenCalledWith(
      'user:user-uuid',
      'ac_gmail',
      {
        callbackUrl:
          'http://localhost:3001/dashboard/integrations/callback?toolkit_slug=gmail',
        allowMultiple: true,
      },
    );
  });

  it('syncs an existing active account instead of creating a new link for single-tier toolkits', async () => {
    const { service, client, prisma } = createService({
      uuid: 'toolkit-uuid',
      slug: 'resend',
      is_enabled: true,
      connection_tiers: [ComposioConnectionTier.ORG_SHARED],
    });
    client.authConfigs.list.mockResolvedValue({
      items: [{ id: 'ac_resend' }],
    });
    client.connectedAccounts.list.mockResolvedValue({
      items: [{ id: 'ca_vHW28l8qCiTg', status: 'ACTIVE' }],
    });
    prisma.composioConnectedAccount.upsert.mockResolvedValue({
      composio_account_id: 'ca_vHW28l8qCiTg',
      status: ComposioAccountStatus.ACTIVE,
    });

    await expect(
      service.connect('org-uuid', manager, {
        toolkit_slug: 'resend',
        connection_tier: ComposioConnectionTier.ORG_SHARED,
      }),
    ).resolves.toEqual({
      toolkit_slug: 'resend',
      status: 'active',
      connected_account_id: 'ca_vHW28l8qCiTg',
    });

    expect(client.connectedAccounts.link).not.toHaveBeenCalled();
    expect(prisma.composioConnectedAccount.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          composio_account_id: 'ca_vHW28l8qCiTg',
          composio_user_id: 'org:org-uuid',
        }),
      }),
    );
  });

  it('returns not found when connecting a disabled toolkit', async () => {
    const { service } = createService({
      uuid: 'toolkit-uuid',
      slug: 'slack',
      is_enabled: false,
      connection_tiers: [ComposioConnectionTier.ORG_SHARED],
    });

    await expect(
      service.connect('org-uuid', manager, { toolkit_slug: 'slack' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
