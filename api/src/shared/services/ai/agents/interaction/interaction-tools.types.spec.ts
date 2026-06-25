import {
  buildUserChoiceToolResult,
  canResolveUserChoice,
  parseUserChoiceRequest,
  validateUserChoiceSelection,
} from './interaction-tools.types';

const baseChoiceRequest = {
  prompt: 'Pick a project',
  selection_mode: 'single' as const,
  options: [
    { id: 'a', label: 'Alpha' },
    { id: 'b', label: 'Beta' },
  ],
};

describe('parseUserChoiceRequest', () => {
  it('parses a valid single-select request', () => {
    expect(parseUserChoiceRequest(baseChoiceRequest)).toEqual(baseChoiceRequest);
  });

  it('rejects fewer than two options', () => {
    expect(
      parseUserChoiceRequest({
        ...baseChoiceRequest,
        options: [{ id: 'a', label: 'Alpha' }],
      }),
    ).toBeNull();
  });

  it('rejects duplicate option ids', () => {
    expect(
      parseUserChoiceRequest({
        ...baseChoiceRequest,
        options: [
          { id: 'a', label: 'Alpha' },
          { id: 'a', label: 'Alpha duplicate' },
        ],
      }),
    ).toBeNull();
  });
});

describe('validateUserChoiceSelection', () => {
  it('accepts exactly one id in single mode', () => {
    expect(() =>
      validateUserChoiceSelection(baseChoiceRequest, ['a']),
    ).not.toThrow();
  });

  it('rejects zero selections', () => {
    expect(() => validateUserChoiceSelection(baseChoiceRequest, [])).toThrow(
      'At least one option must be selected',
    );
  });

  it('rejects multiple selections in single mode', () => {
    expect(() =>
      validateUserChoiceSelection(baseChoiceRequest, ['a', 'b']),
    ).toThrow('Exactly one option must be selected');
  });

  it('accepts multiple selections in multiple mode', () => {
    expect(() =>
      validateUserChoiceSelection(
        { ...baseChoiceRequest, selection_mode: 'multiple' },
        ['a', 'b'],
      ),
    ).not.toThrow();
  });

  it('rejects invalid option ids', () => {
    expect(() =>
      validateUserChoiceSelection(baseChoiceRequest, ['missing']),
    ).toThrow('Invalid option id: missing');
  });

  it('rejects duplicate selected ids', () => {
    expect(() =>
      validateUserChoiceSelection(baseChoiceRequest, ['a', 'a']),
    ).toThrow('Duplicate selections are not allowed');
  });
});

describe('canResolveUserChoice', () => {
  const choiceRequest = {
    prompt: 'Pick one',
    selection_mode: 'single' as const,
    options: [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
    ],
  };

  const checkpoint = {
    choiceRequest,
    choiceApprovalRequests: [{ approvalId: 'approval-1' }],
    agentMessages: [{ role: 'user' }],
    responseMessages: [{ role: 'assistant' }],
  };

  it('accepts awaiting user choice status with checkpoint', () => {
    expect(canResolveUserChoice('AWAITING_USER_CHOICE', checkpoint)).toBe(true);
  });

  it('accepts running status when choice checkpoint exists', () => {
    expect(canResolveUserChoice('RUNNING', checkpoint)).toBe(true);
  });

  it('rejects running status without checkpoint', () => {
    expect(canResolveUserChoice('RUNNING', { choiceRequest })).toBe(false);
  });
});

describe('buildUserChoiceToolResult', () => {
  it('returns selected options matching ids', () => {
    expect(
      buildUserChoiceToolResult(
        { ...baseChoiceRequest, selection_mode: 'multiple' },
        ['b'],
      ),
    ).toEqual({
      selection_mode: 'multiple',
      selected_ids: ['b'],
      selected_options: [{ id: 'b', label: 'Beta' }],
    });
  });
});
