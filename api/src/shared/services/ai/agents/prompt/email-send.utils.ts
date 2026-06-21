import { isEmailSendToolName } from '../tools/email-tool.utils';

const EMAIL_SEND_REQUEST_PATTERN =
  /\b(send|email|mail)\b.*\b(to|my email|their email|inbox|address)\b|\bsend it to\b|\bemail it to\b|\bmail it to\b/i;

export function isEmailSendRequest(userMessage?: string): boolean {
  if (!userMessage?.trim()) {
    return false;
  }

  return EMAIL_SEND_REQUEST_PATTERN.test(userMessage);
}

export function extractToolResultPayload(result: unknown): Record<string, unknown> | null {
  if (!result || typeof result !== 'object') {
    return null;
  }

  const record = result as Record<string, unknown>;
  const output = record.output ?? record.result;

  if (output && typeof output === 'object') {
    return output as Record<string, unknown>;
  }

  return record;
}

export function getToolResultName(result: unknown): string | undefined {
  if (!result || typeof result !== 'object') {
    return undefined;
  }

  const record = result as Record<string, unknown>;
  if (typeof record.toolName === 'string') {
    return record.toolName;
  }

  if (typeof record.toolCallName === 'string') {
    return record.toolCallName;
  }

  return undefined;
}

export function isEmailSendIntegrationToolName(toolName?: string): boolean {
  if (!toolName) {
    return false;
  }

  return isEmailSendToolName(toolName);
}

export function hasSuccessfulEmailSend(toolResults: unknown[]): boolean {
  return toolResults.some((result) => {
    if (!isEmailSendIntegrationToolName(getToolResultName(result))) {
      return false;
    }

    const payload = extractToolResultPayload(result);
    if (!payload || 'error' in payload) {
      return false;
    }

    return true;
  });
}

export function hasSuccessfulOrganizationEmailSend(toolResults: unknown[]): boolean {
  return hasSuccessfulEmailSend(toolResults);
}

export function extractGeneratedDocuments(toolResults: unknown[]) {
  const documents: Array<{ document_uuid: string; filename?: string; file_url?: string }> = [];

  for (const result of toolResults) {
    const toolName = getToolResultName(result);
    if (
      toolName !== 'output__create_excel' &&
      toolName !== 'output__create_pdf' &&
      toolName !== 'output__create_word' &&
      toolName !== 'output__create_image' &&
      toolName !== 'output__create_widget'
    ) {
      continue;
    }

    const payload = extractToolResultPayload(result);
    if (!payload || typeof payload.document_uuid !== 'string') {
      continue;
    }

    documents.push({
      document_uuid: payload.document_uuid,
      filename: typeof payload.filename === 'string' ? payload.filename : undefined,
      file_url: typeof payload.file_url === 'string' ? payload.file_url : undefined,
    });
  }

  return documents;
}
