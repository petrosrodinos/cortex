export const AGENT_PROGRESS_EVENTS = {
  TOOL_START: 'tool:start',
  TOOL_COMPLETE: 'tool:complete',
  COMPLETE: 'agent:complete',
  ERROR: 'agent:error',
  APPROVAL_REQUIRED: 'agent:approval_required',
} as const;
