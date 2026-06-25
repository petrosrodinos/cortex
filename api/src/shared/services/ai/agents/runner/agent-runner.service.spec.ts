import { INTERACTION_PRESENT_CHOICES_TOOL } from '../interaction/interaction-tools.types';
import { AgentRunnerService } from './agent-runner.service';

describe('AgentRunnerService approval routing', () => {
  const service = new AgentRunnerService(
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
  );

  it('extracts tool approval requests from agent steps', () => {
    const requests = (service as any).extractApprovalRequests({
      steps: [
        {
          content: [
            {
              type: 'tool-approval-request',
              approvalId: 'approval-1',
              toolCall: {
                toolName: INTERACTION_PRESENT_CHOICES_TOOL,
                input: { prompt: 'Pick one', selection_mode: 'single', options: [] },
              },
            },
          ],
        },
      ],
      response: { messages: [] },
    });

    expect(requests).toEqual([
      expect.objectContaining({
        approvalId: 'approval-1',
        toolName: INTERACTION_PRESENT_CHOICES_TOOL,
      }),
    ]);
  });

  it('partitions choice requests away from standard approvals', () => {
    const requests = [
      {
        approvalId: 'choice-1',
        toolName: INTERACTION_PRESENT_CHOICES_TOOL,
        input: {},
      },
      {
        approvalId: 'approval-1',
        toolName: 'GITHUB_LIST_REPOSITORIES_FOR_THE_AUTHENTICATED_USER',
        input: {},
      },
    ];

    const partitioned = (service as any).partitionApprovalRequests(requests);

    expect(partitioned.choiceRequests).toHaveLength(1);
    expect(partitioned.choiceRequests[0].approvalId).toBe('choice-1');
    expect(partitioned.standardApprovalRequests).toHaveLength(1);
    expect(partitioned.standardApprovalRequests[0].approvalId).toBe('approval-1');
  });
});
