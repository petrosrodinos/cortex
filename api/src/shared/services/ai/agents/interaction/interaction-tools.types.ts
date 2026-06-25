export const INTERACTION_PRESENT_CHOICES_TOOL = 'interaction__present_choices';

export type UserChoiceSelectionMode = 'single' | 'multiple';

export type UserChoiceOption = {
  id: string;
  label: string;
  description?: string;
};

export type UserChoiceRequest = {
  prompt: string;
  description?: string;
  selection_mode: UserChoiceSelectionMode;
  options: UserChoiceOption[];
};

export type UserChoiceResponse = {
  selected_ids: string[];
};

export function parseUserChoiceRequest(input: unknown): UserChoiceRequest | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return null;
  }

  const record = input as Record<string, unknown>;
  const prompt = typeof record.prompt === 'string' ? record.prompt.trim() : '';
  const selectionMode = record.selection_mode;
  const options = record.options;

  if (
    !prompt ||
    (selectionMode !== 'single' && selectionMode !== 'multiple') ||
    !Array.isArray(options) ||
    options.length < 2
  ) {
    return null;
  }

  const parsedOptions: UserChoiceOption[] = [];

  for (const option of options) {
    if (!option || typeof option !== 'object' || Array.isArray(option)) {
      return null;
    }

    const entry = option as Record<string, unknown>;
    const id = typeof entry.id === 'string' ? entry.id.trim() : '';
    const label = typeof entry.label === 'string' ? entry.label.trim() : '';

    if (!id || !label) {
      return null;
    }

    parsedOptions.push({
      id,
      label,
      ...(typeof entry.description === 'string' && entry.description.trim()
        ? { description: entry.description.trim() }
        : {}),
    });
  }

  const uniqueIds = new Set(parsedOptions.map((option) => option.id));
  if (uniqueIds.size !== parsedOptions.length) {
    return null;
  }

  return {
    prompt,
    ...(typeof record.description === 'string' && record.description.trim()
      ? { description: record.description.trim() }
      : {}),
    selection_mode: selectionMode,
    options: parsedOptions,
  };
}

export function validateUserChoiceSelection(
  choiceRequest: UserChoiceRequest,
  selectedIds: string[],
): void {
  if (selectedIds.length === 0) {
    throw new Error('At least one option must be selected');
  }

  const uniqueSelected = new Set(selectedIds);
  if (uniqueSelected.size !== selectedIds.length) {
    throw new Error('Duplicate selections are not allowed');
  }

  const allowedIds = new Set(choiceRequest.options.map((option) => option.id));

  for (const selectedId of selectedIds) {
    if (!allowedIds.has(selectedId)) {
      throw new Error(`Invalid option id: ${selectedId}`);
    }
  }

  if (choiceRequest.selection_mode === 'single' && selectedIds.length !== 1) {
    throw new Error('Exactly one option must be selected');
  }
}

export function buildUserChoiceToolResult(
  choiceRequest: UserChoiceRequest,
  selectedIds: string[],
) {
  const selectedOptions = choiceRequest.options.filter((option) =>
    selectedIds.includes(option.id),
  );

  return {
    selection_mode: choiceRequest.selection_mode,
    selected_ids: selectedIds,
    selected_options: selectedOptions,
  };
}

export type ChoiceCheckpointInput = {
  choiceRequest?: UserChoiceRequest;
  choiceApprovalRequests?: Array<{ approvalId: string }>;
  userChoiceResponse?: UserChoiceResponse;
  agentMessages?: unknown;
  responseMessages?: unknown;
};

export function isAwaitingUserChoiceStatus(status: string): boolean {
  return status === 'AWAITING_USER_CHOICE';
}

export function hasChoiceCheckpoint(
  input: ChoiceCheckpointInput | null | undefined,
): boolean {
  return !!(
    input?.choiceRequest?.options?.length &&
    input?.choiceApprovalRequests?.length &&
    input.agentMessages &&
    input.responseMessages
  );
}

export function canResolveUserChoice(
  status: string,
  input: ChoiceCheckpointInput | null | undefined,
): boolean {
  if (!hasChoiceCheckpoint(input) || input?.userChoiceResponse?.selected_ids?.length) {
    return false;
  }

  if (isAwaitingUserChoiceStatus(status)) {
    return true;
  }

  return status === 'RUNNING';
}
