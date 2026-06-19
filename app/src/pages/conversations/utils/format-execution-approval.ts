import type { ExecutionApprovalRequest } from '@/features/conversations/interfaces/conversation.interfaces';

export interface ApprovalSummary {
  title: string;
  description: string;
  details: Array<{ label: string; value: string }>;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>;
  }

  return null;
}

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function readRecipient(input: Record<string, unknown>) {
  const recipientType = readString(input.recipient_type);

  if (recipientType === 'self') {
    return 'You';
  }

  if (recipientType === 'member') {
    return 'A team member in your organization';
  }

  if (recipientType === 'address') {
    const toEmail = readString(input.to_email);
    return toEmail || 'External email address';
  }

  const to = readString(input.to);
  if (to) {
    return to;
  }

  const recipients = input.recipients;
  if (Array.isArray(recipients) && recipients.every((item) => typeof item === 'string')) {
    return recipients.join(', ');
  }

  return 'Recipient not specified';
}

function readAttachmentCount(input: Record<string, unknown>) {
  const documentAttachments = input.attachment_document_uuids;
  if (Array.isArray(documentAttachments)) {
    return documentAttachments.length;
  }

  const attachments = input.attachments;
  if (Array.isArray(attachments)) {
    return attachments.length;
  }

  return 0;
}

function buildEmailApprovalSummary(input: Record<string, unknown>): ApprovalSummary {
  const subject = readString(input.subject) || 'No subject';
  const body = readString(input.body) || readString(input.text) || readString(input.html) || 'No message content';
  const attachmentCount = readAttachmentCount(input);

  const details: ApprovalSummary['details'] = [
    { label: 'To', value: readRecipient(input) },
    { label: 'Subject', value: subject },
    { label: 'Message', value: body },
  ];

  const cc = readString(input.cc);
  if (cc) {
    details.splice(1, 0, { label: 'Cc', value: cc });
  }

  const bcc = readString(input.bcc);
  if (bcc) {
    details.splice(cc ? 2 : 1, 0, { label: 'Bcc', value: bcc });
  }

  if (attachmentCount > 0) {
    details.push({
      label: 'Attachments',
      value: attachmentCount === 1 ? '1 file' : `${attachmentCount} files`,
    });
  }

  return {
    title: 'Send this email?',
    description: 'Review the email below before it is sent.',
    details,
  };
}

function isEmailApprovalTool(toolName: string) {
  return (
    toolName.endsWith('__send_email') ||
    toolName.endsWith('__send_message') ||
    toolName.endsWith('__send_html_email') ||
    toolName.endsWith('__send_email_with_attachments') ||
    toolName.endsWith('__send_bulk_email')
  );
}

export function formatExecutionApproval(request: ExecutionApprovalRequest): ApprovalSummary {
  const toolName = request.toolName ?? '';
  const input = asRecord(request.input);

  if (input && isEmailApprovalTool(toolName)) {
    return buildEmailApprovalSummary(input);
  }

  return {
    title: 'Allow this action?',
    description: 'Cortex needs your approval before continuing.',
    details: [],
  };
}
