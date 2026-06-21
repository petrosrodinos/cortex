import { ForbiddenException } from '@nestjs/common';
import { ToolCallStatus } from 'generated/prisma';
import { ComposioToolProvider } from './composio-tool.provider';

describe('ComposioToolProvider', () => {
  const createProvider = () => {
    const prisma: any = {
      organisationEnabledToolkit: {
        findMany: jest.fn().mockResolvedValue([
          {
            toolkit: {
              tools: [
                {
                  slug: 'slack_send_message',
                  permissions: [
                    {
                      enabled: true,
                      requires_approval: true,
                      required_permission_key: 'org:integrations:use',
                    },
                  ],
                },
                {
                  slug: 'slack_admin_action',
                  permissions: [
                    {
                      enabled: false,
                      requires_approval: false,
                      required_permission_key: null,
                    },
                  ],
                },
              ],
            },
          },
        ]),
      },
      toolCall: {
        create: jest.fn(),
      },
    };
    const session = {
      sessionId: 'session-uuid',
      tools: jest.fn().mockResolvedValue({
        COMPOSIO_SEARCH_TOOLS: {
          description: 'Search Composio tools',
          execute: jest.fn().mockResolvedValue({ tools: [] }),
        },
        slack_send_message: {
          description: 'Send a message',
          execute: jest.fn().mockResolvedValue({ ok: true }),
        },
        slack_admin_action: {
          description: 'Admin action',
          execute: jest.fn(),
        },
      }),
    };
    const sessions = {
      resolveSession: jest.fn().mockResolvedValue(session),
      getEnabledToolkitSlugs: jest.fn().mockResolvedValue(['slack']),
    };
    const progress = {
      toolStart: jest.fn().mockReturnValue('tool-call-uuid'),
      toolComplete: jest.fn(),
    };
    const context = {
      organizationUuid: 'org-uuid',
      userUuid: 'user-uuid',
      conversationUuid: 'conversation-uuid',
      executionUuid: 'execution-uuid',
      userPermissions: ['org:integrations:use'],
      documentUuids: [],
      toolkitSlugs: ['slack'],
      progress,
    };

    return {
      provider: new ComposioToolProvider(prisma, sessions as any),
      prisma,
      sessions,
      session,
      context: context as any,
      progress,
    };
  };

  it('resolves a scoped Composio session and exposes only enabled permitted tools', async () => {
    const { provider, sessions, context } = createProvider();

    const tools = await provider.buildTools(context);

    expect(sessions.resolveSession).toHaveBeenCalledWith(
      'conversation-uuid',
      'org-uuid',
      'user-uuid',
      ['slack'],
    );
    expect(Object.keys(tools)).toEqual([
      'COMPOSIO_SEARCH_TOOLS',
      'slack_send_message',
    ]);
    expect((tools.slack_send_message as any).needsApproval).toBe(true);
  });

  it('executes Composio tools through the session and logs successful calls', async () => {
    const { provider, prisma, context, progress } = createProvider();
    const tools = await provider.buildTools(context);

    await expect(
      (tools.slack_send_message as any).execute({ text: 'hello' }),
    ).resolves.toEqual({ ok: true });

    expect(progress.toolStart).toHaveBeenCalledWith('slack_send_message', {
      text: 'hello',
    });
    expect(prisma.toolCall.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        uuid: 'tool-call-uuid',
        execution_uuid: 'execution-uuid',
        provider_type: 'COMPOSIO',
        composio_tool_slug: 'slack_send_message',
        composio_session_id: 'session-uuid',
        status: ToolCallStatus.SUCCESS,
        output: { ok: true },
      }),
    });
    expect(progress.toolComplete).toHaveBeenCalledWith(
      'tool-call-uuid',
      expect.objectContaining({
        toolName: 'slack_send_message',
        success: true,
      }),
    );
  });

  it('does not expose toolkit tools when the user lacks the required permission', async () => {
    const { provider, context } = createProvider();

    await expect(
      provider.buildTools({ ...context, userPermissions: [] }),
    ).resolves.toEqual({
      COMPOSIO_SEARCH_TOOLS: expect.any(Object),
    });
  });

  it('rechecks permission during execution', async () => {
    const { provider, context } = createProvider();
    const tools = await provider.buildTools(context);

    context.userPermissions.length = 0;

    await expect(
      (tools.slack_send_message as any).execute({ text: 'hello' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
