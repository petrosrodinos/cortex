import {
  SendBulkEmailInput,
  SendEmailInput,
  SendEmailWithAttachmentsInput,
  SendHtmlEmailInput,
} from '../interfaces/smtp.interfaces';
import { wrapResult } from '../utils/smtp.utils';

export class SmtpService {
  constructor(
    private readonly transport: any,
    private readonly from: string,
  ) {}

  async sendEmail({ to, cc, bcc, replyTo, subject, body, html }: SendEmailInput) {
    return wrapResult(
      await this.transport.sendMail({
        from: this.from,
        to,
        cc,
        bcc,
        replyTo,
        subject,
        text: body,
        html: html ?? body,
      }),
    );
  }

  async sendHtmlEmail({ to, cc, bcc, replyTo, subject, text, html }: SendHtmlEmailInput) {
    return wrapResult(await this.transport.sendMail({ from: this.from, to, cc, bcc, replyTo, subject, text, html }));
  }

  async sendEmailWithAttachments({ to, cc, bcc, subject, body, html, attachments }: SendEmailWithAttachmentsInput) {
    const mapped = attachments.map(a => ({
      filename: a.filename,
      content: Buffer.from(a.content, 'base64'),
      contentType: a.contentType,
    }));
    return wrapResult(
      await this.transport.sendMail({
        from: this.from,
        to,
        cc,
        bcc,
        subject,
        text: body,
        html: html ?? body,
        attachments: mapped,
      }),
    );
  }

  async sendBulkEmail({ recipients, subject, body }: SendBulkEmailInput) {
    const results = await Promise.all(
      recipients.map(to => this.transport.sendMail({ from: this.from, to, subject, text: body, html: body })),
    );
    return wrapResult(results);
  }

  async verifyConnection() {
    const result = await this.transport.verify();
    return wrapResult({ verified: result });
  }
}
