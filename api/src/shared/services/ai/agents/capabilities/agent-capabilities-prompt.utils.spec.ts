import { buildAgentCapabilitiesPromptBlock } from './agent-capabilities-prompt.utils';

describe('buildAgentCapabilitiesPromptBlock', () => {
  it('lists available integrations and toolkits for the agent', () => {
    const prompt = buildAgentCapabilitiesPromptBlock({
      integrations: [
        {
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

    expect(prompt).toContain('sineverse (DATABASE_PG)');
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
});
