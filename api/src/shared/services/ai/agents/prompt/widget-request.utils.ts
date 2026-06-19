import { getRequestedOutputToolNames } from '../outputs/tools/output-tools.factory';

export function isWidgetRequest(userMessage?: string): boolean {
  const requested = getRequestedOutputToolNames(userMessage);
  return requested?.has('output__create_widget') ?? false;
}

export function isWidgetFollowUpRequest(userMessage?: string): boolean {
  if (!isWidgetRequest(userMessage)) {
    return false;
  }

  const normalized = userMessage?.trim() ?? '';
  return /\b(it|that|this|above|previous|same|the list|the table|the data|the chart|the report|the expenses?|those|these|from (?:the )?(?:list|table|data|report|expenses?)|into a widget|as a widget|make (?:it|that|this|a widget)|turn (?:it|that|this))\b/i.test(
    normalized,
  );
}

export const WIDGET_AGENT_GUIDANCE = [
  'The latest user message asks for an interactive widget.',
  'Before calling output__create_widget, fetch real data with integration, database, document, or code_interpreter tools unless the conversation already contains the full dataset needed.',
  'Implement everything the user described: every slider, toggle, filter, chart, table row, metric, and calculation they mentioned.',
  'Pass the full dataset in the data field (not samples or placeholders). In js, build every table row and control from WIDGET_DATA on init — html may only contain empty shells. Use renderTableRows, widgetRecords, formatWidgetCurrency, and formatWidgetDate helpers.',
  'Build a polished mini-dashboard: title, summary metric cards, labeled controls, and a results section. Use substantial html and css with clear spacing and hierarchy.',
  'Do not use placeholder copy such as "Sample data", lorem ipsum, or generic filler labels.',
  'The chat UI renders the widget automatically — keep the text reply brief and do not paste raw HTML in the message.',
] as const;

export const WIDGET_FOLLOW_UP_GUIDANCE = [
  'This is a follow-up widget request based on earlier conversation content.',
  'Reuse data from prior assistant replies and tool results. Re-run the same lookup tools if the conversation only summarized results.',
  'Do not ask the user to re-enter data that is already visible in the chat history.',
] as const;
