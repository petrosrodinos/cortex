import { AgentExecutionStatus, ComposioConnectionTier, MessageRole } from 'generated/prisma';
import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  const createService = () => {
    const prisma = {
      conversation: {
        findFirst: jest.fn().mockResolvedValue({
          uuid: 'conversation-uuid',
          title: 'Existing conversation',
        }),
        update: jest.fn().mockResolvedValue({}),
      },
      document: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      message: {
        create: jest.fn().mockResolvedValue({ uuid: 'message-uuid' }),
        count: jest.fn().mockResolvedValue(2),
      },
      agentExecution: {
        create: jest.fn().mockResolvedValue({ uuid: 'execution-uuid' }),
      },
    };
    const organizations = {
      requireActiveMember: jest.fn().mockResolvedValue(undefined),
    };
    const memory = {
      invalidate: jest.fn().mockResolvedValue(undefined),
      scheduleHydrateCacheFromDb: jest.fn(),
    };
    const providerFactory = {
      resolveProvider: jest.fn(),
    };
    const gcs = {
      getSignedUrlForObjectPath: jest.fn(),
    };
    const agentQueue = {
      add: jest.fn().mockResolvedValue({}),
    };
    const capabilities = {
      resolveAgentToolScope: jest.fn().mockResolvedValue({
        integrationUuids: undefined,
        toolkitSlugs: ['gmail', 'slack'],
      }),
    };

    return {
      service: new MessagesService(
        prisma as any,
        organizations as any,
        memory as any,
        providerFactory as any,
        gcs as any,
        agentQueue as any,
        capabilities as any,
      ),
      prisma,
      agentQueue,
      capabilities,
    };
  };

  it('normalizes toolkit_slugs into execution input and agent queue payload', async () => {
    const { service, prisma, agentQueue, capabilities } = createService();

    await expect(
      service.sendMessage('user-uuid', 'org-uuid', 'conversation-uuid', {
        content: 'Use Gmail only',
        toolkit_slugs: ['gmail', 'gmail', ' slack '],
      }),
    ).resolves.toEqual({
      executionId: 'execution-uuid',
      messageId: 'message-uuid',
    });

    expect(capabilities.resolveAgentToolScope).toHaveBeenCalledWith(
      'org-uuid',
      'user-uuid',
      undefined,
      ['gmail', 'slack'],
    );

    expect(prisma.message.create).toHaveBeenCalledWith({
      data: {
        conversation_uuid: 'conversation-uuid',
        role: MessageRole.USER,
        content: 'Use Gmail only',
      },
    });
    expect(prisma.agentExecution.create).toHaveBeenCalledWith({
      data: {
        message_uuid: 'message-uuid',
        conversation_uuid: 'conversation-uuid',
        org_uuid: 'org-uuid',
        user_uuid: 'user-uuid',
        status: AgentExecutionStatus.PENDING,
        input: {
          content: 'Use Gmail only',
          documentUuids: [],
          integrationUuids: undefined,
          toolkitSlugs: ['gmail', 'slack'],
          toolkitConnectionTiers: {
            gmail: ComposioConnectionTier.ORG_SHARED,
            slack: ComposioConnectionTier.ORG_SHARED,
          },
        },
      },
    });
    expect(agentQueue.add).toHaveBeenCalledWith(
      'run',
      expect.objectContaining({
        organizationUuid: 'org-uuid',
        userUuid: 'user-uuid',
        conversationId: 'conversation-uuid',
        userMessage: 'Use Gmail only',
        executionUuid: 'execution-uuid',
        documentUuids: [],
        integrationUuids: undefined,
        toolkitSlugs: ['gmail', 'slack'],
        toolkitConnectionTiers: {
          gmail: ComposioConnectionTier.ORG_SHARED,
          slack: ComposioConnectionTier.ORG_SHARED,
        },
      }),
      expect.objectContaining({ jobId: 'run-execution-uuid' }),
    );
  });

  it('always queues the agent run with org-shared connection tiers', async () => {
    const { service, prisma, agentQueue, capabilities } = createService();
    capabilities.resolveAgentToolScope.mockResolvedValue({
      integrationUuids: undefined,
      toolkitSlugs: ['linear'],
    });

    await service.sendMessage('user-uuid', 'org-uuid', 'conversation-uuid', {
      content: 'Use Linear',
      toolkitSlugs: ['linear'],
      toolkitConnectionTiers: { linear: ComposioConnectionTier.USER_PERSONAL },
    });

    expect(prisma.agentExecution.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        status: AgentExecutionStatus.PENDING,
        input: expect.objectContaining({
          toolkitConnectionTiers: {
            linear: ComposioConnectionTier.ORG_SHARED,
          },
        }),
      }),
    });
    expect(agentQueue.add).toHaveBeenCalled();
  });
});
