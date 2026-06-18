import { Injectable, Logger } from '@nestjs/common';
import { ResendMailService } from '@/integrations/notifications/resend/services/mail.service';
import { EmailTemplates } from '@/integrations/notifications/sendgrid/interfaces/mail.interfaces';
import { TemplateService } from '@/integrations/notifications/sendgrid/utils/templates.utils';
import { AppUrls } from '@/shared/config/app-urls';

type SendMemberInvitationEmailInput = {
  to: string;
  organization_name: string;
  inviter_email: string;
  invitation_token: string;
};

@Injectable()
export class MemberInvitationMailService {
  private readonly logger = new Logger(MemberInvitationMailService.name);

  constructor(
    private readonly resend_mail_service: ResendMailService,
    private readonly template_service: TemplateService,
  ) {}

  async sendInvitationEmail(input: SendMemberInvitationEmailInput) {
    const accept_url = AppUrls.invitationSignUp(input.invitation_token);
    const html = await this.template_service.renderTemplate(EmailTemplates.ORGANIZATION_MEMBER_INVITATION, {
      organization: { name: input.organization_name },
      inviter_email: input.inviter_email,
      accept_url,
    });

    await this.resend_mail_service.sendEmail({
      to: input.to,
      subject: `You're invited to join ${input.organization_name}`,
      html,
    });

    this.logger.log(`Organization invitation email sent to ${input.to}`);
  }
}
