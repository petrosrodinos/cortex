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
            connection_tier: ComposioConnectionTier.ORG_SHARED,
          },
          {
            uuid: 'gmail-toolkit-uuid',
            slug: 'gmail',
            connection_tier: ComposioConnectionTier.USER_PERSONAL,
          },
        ]),
      },
      composioConnectedAccount: {
        findMany: jest.fn().mockResolvedValue([
          {
            composio_account_id: 'slack-account',
            user_uuid: null,
            toolkit: {
              slug: 'slack',
              connection_tier: ComposioConnectionTier.ORG_SHARED,
            },
          },
          {
            composio_account_id: 'gmail-account',
            user_uuid: 'user-uuid',
            toolkit: {
              slug: 'gmail',
              connection_tier: ComposioConnectionTier.USER_PERSONAL,
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
          slack: 'slack-account',
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
