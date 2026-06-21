import { ConfigService } from '@nestjs/config';
import {
  ComposioAccountStatus,
  ComposioConnectionTier,
} from 'generated/prisma';
import { ComposioSessionService } from './composio-session.service';

describe('ComposioSessionService', () => {
  const createService = (conversation?: { composio_session_id: string | null }) => {
    const prisma: any = {
      conversation: {
        findFirstOrThrow: jest.fn().mockResolvedValue({
          uuid: 'conversation-uuid',
          composio_session_id: conversation?.composio_session_id ?? null,
        }),
        update: jest.fn(),
      },
      organisationEnabledToolkit: {
        findMany: jest
          .fn()
          .mockResolvedValueOnce([
            { toolkit: { slug: 'slack' } },
            { toolkit: { slug: 'gmail' } },
          ])
          .mockResolvedValueOnce([
            {
              toolkit: {
                slug: 'slack',
                tools: [
                  { slug: 'slack_send_message', permissions: [] },
                  {
                    slug: 'slack_admin_action',
                    permissions: [{ enabled: false }],
                  },
                ],
              },
            },
            {
              toolkit: {
                slug: 'gmail',
                tools: [{ slug: 'gmail_send_email', permissions: [] }],
              },
            },
          ]),
      },
      composioToolkit: {
        findMany: jest.fn().mockResolvedValue([
          {
            uuid: 'slack-toolkit-uuid',
            slug: 'slack',
            connection_tiers: [
              ComposioConnectionTier.ORG_SHARED,
              ComposioConnectionTier.USER_PERSONAL,
            ],
          },
          {
            uuid: 'gmail-toolkit-uuid',
            slug: 'gmail',
            connection_tiers: [ComposioConnectionTier.USER_PERSONAL],
          },
        ]),
      },
      composioConnectedAccount: {
        findMany: jest.fn().mockResolvedValue([
          {
            composio_account_id: 'slack-account',
            composio_user_id: 'org:org-uuid',
            user_uuid: null,
            toolkit: {
              slug: 'slack',
            },
          },
          {
            composio_account_id: 'gmail-account',
            composio_user_id: 'user:user-uuid',
            user_uuid: 'user-uuid',
            toolkit: {
              slug: 'gmail',
            },
          },
        ]),
      },
    };
    const session = {
      sessionId: 'new-session-id',
      update: jest.fn(),
    };
    const client = {
      create: jest.fn().mockResolvedValue(session),
      use: jest.fn().mockResolvedValue(session),
    };
    const composioClient = {
      getClient: jest.fn().mockReturnValue(client),
    };
    const config = {
      get: jest.fn().mockReturnValue('https://app.example.com'),
    } as unknown as ConfigService;

    return {
      service: new ComposioSessionService(
        prisma,
        config,
        composioClient as any,
      ),
      prisma,
      client,
      session,
    };
  };

  it('creates a session with scoped toolkits, tools, connected accounts, and callback URL', async () => {
    const { service, prisma, client } = createService();

    await service.resolveSession(
      'conversation-uuid',
      'org-uuid',
      'user-uuid',
      ['slack', 'gmail'],
    );

    expect(prisma.organisationEnabledToolkit.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: expect.objectContaining({
          org_uuid: 'org-uuid',
          toolkit: expect.objectContaining({
            slug: { in: ['slack', 'gmail'] },
          }),
        }),
      }),
    );
    expect(prisma.composioConnectedAccount.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: ComposioAccountStatus.ACTIVE,
        }),
      }),
    );
    expect(client.create).toHaveBeenCalledWith(
      'user:user-uuid',
      expect.objectContaining({
        toolkits: { enable: ['slack', 'gmail'] },
        tools: {
          slack: ['slack_send_message'],
          gmail: ['gmail_send_email'],
        },
        connectedAccounts: {
          gmail: 'gmail-account',
        },
        manageConnections: {
          enable: true,
          callbackUrl:
            'https://app.example.com/dashboard/integrations/callback',
        },
      }),
    );
    expect(prisma.conversation.update).toHaveBeenCalledWith({
      where: { uuid: 'conversation-uuid' },
      data: { composio_session_id: 'new-session-id' },
    });
  });

  it('creates an org-scoped session when only org-shared toolkits are enabled', async () => {
    const { service, prisma, client } = createService();
    prisma.composioToolkit.findMany.mockResolvedValue([
      {
        connection_tiers: [ComposioConnectionTier.ORG_SHARED],
      },
      {
        connection_tiers: [ComposioConnectionTier.ORG_SHARED],
      },
    ]);
    prisma.composioConnectedAccount.findMany.mockResolvedValue([
      {
        composio_account_id: 'ca_linear',
        composio_user_id: 'org:org-uuid',
        user_uuid: null,
        toolkit: { slug: 'linear' },
      },
      {
        composio_account_id: 'ca_resend',
        composio_user_id: 'org:org-uuid',
        user_uuid: null,
        toolkit: { slug: 'resend' },
      },
    ]);

    await service.resolveSession(
      'conversation-uuid',
      'org-uuid',
      'user-uuid',
      ['linear', 'resend'],
    );

    expect(client.create).toHaveBeenCalledWith(
      'org:org-uuid',
      expect.objectContaining({
        connectedAccounts: {
          linear: 'ca_linear',
          resend: 'ca_resend',
        },
      }),
    );
  });

  it('creates an org-scoped session when tier map requests org tier for all scoped toolkits', async () => {
    const { service, client, prisma } = createService();
    prisma.organisationEnabledToolkit.findMany
      .mockReset()
      .mockResolvedValueOnce([{ toolkit: { slug: 'slack' } }])
      .mockResolvedValueOnce([
        {
          toolkit: {
            slug: 'slack',
            tools: [{ slug: 'slack_send_message', permissions: [] }],
          },
        },
      ]);
    prisma.composioConnectedAccount.findMany.mockResolvedValue([
      {
        composio_account_id: 'slack-org-account',
        composio_user_id: 'org:org-uuid',
        user_uuid: null,
        toolkit: { slug: 'slack' },
      },
      {
        composio_account_id: 'slack-user-account',
        composio_user_id: 'user:user-uuid',
        user_uuid: 'user-uuid',
        toolkit: { slug: 'slack' },
      },
    ]);

    await service.resolveSession(
      'conversation-uuid',
      'org-uuid',
      'user-uuid',
      ['slack'],
      { slack: ComposioConnectionTier.ORG_SHARED },
    );

    expect(client.create).toHaveBeenCalledWith(
      'org:org-uuid',
      expect.objectContaining({
        connectedAccounts: {
          slack: 'slack-org-account',
        },
      }),
    );
  });

  it('does not bind org accounts to user-scoped sessions when tiers are mixed', async () => {
    const { service, client, prisma } = createService();
    prisma.organisationEnabledToolkit.findMany
      .mockReset()
      .mockResolvedValueOnce([
        { toolkit: { slug: 'slack' } },
        { toolkit: { slug: 'gmail' } },
      ])
      .mockResolvedValueOnce([
        {
          toolkit: {
            slug: 'slack',
            tools: [{ slug: 'slack_send_message', permissions: [] }],
          },
        },
        {
          toolkit: {
            slug: 'gmail',
            tools: [{ slug: 'gmail_send_email', permissions: [] }],
          },
        },
      ]);
    prisma.composioConnectedAccount.findMany.mockResolvedValue([
      {
        composio_account_id: 'slack-org-account',
        composio_user_id: 'org:org-uuid',
        user_uuid: null,
        toolkit: { slug: 'slack' },
      },
      {
        composio_account_id: 'gmail-account',
        composio_user_id: 'user:user-uuid',
        user_uuid: 'user-uuid',
        toolkit: { slug: 'gmail' },
      },
    ]);

    await service.resolveSession(
      'conversation-uuid',
      'org-uuid',
      'user-uuid',
      ['slack', 'gmail'],
      {
        slack: ComposioConnectionTier.ORG_SHARED,
        gmail: ComposioConnectionTier.USER_PERSONAL,
      },
    );

    expect(client.create).toHaveBeenCalledWith(
      'user:user-uuid',
      expect.objectContaining({
        connectedAccounts: {
          gmail: 'gmail-account',
        },
      }),
    );
  });

  it('recreates the session when switching to org-scoped toolkits', async () => {
    const { service, client, session, prisma } = createService({
      composio_session_id: 'existing-user-session',
    });
    prisma.composioConnectedAccount.findMany.mockResolvedValue([
      {
        composio_account_id: 'resend-org-account',
        composio_user_id: 'org:org-uuid',
        user_uuid: null,
        toolkit: { slug: 'resend' },
      },
    ]);
    prisma.composioToolkit.findMany.mockResolvedValue([
      {
        uuid: 'resend-toolkit-uuid',
        slug: 'resend',
        connection_tiers: [
          ComposioConnectionTier.ORG_SHARED,
          ComposioConnectionTier.USER_PERSONAL,
        ],
      },
    ]);
    prisma.organisationEnabledToolkit.findMany
      .mockReset()
      .mockResolvedValueOnce([{ toolkit: { slug: 'resend' } }])
      .mockResolvedValueOnce([
        {
          toolkit: {
            slug: 'resend',
            tools: [{ slug: 'resend_send_email', permissions: [] }],
          },
        },
      ]);

    await service.resolveSession(
      'conversation-uuid',
      'org-uuid',
      'user-uuid',
      ['resend'],
      { resend: ComposioConnectionTier.ORG_SHARED },
    );

    expect(prisma.conversation.update).toHaveBeenCalledWith({
      where: { uuid: 'conversation-uuid' },
      data: { composio_session_id: null },
    });
    expect(client.use).not.toHaveBeenCalled();
    expect(client.create).toHaveBeenCalledWith(
      'org:org-uuid',
      expect.objectContaining({
        connectedAccounts: {
          resend: 'resend-org-account',
        },
      }),
    );
    expect(session.update).not.toHaveBeenCalled();
  });

  it('updates an existing session instead of creating a new one', async () => {
    const { service, client, session, prisma } = createService({
      composio_session_id: 'existing-session-id',
    });

    await service.resolveSession('conversation-uuid', 'org-uuid', 'user-uuid');

    expect(client.use).toHaveBeenCalledWith('existing-session-id');
    expect(session.update).toHaveBeenCalled();
    expect(client.create).not.toHaveBeenCalled();
    expect(prisma.conversation.update).not.toHaveBeenCalled();
  });
});
