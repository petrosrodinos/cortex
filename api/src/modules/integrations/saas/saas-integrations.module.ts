import { Module } from '@nestjs/common';
import { GitHubIntegrationModule } from './github/github.module';
import { GmailIntegrationModule } from './gmail/gmail.module';
import { GoogleDriveIntegrationModule } from './google-drive/google-drive.module';
import { HubSpotIntegrationModule } from './hubspot/hubspot.module';
import { IntercomIntegrationModule } from './intercom/intercom.module';
import { LinearIntegrationModule } from './linear/linear.module';
import { NotionIntegrationModule } from './notion/notion.module';
import { PostHogIntegrationModule } from './posthog/posthog.module';
import { SlackIntegrationModule } from './slack/slack.module';
import { SmtpIntegrationModule } from './smtp/smtp.module';
import { ResendIntegrationModule } from './resend/resend.module';
import { SendGridIntegrationModule } from './sendgrid/sendgrid.module';
import { StripeIntegrationModule } from './stripe/stripe.module';

@Module({
  imports: [
    GitHubIntegrationModule,
    SlackIntegrationModule,
    StripeIntegrationModule,
    HubSpotIntegrationModule,
    LinearIntegrationModule,
    NotionIntegrationModule,
    GoogleDriveIntegrationModule,
    SmtpIntegrationModule,
    ResendIntegrationModule,
    SendGridIntegrationModule,
    GmailIntegrationModule,
    PostHogIntegrationModule,
    IntercomIntegrationModule,
  ],
})
export class SaasIntegrationsModule {}
