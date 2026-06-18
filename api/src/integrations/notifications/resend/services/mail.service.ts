import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateEmail } from '../../sendgrid/interfaces/mail.interfaces';
import { ResendAdapter } from '../resend/resend.adapter';

@Injectable()
export class ResendMailService {
  private readonly logger = new Logger(ResendMailService.name);

  constructor(private readonly resendAdapter: ResendAdapter) {}

  public async sendEmail(createEmail: CreateEmail) {
    try {
      return await this.resendAdapter.sendEmail(createEmail);
    } catch (error) {
      this.logger.error(error);
      const message = error instanceof Error ? error.message : 'Failed to send email with Resend';
      throw new InternalServerErrorException(message);
    }
  }

  public async sendBulkEmails(createEmails: CreateEmail[]) {
    try {
      const promises = createEmails.map(async (createEmail) => this.sendEmail(createEmail));
      return await Promise.all(promises);
    } catch (error) {
      this.logger.error(error);
      const message = error instanceof Error ? error.message : 'Failed to send bulk emails with Resend';
      throw new InternalServerErrorException(message);
    }
  }
}
