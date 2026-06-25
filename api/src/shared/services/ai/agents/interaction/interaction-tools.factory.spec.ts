import { BadRequestException } from '@nestjs/common';
import { InteractionToolsFactory } from './interaction-tools.factory';

describe('InteractionToolsFactory', () => {
  const choiceInput = {
    prompt: 'Pick a project',
    selection_mode: 'single',
    options: [
      { id: 'proj-1', label: 'Project One' },
      { id: 'proj-2', label: 'Project Two' },
    ],
  };

  it('returns saved user selection on execute', async () => {
    const prisma = {
      agentExecution: {
        findUnique: jest.fn().mockResolvedValue({
          input: { userChoiceResponse: { selected_ids: ['proj-1'] } },
        }),
      },
      toolCall: { create: jest.fn().mockResolvedValue({}) },
    };
    const factory = new InteractionToolsFactory(prisma as any);
    const tools = factory.buildTools({ executionUuid: 'execution-uuid' });

    await expect(
      (tools.interaction__present_choices as any).execute(choiceInput),
    ).resolves.toEqual({
      selection_mode: 'single',
      selected_ids: ['proj-1'],
      selected_options: [{ id: 'proj-1', label: 'Project One' }],
    });

    expect(prisma.toolCall.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tool_name: 'interaction__present_choices',
          status: 'SUCCESS',
        }),
      }),
    );
  });

  it('throws when user choice response is missing', async () => {
    const prisma = {
      agentExecution: {
        findUnique: jest.fn().mockResolvedValue({ input: {} }),
      },
      toolCall: { create: jest.fn().mockResolvedValue({}) },
    };
    const factory = new InteractionToolsFactory(prisma as any);
    const tools = factory.buildTools({ executionUuid: 'execution-uuid' });

    await expect(
      (tools.interaction__present_choices as any).execute(choiceInput),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
