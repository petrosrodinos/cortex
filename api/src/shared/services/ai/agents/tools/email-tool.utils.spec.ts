import {
  applyDefaultEmailSender,
  extractSenderEmailFromToolInput,
  inferEmailSenderFromAccountLabel,
  isEmailSendToolName,
  isTransactionalEmailToolkitSlug,
  resolveComposioAccountLabel,
  stripPersonalEmailFromSenderFields,
} from './email-tool.utils';

describe('email-tool.utils', () => {
  it('detects email send tool names', () => {
    expect(isEmailSendToolName('resend_send_email')).toBe(true);
    expect(isEmailSendToolName('gmail_send_message')).toBe(true);
    expect(isEmailSendToolName('resend_send_email_with_attachments')).toBe(false);
  });

  it('detects transactional email toolkit slugs', () => {
    expect(isTransactionalEmailToolkitSlug('resend')).toBe(true);
    expect(isTransactionalEmailToolkitSlug('sendgrid')).toBe(true);
    expect(isTransactionalEmailToolkitSlug('gmail')).toBe(false);
  });

  it('extracts sender email from account labels', () => {
    expect(inferEmailSenderFromAccountLabel('info@logiqdev.com')).toBe(
      'info@logiqdev.com',
    );
    expect(
      inferEmailSenderFromAccountLabel('Resend account (info@logiqdev.com)'),
    ).toBe('info@logiqdev.com');
    expect(inferEmailSenderFromAccountLabel('ACTIVE')).toBeNull();
  });

  it('resolves composio account labels from nested fields', () => {
    expect(
      resolveComposioAccountLabel({
        status: 'ACTIVE',
        connectionParams: { from_email: 'info@logiqdev.com' },
      }),
    ).toBe('info@logiqdev.com');
  });

  it('strips personal and consumer email senders', () => {
    expect(
      stripPersonalEmailFromSenderFields(
        { from: 'petros1petros2@gmail.com', to: 'team@test.com' },
        'petros1petros2@gmail.com',
      ),
    ).toEqual({ to: 'team@test.com' });
  });

  it('applies default sender across from fields', () => {
    expect(
      applyDefaultEmailSender({ to: 'team@test.com' }, 'info@logiqdev.com', {
        force: true,
      }),
    ).toEqual({
      to: 'team@test.com',
      from: 'info@logiqdev.com',
      from_email: 'info@logiqdev.com',
      sender: 'info@logiqdev.com',
      sender_email: 'info@logiqdev.com',
      fromAddress: 'info@logiqdev.com',
    });
  });

  it('reads sender email from tool input fields', () => {
    expect(
      extractSenderEmailFromToolInput({
        from: 'info@logiqdev.com',
        to: 'team@test.com',
      }),
    ).toBe('info@logiqdev.com');
  });
});
