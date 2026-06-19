// ── Config ────────────────────────────────────────────────────────────────────

export interface SmtpConfig {
  host: string;
  port: number;
  from: string;
  user?: string;
  password?: string;
  secure?: boolean;
}

// ── Emails ────────────────────────────────────────────────────────────────────

export interface SendEmailInput {
  to: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  subject: string;
  body: string;
  html?: string;
}

export interface SendHtmlEmailInput {
  to: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

export interface Attachment {
  filename: string;
  content: string;
  encoding?: string;
  contentType?: string;
}

export interface SendEmailWithAttachmentsInput {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  html?: string;
  attachments: Attachment[];
}

export interface SendBulkEmailInput {
  recipients: string[];
  subject: string;
  body: string;
}

// ── Result ────────────────────────────────────────────────────────────────────

export interface SmtpActionResult<T = any> {
  success: boolean;
  data: T;
}
