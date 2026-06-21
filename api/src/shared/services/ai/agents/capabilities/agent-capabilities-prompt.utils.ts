const EMAIL_ACTION_KEYS = new Set([
  'send_email',
  'send_message',
  'send_email_with_attachments',
]);

const EMAIL_TOOLKIT_SLUG_PATTERN =
  /gmail|googlemail|sendgrid|resend|outlook|smtp|mailgun|postmark|ses|brevo|sendinblue/i;

type IntegrationSummary = {
  uuid: string;
  name: string;
  provider: string;
  actions: string[];
};

type ToolkitSummary = {
  slug: string;
  name: string;
  is_connected: boolean;
};

export type AgentCapabilitiesSnapshot = {
  integrations: IntegrationSummary[];
  toolkits: ToolkitSummary[];
};

export function buildAgentCapabilitiesPromptBlock(
  snapshot: AgentCapabilitiesSnapshot,
): string {
  const lines = ['Available tools for this message:'];

  if (snapshot.integrations.length === 0) {
    lines.push('- Custom integrations: none in scope');
  } else {
    lines.push('- Custom integrations:');
    for (const integration of snapshot.integrations) {
      lines.push(
        `  - ${integration.name} (${integration.provider}, uuid: ${integration.uuid}): ${integration.actions.join(', ') || 'no enabled actions'}`,
      );
    }
  }

  if (snapshot.integrations.some((integration) =>
    integration.actions.some((action) =>
      ['get_schema', 'query', 'insert', 'update', 'delete'].includes(action),
    ),
  )) {
    lines.push(
      '- Database tools: pass integration_uuid using the integration UUID from this list. Never use the display name.',
    );
  }

  if (snapshot.toolkits.length === 0) {
    lines.push('- Composio apps: none enabled in scope');
  } else {
    lines.push('- Composio apps:');
    for (const toolkit of snapshot.toolkits) {
      lines.push(
        `  - ${toolkit.name} (${toolkit.slug})${toolkit.is_connected ? ', connected' : ', not connected'}`,
      );
    }
  }

  const emailChannels = getEmailChannels(snapshot);
  if (emailChannels.length === 0) {
    lines.push(
      '- Email sending: no email integration is available in scope. Do not attempt to send email or mention Gmail, Outlook, or other providers. Tell the user to enable and connect an email app under Integrations.',
    );
  } else {
    lines.push(
      `- Email sending: use only these channels — ${emailChannels.join(', ')}. Do not mention other email providers.`,
    );
  }

  lines.push(
    'Use capabilities__list_integrations and capabilities__list_toolkits if you need to refresh this list during the conversation.',
  );

  return lines.join('\n');
}

function getEmailChannels(snapshot: AgentCapabilitiesSnapshot): string[] {
  const channels = new Set<string>();

  for (const integration of snapshot.integrations) {
    if (integration.actions.some((action) => EMAIL_ACTION_KEYS.has(action))) {
      channels.add(integration.name);
    }
  }

  for (const toolkit of snapshot.toolkits) {
    if (EMAIL_TOOLKIT_SLUG_PATTERN.test(toolkit.slug)) {
      channels.add(`${toolkit.name}${toolkit.is_connected ? '' : ' (connect first)'}`);
    }
  }

  return [...channels];
}
