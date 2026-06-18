import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailConfig } from '@/shared/config/email';
import { CreateEmail, EmailFromAddress } from '../../sendgrid/interfaces/mail.interfaces';
import { ResendConfig } from './resend.config';

@Injectable()
export class ResendAdapter {
  private readonly logger = new Logger(ResendAdapter.name);
  private readonly emailFromAddresses: EmailFromAddress;
  private readonly defaultFromAddress: string;

  constructor(
    private readonly resendConfig: ResendConfig,
    private readonly configService: ConfigService,
  ) {
    this.emailFromAddresses = EmailConfig.email_addresses;
    this.defaultFromAddress =
      this.configService.get<string>('FROM_EMAIL') ?? this.emailFromAddresses.confirmation;
  }

  public async sendEmail(createEmail: CreateEmail) {
    try {
      const resendClient = this.resendConfig.getResendClient();
      const result = await resendClient.emails.send({
        from: createEmail.from || this.defaultFromAddress,
        to: createEmail.to,
        subject: createEmail.subject,
        text: createEmail.text,
        html: createEmail.html,
        cc: createEmail.cc,
        bcc: createEmail.bcc,
        replyTo: createEmail.replyTo,
        headers: createEmail.headers,
      });

      if (result.error) {
        this.logger.error('Resend email failed', result.error);
        throw new InternalServerErrorException(result.error.message || 'Failed to send email with Resend');
      }

      return result.data;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      this.logger.error(error);
      throw new InternalServerErrorException('Failed to send email with Resend');
    }
  }
}
