import { ComposioConnectionTier } from 'generated/prisma';
import {
  inferConnectionTierFromAccount,
} from '../capabilities/toolkit-connection-tiers.utils';

const EMAIL_SENDER_CONFIG_ERROR_PATTERN =
  /domain|sender|from address|verified|unverified|not verified|example\.com|authentication|authorized/i;

const TRANSACTIONAL_EMAIL_TOOLKIT_SLUG_PATTERN =
  /^(resend|sendgrid|mailgun|postmark|smtp|ses|brevo|sendinblue)$/i;

const EMAIL_SEND_FROM_FIELDS = [
  'from',
  'from_email',
  'sender',
  'sender_email',
  'fromAddress',
] as const;

export const EMAIL_SEND_TOOL_DESCRIPTION_SUFFIX =
  'If a from or sender address is required, use default_sender_email from capabilities__list_toolkits for this app when available. If default_sender_email is missing, ask the user for their verified sender address before calling this tool. Never use the authenticated user personal email as the sender for Resend, SendGrid, or similar transactional providers.';

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

  return `${message} Call capabilities__list_toolkits. If default_sender_email is missing, ask the user for their verified sender address before retrying. Never use the authenticated user's personal email as the sender for Resend or SendGrid.`;
}

export function isTransactionalEmailToolkitSlug(slug: string): boolean {
  return TRANSACTIONAL_EMAIL_TOOLKIT_SLUG_PATTERN.test(slug.trim());
}

export function extractEmailToolkitSlugFromToolName(toolName: string): string | null {
  const normalized = toolName.trim().toLowerCase();
  const match = normalized.match(/^([a-z0-9]+)_send_/);
  return match?.[1] ?? null;
}

export function resolveComposioAccountLabel(account: unknown): string | undefined {
  if (!account || typeof account !== 'object') {
    return undefined;
  }

  const record = account as Record<string, unknown>;
  const candidates = [
    record.name,
    record.label,
    record.email,
    (record.data as Record<string, unknown> | undefined)?.email,
    (record.data as Record<string, unknown> | undefined)?.from_email,
    (record.connectionParams as Record<string, unknown> | undefined)?.from,
    (record.connectionParams as Record<string, unknown> | undefined)?.from_email,
    (record.connectionParams as Record<string, unknown> | undefined)?.email,
    (record.member as Record<string, unknown> | undefined)?.email,
    record.status,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  return findEmailInAccountObject(record) ?? undefined;
}

function findEmailInAccountObject(
  value: unknown,
  depth = 0,
): string | undefined {
  if (depth > 6 || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    return inferEmailSenderFromAccountLabel(value) ?? undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findEmailInAccountObject(item, depth + 1);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  if (typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (key === 'status') {
        continue;
      }

      const found = findEmailInAccountObject(nested, depth + 1);
      if (found) {
        return found;
      }
    }
  }

  return undefined;
}

export type ConnectedTransactionalSenderAccount = {
  user_uuid: string | null;
  account_label: string | null;
  composio_account_id: string;
};

export async function resolveConnectedTransactionalSenderEmail(
  accounts: ConnectedTransactionalSenderAccount[],
  preferredTier: ComposioConnectionTier,
  fetchRemoteAccount?: (
    composioAccountId: string,
  ) => Promise<unknown>,
): Promise<string | null> {
  for (const account of accounts) {
    if (inferConnectionTierFromAccount(account) !== preferredTier) {
      continue;
    }

    const labelSender = inferEmailSenderFromAccountLabel(account.account_label);
    if (labelSender) {
      return labelSender;
    }

    if (!fetchRemoteAccount) {
      continue;
    }

    try {
      const remoteAccount = await fetchRemoteAccount(account.composio_account_id);
      const remoteLabel = resolveComposioAccountLabel(remoteAccount);
      const remoteSender = inferEmailSenderFromAccountLabel(remoteLabel);
      if (remoteSender) {
        return remoteSender;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export function extractSenderEmailFromToolInput(
  input: Record<string, unknown>,
): string | null {
  for (const field of EMAIL_SEND_FROM_FIELDS) {
    const value = input[field];
    if (typeof value !== 'string') {
      continue;
    }

    const sender = inferEmailSenderFromAccountLabel(value);
    if (sender) {
      return sender;
    }
  }

  return null;
}

export function buildMissingTransactionalSenderError(toolkitSlug: string): string {
  return `No verified sender email is configured for ${toolkitSlug}. Ask the user which verified sender address to use (for example info@yourdomain.com), wait for their reply, then retry the send with that address in the from field. Do not use the authenticated user's personal email as the sender.`;
}

export function inferEmailSenderFromAccountLabel(
  label: string | null | undefined,
): string | null {
  if (!label) {
    return null;
  }

  const trimmed = label.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  const match = trimmed.match(
    /(?:^|[\s(<\["'])([^\s@(<\["']+@[^\s@>]+\.[^\s@>)]+)(?:[\s)>\]"']|$)/,
  );
  return match?.[1]?.toLowerCase() ?? null;
}

export function stripPersonalEmailFromSenderFields(
  input: Record<string, unknown>,
  personalEmail?: string | null,
): Record<string, unknown> {
  const normalizedPersonalEmail = personalEmail?.trim().toLowerCase();
  const result = { ...input };

  for (const field of EMAIL_SEND_FROM_FIELDS) {
    const value = result[field];
    if (typeof value !== 'string') {
      continue;
    }

    const normalizedValue = value.trim().toLowerCase();
    if (
      normalizedPersonalEmail &&
      normalizedValue === normalizedPersonalEmail
    ) {
      delete result[field];
      continue;
    }

    if (
      normalizedValue.endsWith('@gmail.com') ||
      normalizedValue.endsWith('@googlemail.com') ||
      normalizedValue.endsWith('@yahoo.com') ||
      normalizedValue.endsWith('@hotmail.com') ||
      normalizedValue.endsWith('@outlook.com') ||
      normalizedValue.endsWith('@icloud.com')
    ) {
      delete result[field];
    }
  }

  return result;
}

export function applyDefaultEmailSender(
  input: Record<string, unknown>,
  senderEmail: string,
  options?: { force?: boolean },
): Record<string, unknown> {
  const result = { ...input };

  for (const field of EMAIL_SEND_FROM_FIELDS) {
    const current = result[field];
    if (
      options?.force ||
      current === undefined ||
      current === null ||
      current === ''
    ) {
      result[field] = senderEmail;
    }
  }

  return result;
}
