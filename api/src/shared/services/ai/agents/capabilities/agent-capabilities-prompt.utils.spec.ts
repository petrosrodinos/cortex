import { buildAgentCapabilitiesPromptBlock } from './agent-capabilities-prompt.utils';

describe('buildAgentCapabilitiesPromptBlock', () => {
  it('lists available integrations and toolkits for the agent', () => {
    const prompt = buildAgentCapabilitiesPromptBlock(        {
          integrations: [
            {
              uuid: 'integration-a',
              name: 'sineverse',
              provider: 'DATABASE_PG',
              actions: ['get_schema', 'query'],
            },
          ],
      toolkits: [
        {
          slug: 'slack',
          name: 'Slack',
          is_connected: true,
        },
      ],
    });

    expect(prompt).toContain(
      'sineverse (DATABASE_PG, uuid: integration-a)',
    );
    expect(prompt).toContain(
      'pass integration_uuid using the integration UUID from this list',
    );
    expect(prompt).toContain('Slack (slack), connected');
    expect(prompt).toContain('no email integration is available');
    expect(prompt).not.toMatch(/Email sending: use only these channels — .*Gmail/);
  });

  it('lists connected email channels without inventing unavailable providers', () => {
    const prompt = buildAgentCapabilitiesPromptBlock({
      integrations: [],
      toolkits: [
        {
          slug: 'resend',
          name: 'Resend',
          is_connected: true,
        },
      ],
    });

    expect(prompt).toContain('Email sending: use only these channels — Resend');
    expect(prompt).not.toContain('Gmail');
  });

  it('shows default sender email for connected transactional toolkits', () => {
    const prompt = buildAgentCapabilitiesPromptBlock({
      integrations: [],
      toolkits: [
        {
          slug: 'resend',
          name: 'Resend',
          is_connected: true,
          default_sender_email: 'info@logiqdev.com',
        },
      ],
    });

    expect(prompt).toContain('Resend (resend), connected, default sender: info@logiqdev.com');
    expect(prompt).toContain(
      'use default_sender_email from capabilities__list_toolkits as the from address',
    );
  });

  it('tells the agent to ask for sender when transactional app has no default', () => {
    const prompt = buildAgentCapabilitiesPromptBlock({
      integrations: [],
      toolkits: [
        {
          slug: 'resend',
          name: 'Resend',
          is_connected: true,
        },
      ],
    });

    expect(prompt).toContain(
      'Resend is connected but no default sender is configured. Ask the user for the verified sender email address before attempting to send.',
    );
  });
});
