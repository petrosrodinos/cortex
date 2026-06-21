const EMAIL_SENDER_CONFIG_ERROR_PATTERN =
  /domain|sender|from address|verified|unverified|not verified|example\.com|authentication|authorized/i;

export const EMAIL_SEND_TOOL_DESCRIPTION_SUFFIX =
  'If a from or sender address is required, search this email toolkit for domain, sender, or account configuration tools first and use a valid configured sender. Never use placeholder sender addresses. If send fails due to sender or domain configuration, search the toolkit again and retry before asking the user to change external settings.';

export function isEmailSendToolName(toolName: string): boolean {
  const normalized = toolName.toLowerCase();

  if (normalized.includes('with_attachments')) {
    return false;
  }

  return (
    normalized.endsWith('send_email') ||
    normalized.endsWith('send_message') ||
    normalized.endsWith('send_batch_emails') ||
    normalized.endsWith('send_html_email') ||
    normalized.endsWith('send_bulk_email')
  );
}

export function appendEmailSendToolDescription(description?: string): string {
  const base = description?.trim() ?? 'Send email';

  if (base.includes('search this email toolkit')) {
    return base;
  }

  return `${base} ${EMAIL_SEND_TOOL_DESCRIPTION_SUFFIX}`;
}

export function enrichEmailSenderConfigError(toolName: string, message: string): string {
  if (!isEmailSendToolName(toolName) || !EMAIL_SENDER_CONFIG_ERROR_PATTERN.test(message)) {
    return message;
  }

  return `${message} Search the connected email toolkit for domain, sender, or account configuration tools, then retry with a valid sender.`;
}
