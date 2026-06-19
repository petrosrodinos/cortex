export interface SendGridConfig {
  apiKey: string;
  from: string;
}

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

export interface SendGridActionResult<T = any> {
  success: boolean;
  data: T;
}
