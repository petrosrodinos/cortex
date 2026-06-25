import { BadRequestException } from '@nestjs/common';
import { AgentExecutionStatus } from 'generated/prisma';
import { ExecutionsService } from './executions.service';

describe('ExecutionsService user choice', () => {
  const prisma: any = {
    agentExecution: {
      findFirst: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    },
  };
  const organizations: any = {
    requireActiveMember: jest.fn().mockResolvedValue(undefined),
  };
  const agentQueue: any = {
    add: jest.fn().mockResolvedValue({}),
  };
  const capabilities: any = {};

  const choiceRequest = {
    prompt: 'Pick a project',
    selection_mode: 'single' as const,
    options: [
      { id: 'proj-1', label: 'Project One' },
      { id: 'proj-2', label: 'Project Two' },
    ],
  };

  const awaitingExecution = {
    uuid: 'execution-uuid',
    conversation_uuid: 'conversation-uuid',
    status: AgentExecutionStatus.AWAITING_USER_CHOICE,
    input: {
      content: 'List my issues',
      choiceRequest,
      choiceApprovalRequests: [{ approvalId: 'approval-1' }],
      agentMessages: [{ role: 'user', content: 'List my issues' }],
      responseMessages: [{ role: 'assistant', content: [] }],
    },
  };

  const runningWithChoiceCheckpoint = {
    ...awaitingExecution,
    status: AgentExecutionStatus.RUNNING,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.agentExecution.findFirst.mockResolvedValue(awaitingExecution);
  });

  const service = () =>
    new ExecutionsService(prisma, organizations, agentQueue, capabilities);

  it('resolves user choice and queues resume with approval', async () => {
    const result = await service().resolveUserChoice(
      'user-uuid',
      'org-uuid',
      'execution-uuid',
      { selected_ids: ['proj-1'] },
    );

    expect(result).toEqual({ resolved: true, executionId: 'execution-uuid' });
    expect(prisma.agentExecution.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: AgentExecutionStatus.PENDING,
          input: expect.objectContaining({
            userChoiceResponse: { selected_ids: ['proj-1'] },
          }),
        }),
      }),
    );
    expect(agentQueue.add).toHaveBeenCalledWith(
      'resume',
      expect.objectContaining({
        resumeApprovals: [{ approvalId: 'approval-1', approved: true }],
      }),
      expect.any(Object),
    );
  });

  it('rejects invalid selection in single mode', async () => {
    await expect(
      service().resolveUserChoice('user-uuid', 'org-uuid', 'execution-uuid', {
        selected_ids: ['proj-1', 'proj-2'],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(agentQueue.add).not.toHaveBeenCalled();
  });

  it('rejects resolve when execution is not awaiting choice', async () => {
    prisma.agentExecution.findFirst.mockResolvedValue({
      ...awaitingExecution,
      status: AgentExecutionStatus.RUNNING,
      input: { content: 'List my issues' },
    });

    await expect(
      service().resolveUserChoice('user-uuid', 'org-uuid', 'execution-uuid', {
        selected_ids: ['proj-1'],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('resolves user choice when checkpoint exists but status is still running', async () => {
    prisma.agentExecution.findFirst.mockResolvedValue(runningWithChoiceCheckpoint);

    const result = await service().resolveUserChoice(
      'user-uuid',
      'org-uuid',
      'execution-uuid',
      { selected_ids: ['proj-1'] },
    );

    expect(result).toEqual({ resolved: true, executionId: 'execution-uuid' });
    expect(agentQueue.add).toHaveBeenCalled();
  });

  it('returns resolved when choice was already submitted', async () => {
    prisma.agentExecution.findFirst.mockResolvedValue({
      ...awaitingExecution,
      status: AgentExecutionStatus.PENDING,
      input: {
        ...awaitingExecution.input,
        userChoiceResponse: { selected_ids: ['proj-1'] },
      },
    });

    await expect(
      service().resolveUserChoice('user-uuid', 'org-uuid', 'execution-uuid', {
        selected_ids: ['proj-1'],
      }),
    ).resolves.toEqual({ resolved: true, executionId: 'execution-uuid' });
    expect(agentQueue.add).not.toHaveBeenCalled();
  });

  it('cancels user choice and queues resume with denial', async () => {
    const result = await service().cancelUserChoice(
      'user-uuid',
      'org-uuid',
      'execution-uuid',
    );

    expect(result).toEqual({ cancelled: true, executionId: 'execution-uuid' });
    expect(agentQueue.add).toHaveBeenCalledWith(
      'resume',
      expect.objectContaining({
        resumeApprovals: [
          {
            approvalId: 'approval-1',
            approved: false,
            reason: 'User cancelled selection',
          },
        ],
      }),
      expect.any(Object),
    );
  });
});
