const PROVIDER_LABELS: Record<string, string> = {
  smtp: 'Email',
  sendgrid: 'SendGrid',
  resend: 'Resend',
  gmail: 'Gmail',
  github: 'GitHub',
  slack: 'Slack',
  stripe: 'Stripe',
  hubspot: 'HubSpot',
  linear: 'Linear',
  notion: 'Notion',
  google_drive: 'Google Drive',
  posthog: 'PostHog',
  intercom: 'Intercom',
};

const ACTION_LABELS: Record<string, string> = {
  send_email: 'Send email',
  send_message: 'Send message',
  send_bulk_email: 'Send bulk email',
  send_html_email: 'Send HTML email',
  send_email_with_attachments: 'Send email with attachments',
  list_members: 'List team members',
  get_member: 'Look up team member',
  get_account: 'Get account info',
  get_schema: 'Inspect database schema',
  query: 'Run database query',
  insert: 'Insert database row',
  list_repos: 'List repositories',
  list_channels: 'List channels',
  list_customers: 'List customers',
  list_contacts: 'List contacts',
  list_issues: 'List issues',
  search: 'Search',
  list_files: 'List files',
  list_messages: 'List messages',
  get_events: 'Get analytics events',
  list_conversations: 'List conversations',
};

const TOOL_LABELS: Record<string, string> = {
  code_interpreter: 'Run Python code',
  'document__list': 'List attached files',
  'document__read_pdf': 'Read PDF file',
  'document__read_word': 'Read Word document',
  'document__read_excel': 'Read Excel spreadsheet',
  'document__read_csv': 'Read CSV file',
  'document__read_text': 'Read text file',
  'document__read_image': 'Read image file',
  'output__create_image': 'Generate image',
  'output__create_word': 'Create Word document',
  'output__create_pdf': 'Create PDF document',
  'output__create_excel': 'Create Excel spreadsheet',
  'output__create_widget': 'Create interactive widget',
  'organization__get_account': 'Get organization profile',
  'organization__list_members': 'List team members',
  'organization__get_member': 'Look up team member',
};

function titleCase(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function humanizeToken(value: string): string {
  return titleCase(value.replace(/_/g, ' ').trim());
}

function formatActionLabel(action: string): string {
  if (ACTION_LABELS[action]) {
    return ACTION_LABELS[action];
  }

  if (action.startsWith('list_')) {
    return `List ${humanizeToken(action.slice(5)).toLowerCase()}`;
  }

  if (action.startsWith('get_')) {
    return `Get ${humanizeToken(action.slice(4)).toLowerCase()}`;
  }

  if (action.startsWith('create_')) {
    return `Create ${humanizeToken(action.slice(7)).toLowerCase()}`;
  }

  if (action.startsWith('send_')) {
    return `Send ${humanizeToken(action.slice(5)).toLowerCase()}`;
  }

  return humanizeToken(action);
}

function formatNamespacedTool(provider: string, action: string): string {
  const providerLabel = PROVIDER_LABELS[provider] ?? humanizeToken(provider);
  return `${providerLabel}: ${formatActionLabel(action)}`;
}

export function isDisplayableToolName(toolName: string): boolean {
  return !toolName.endsWith(':llm-step');
}

export function formatToolName(toolName: string): string {
  if (TOOL_LABELS[toolName]) {
    return TOOL_LABELS[toolName];
  }

  if (toolName.startsWith('db__')) {
    return `Database: ${formatActionLabel(toolName.slice(4))}`;
  }

  const openapiMatch = toolName.match(/^openapi_[^_]+__(.+)$/);
  if (openapiMatch) {
    return `API: ${formatActionLabel(openapiMatch[1])}`;
  }

  const mcpMatch = toolName.match(/^mcp_[^_]+__(.+)$/);
  if (mcpMatch) {
    return `MCP: ${formatActionLabel(mcpMatch[1])}`;
  }

  const integrationMatch = toolName.match(/^([a-z][a-z0-9_]*)__(.+)$/);
  if (integrationMatch) {
    return formatNamespacedTool(integrationMatch[1], integrationMatch[2]);
  }

  if (toolName.startsWith('output__create_')) {
    return `Create ${humanizeToken(toolName.slice('output__create_'.length)).toLowerCase()}`;
  }

  if (toolName.startsWith('document__read_')) {
    return `Read ${humanizeToken(toolName.slice('document__read_'.length)).toLowerCase()} file`;
  }

  if (toolName.startsWith('organization__')) {
    return formatActionLabel(toolName.slice('organization__'.length));
  }

  return humanizeToken(toolName.replace(/__/g, ' '));
}
