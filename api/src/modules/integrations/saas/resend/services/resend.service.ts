import {
  SendBulkEmailInput,
  SendEmailInput,
  SendEmailWithAttachmentsInput,
  SendHtmlEmailInput,
} from '../interfaces/resend.interfaces';
import { createResendClient, verifyResendApiKey, wrapResult } from '../utils/resend.utils';

function splitRecipients(value?: string) {
  if (!value) {
    return undefined;
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export class ResendService {
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  async sendEmail({ to, cc, bcc, replyTo, subject, body }: SendEmailInput) {
    const client = createResendClient(this.apiKey);
    const result = await client.emails.send({
      from: this.from,
      to,
      cc: splitRecipients(cc),
      bcc: splitRecipients(bcc),
      replyTo,
      subject,
      text: body,
      html: body,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return wrapResult(result.data);
  }

  async sendHtmlEmail({ to, cc, bcc, replyTo, subject, text, html }: SendHtmlEmailInput) {
    const client = createResendClient(this.apiKey);
    const result = await client.emails.send({
      from: this.from,
      to,
      cc: splitRecipients(cc),
      bcc: splitRecipients(bcc),
      replyTo,
      subject,
      text,
      html,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return wrapResult(result.data);
  }

  async sendEmailWithAttachments({ to, cc, bcc, subject, body, attachments }: SendEmailWithAttachmentsInput) {
    const client = createResendClient(this.apiKey);
    const result = await client.emails.send({
      from: this.from,
      to,
      cc: splitRecipients(cc),
      bcc: splitRecipients(bcc),
      subject,
      text: body,
      html: body,
      attachments: attachments.map((attachment) => ({
        filename: attachment.filename,
        content: Buffer.from(attachment.content, (attachment.encoding ?? 'base64') as BufferEncoding),
      })),
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return wrapResult(result.data);
  }

  async sendBulkEmail({ recipients, subject, body }: SendBulkEmailInput) {
    const client = createResendClient(this.apiKey);
    const results = await Promise.all(
      recipients.map((to) =>
        client.emails.send({
          from: this.from,
          to,
          subject,
          text: body,
          html: body,
        }),
      ),
    );

    const failed = results.find((result) => result.error);
    if (failed?.error) {
      throw new Error(failed.error.message);
    }

    return wrapResult(results.map((result) => result.data));
  }

  async verifyConnection() {
    const verified = await verifyResendApiKey(this.apiKey);
    return wrapResult({ verified });
  }
}
