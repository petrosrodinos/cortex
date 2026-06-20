import { AgentExecutionStatus, MessageRole } from 'generated/prisma';
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

    return {
      service: new MessagesService(
        prisma as any,
        organizations as any,
        memory as any,
        providerFactory as any,
        gcs as any,
        agentQueue as any,
      ),
      prisma,
      agentQueue,
    };
  };

  it('normalizes toolkit_slugs into execution input and agent queue payload', async () => {
    const { service, prisma, agentQueue } = createService();

    await expect(
      service.sendMessage('user-uuid', 'org-uuid', 'conversation-uuid', {
        content: 'Use Gmail only',
        toolkit_slugs: ['gmail', 'gmail', ' slack '],
      }),
    ).resolves.toEqual({
      executionId: 'execution-uuid',
      messageId: 'message-uuid',
    });

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
          integrationUuids: [],
          toolkitSlugs: ['gmail', 'slack'],
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
        integrationUuids: [],
        toolkitSlugs: ['gmail', 'slack'],
      }),
      expect.objectContaining({ jobId: 'run-execution-uuid' }),
    );
  });
});
