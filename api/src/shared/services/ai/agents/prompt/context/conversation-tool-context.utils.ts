import {
  extractToolResultPayload,
  getToolResultName,
} from '../detection/email-send.utils';

export const TOOL_CONTEXT_SECTION_HEADER = 'Tool results from this turn:';

const MAX_PAYLOAD_PER_TOOL = 6_000;
const MAX_TOTAL_CONTEXT = 20_000;

const SKIP_TOOL_NAMES = new Set([
  'agent-step:llm-step',
  'COMPOSIO_SEARCH_TOOLS',
  'COMPOSIO_GET_TOOL_SCHEMAS',
  'COMPOSIO_REMOTE_WORKBENCH',
  'COMPOSIO_REMOTE_BASH_TOOL',
]);

export function shouldSkipToolForContext(toolName?: string): boolean {
  if (!toolName) {
    return true;
  }

  return SKIP_TOOL_NAMES.has(toolName);
}

function stringifyPayload(payload: unknown, maxChars: number): string {
  if (payload === null || payload === undefined) {
    return '';
  }

  try {
    const text = JSON.stringify(payload, null, 2);
    if (text.length <= maxChars) {
      return text;
    }

    return `${text.slice(0, maxChars)}\n...[truncated]`;
  } catch {
    return String(payload).slice(0, maxChars);
  }
}

function appendToolSection(
  sections: string[],
  totalChars: { value: number },
  toolName: string,
  payload: unknown,
) {
  if (shouldSkipToolForContext(toolName)) {
    return;
  }

  const body = stringifyPayload(payload, MAX_PAYLOAD_PER_TOOL);
  if (!body.trim()) {
    return;
  }

  const section = `[${toolName}]\n${body}`;
  if (totalChars.value + section.length > MAX_TOTAL_CONTEXT) {
    return;
  }

  sections.push(section);
  totalChars.value += section.length;
}

export function buildToolContextFromStepResults(
  toolResults: unknown[],
): string | null {
  const sections: string[] = [];
  const totalChars = { value: 0 };

  for (const result of toolResults) {
    const toolName = getToolResultName(result);
    const payload = extractToolResultPayload(result);
    if (!payload || 'error' in payload) {
      continue;
    }

    appendToolSection(sections, totalChars, toolName ?? 'unknown_tool', payload);
  }

  return sections.length > 0 ? sections.join('\n\n') : null;
}

export function buildToolContextFromDbRecords(
  records: Array<{ tool_name: string; output: unknown; status: string }>,
): string | null {
  const sections: string[] = [];
  const totalChars = { value: 0 };

  for (const record of records) {
    if (record.status !== 'SUCCESS') {
      continue;
    }

    const payload =
      record.output && typeof record.output === 'object'
        ? (record.output as Record<string, unknown>)
        : record.output;

    if (payload && typeof payload === 'object' && 'error' in payload) {
      continue;
    }

    appendToolSection(sections, totalChars, record.tool_name, payload);
  }

  return sections.length > 0 ? sections.join('\n\n') : null;
}

export function messagesIncludeRecentToolContext(
  messages: Array<{ role: string; content: unknown }>,
): boolean {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== 'assistant') {
      continue;
    }

    if (typeof message.content !== 'string') {
      continue;
    }

    if (message.content.includes(TOOL_CONTEXT_SECTION_HEADER)) {
      return true;
    }

    return false;
  }

  return false;
}
