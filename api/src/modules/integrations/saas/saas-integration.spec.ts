import { ForbiddenException } from '@nestjs/common';
import { IntegrationProvider } from 'generated/prisma';
import { GitHubIntegration } from './github/github.integration';
import { SlackIntegration } from './slack/slack.integration';
import { StripeIntegration } from './stripe/stripe.integration';
import { HubSpotIntegration } from './hubspot/hubspot.integration';
import { LinearIntegration } from './linear/linear.integration';
import { NotionIntegration } from './notion/notion.integration';
import { GoogleDriveIntegration } from './google-drive/google-drive.integration';
import { SmtpIntegration } from './smtp/smtp.integration';
import { GmailIntegration } from './gmail/gmail.integration';
import { PostHogIntegration } from './posthog/posthog.integration';
import { IntercomIntegration } from './intercom/intercom.integration';
import { ResendIntegration } from './resend/resend.integration';
import { SendGridIntegration } from './sendgrid/sendgrid.integration';

jest.mock('./resend/utils/resend.utils', () => ({
  ...jest.requireActual('./resend/utils/resend.utils'),
  verifyResendApiKey: jest.fn().mockResolvedValue(true),
}));

jest.mock('./sendgrid/utils/sendgrid.utils', () => ({
  ...jest.requireActual('./sendgrid/utils/sendgrid.utils'),
  verifySendGridApiKey: jest.fn().mockResolvedValue(true),
}));

const providerCases = [
  [IntegrationProvider.GITHUB, GitHubIntegration, 'github__list_repos', 'accessToken'],
  [IntegrationProvider.SLACK, SlackIntegration, 'slack__list_channels', 'botToken'],
  [IntegrationProvider.STRIPE, StripeIntegration, 'stripe__list_customers', 'secretKey'],
  [IntegrationProvider.HUBSPOT, HubSpotIntegration, 'hubspot__list_contacts', 'accessToken'],
  [IntegrationProvider.LINEAR, LinearIntegration, 'linear__list_issues', 'apiKey'],
  [IntegrationProvider.NOTION, NotionIntegration, 'notion__search', 'apiKey'],
  [IntegrationProvider.GOOGLE_DRIVE, GoogleDriveIntegration, 'google_drive__list_files', 'accessToken'],
  [IntegrationProvider.SMTP, SmtpIntegration, 'smtp__send_email', 'host'],
  [IntegrationProvider.GMAIL, GmailIntegration, 'gmail__list_messages', 'accessToken'],
  [IntegrationProvider.RESEND, ResendIntegration, 'resend__send_email', 'apiKey'],
  [IntegrationProvider.SENDGRID, SendGridIntegration, 'sendgrid__send_email', 'apiKey'],
  [IntegrationProvider.POSTHOG, PostHogIntegration, 'posthog__get_events', 'apiKey'],
  [IntegrationProvider.INTERCOM, IntercomIntegration, 'intercom__list_conversations', 'accessToken'],
] as const;

describe('SaaS integrations', () => {
  const prisma: any = {
    integrationAction: {
      findFirst: jest.fn(),
    },
  };
  const encryption: any = {
    decrypt: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.integrationAction.findFirst.mockResolvedValue({ uuid: 'action-uuid', enabled: true });
    encryption.decrypt.mockReturnValue(JSON.stringify({ accessToken: 'token', botToken: 'token', secretKey: 'sk', apiKey: 'key', host: 'smtp.example.com', port: 587, user: 'user', password: 'password', from: 'ops@example.com', projectId: '1' }));
  });

  it.each(providerCases)('%s exposes default actions and matching OpenAI tool names', (_provider, IntegrationClass, toolName) => {
    const integration = new IntegrationClass(prisma, encryption);
    const actions = integration.defaultActions();
    const tools = integration.getTools({ uuid: 'integration-uuid' } as any);

    expect(actions.length).toBeGreaterThan(0);
    expect(tools.map((tool) => tool.function.name)).toContain(toolName);
    expect(tools.every((tool) => tool.type === 'function')).toBe(true);
  });

  it.each(providerCases)('%s validates credentials before testConnection', async (_provider, IntegrationClass, _toolName, requiredKey) => {
    const integration = new IntegrationClass(prisma, encryption);

    await expect(integration.testConnection({})).resolves.toBe(false);
    await expect(
      integration.testConnection({
        [requiredKey]: 'value',
        accessToken: 'token',
        botToken: 'token',
        secretKey: 'sk',
        apiKey: 'key',
        projectId: '1',
        port: 587,
        from: 'ops@example.com',
      }),
    ).resolves.toBe(true);
  });

  it('returns a safe failure object instead of throwing raw SDK errors', async () => {
    prisma.integrationAction.findFirst.mockRejectedValue(new ForbiddenException('disabled'));
    const integration = new GitHubIntegration(prisma, encryption);

    await expect(
      integration.executeTool('github__list_repos', {}, { uuid: 'integration-uuid', config: 'ciphertext' } as any),
    ).resolves.toEqual({ success: false, error: 'disabled' });
  });
});
