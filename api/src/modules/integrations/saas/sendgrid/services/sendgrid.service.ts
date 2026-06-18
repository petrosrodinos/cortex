import sgMail from '@sendgrid/mail';
import {
  SendBulkEmailInput,
  SendEmailInput,
  SendEmailWithAttachmentsInput,
  SendHtmlEmailInput,
} from '../interfaces/sendgrid.interfaces';
import { configureSendGrid, verifySendGridApiKey, wrapResult } from '../utils/sendgrid.utils';

function splitRecipients(value?: string) {
  if (!value) {
    return undefined;
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export class SendGridService {
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  private configure() {
    configureSendGrid(this.apiKey);
  }

  async sendEmail({ to, cc, bcc, replyTo, subject, body }: SendEmailInput) {
    this.configure();
    const [result] = await sgMail.send({
      to,
      from: this.from,
      cc: splitRecipients(cc),
      bcc: splitRecipients(bcc),
      replyTo,
      subject,
      text: body,
      html: body,
    });

    return wrapResult(result);
  }

  async sendHtmlEmail({ to, cc, bcc, replyTo, subject, text, html }: SendHtmlEmailInput) {
    this.configure();
    const [result] = await sgMail.send({
      to,
      from: this.from,
      cc: splitRecipients(cc),
      bcc: splitRecipients(bcc),
      replyTo,
      subject,
      text,
      html,
    });

    return wrapResult(result);
  }

  async sendEmailWithAttachments({ to, cc, bcc, subject, body, attachments }: SendEmailWithAttachmentsInput) {
    this.configure();
    const [result] = await sgMail.send({
      to,
      from: this.from,
      cc: splitRecipients(cc),
      bcc: splitRecipients(bcc),
      subject,
      text: body,
      html: body,
      attachments: attachments.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        type: 'application/octet-stream',
        disposition: 'attachment',
      })),
    });

    return wrapResult(result);
  }

  async sendBulkEmail({ recipients, subject, body }: SendBulkEmailInput) {
    this.configure();
    const results = await Promise.all(
      recipients.map((to) =>
        sgMail.send({
          to,
          from: this.from,
          subject,
          text: body,
          html: body,
        }),
      ),
    );

    return wrapResult(results.map(([result]) => result));
  }

  async verifyConnection() {
    const verified = await verifySendGridApiKey(this.apiKey);
    return wrapResult({ verified });
  }
}
