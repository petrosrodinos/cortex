export const C = {
  bg: 'var(--background)',
  surface: 'var(--surface)',
  surface2: 'var(--surface-secondary)',
  surface3: 'var(--surface-tertiary)',
  fg: 'var(--foreground)',
  muted: 'var(--muted)',
  border: 'var(--border)',
  accent: 'var(--accent)',
  accentFg: 'var(--accent-foreground)',
  accentBg: 'var(--accent-bg)',
  accentBorder: 'var(--accent-border)',
};

const BASE_INTEGRATIONS = [
  'Salesforce', 'PostgreSQL', 'HubSpot', 'Slack', 'QuickBooks',
  'MySQL', 'Notion', 'MongoDB', 'Stripe', 'GitHub', 'Google Sheets', 'Jira',
];

export const INTEGRATIONS = [...BASE_INTEGRATIONS, ...BASE_INTEGRATIONS];
