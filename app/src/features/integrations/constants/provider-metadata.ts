import type { ComponentType } from 'react';
import { Mail, Cpu, FileCode2 } from 'lucide-react';
import { SiGithub, SiSlack, SiStripe, SiHubspot, SiLinear, SiNotion, SiGoogledrive, SiGmail, SiPosthog, SiIntercom, SiPostgresql, SiMysql, SiMongodb } from 'react-icons/si';
import type { IntegrationProvider } from '@/features/integrations/common/interfaces/integration.interface';
import type { DatabaseOperation } from '@/features/integrations/database/interfaces/database.interface';
import { DatabaseOperations } from '@/features/integrations/database/interfaces/database.interface';
import type { McpAuthType } from '@/features/integrations/mcp/interfaces/mcp.interface';
import { McpAuthTypes } from '@/features/integrations/mcp/interfaces/mcp.interface';
import type { OpenApiAuthType } from '@/features/integrations/openapi/interfaces/openapi.interface';
import { OpenApiAuthTypes } from '@/features/integrations/openapi/interfaces/openapi.interface';

export type ProviderIcon = ComponentType<{ size?: number; className?: string }>;

export const providerLabels: Record<IntegrationProvider, string> = {
  GITHUB: 'GitHub',
  SLACK: 'Slack',
  STRIPE: 'Stripe',
  HUBSPOT: 'HubSpot',
  LINEAR: 'Linear',
  NOTION: 'Notion',
  GOOGLE_DRIVE: 'Google Drive',
  SMTP: 'SMTP',
  GMAIL: 'Gmail',
  RESEND: 'Resend',
  SENDGRID: 'SendGrid',
  POSTHOG: 'PostHog',
  INTERCOM: 'Intercom',
  DATABASE_PG: 'PostgreSQL',
  DATABASE_MYSQL: 'MySQL',
  DATABASE_MONGO: 'MongoDB',
  OPENAPI: 'OpenAPI',
  MCP: 'MCP',
};

export const providerDescriptions: Record<IntegrationProvider, string> = {
  GITHUB: 'Repos, issues, pull requests, and workflows',
  SLACK: 'Messages, channels, and workspace events',
  STRIPE: 'Payments, customers, and subscriptions',
  HUBSPOT: 'CRM contacts, companies, and deals',
  LINEAR: 'Issues, projects, and engineering cycles',
  NOTION: 'Pages and databases from your workspace',
  GOOGLE_DRIVE: 'Files and folders in Google Drive',
  GMAIL: 'Email read, search, send, and drafts',
  SMTP: 'Send email through any SMTP relay',
  RESEND: 'Send transactional email via the Resend API',
  SENDGRID: 'Send transactional email via the SendGrid API',
  POSTHOG: 'Product analytics and feature flags',
  INTERCOM: 'Customer conversations and support tickets',
  DATABASE_PG: 'Query a PostgreSQL database',
  DATABASE_MYSQL: 'Query a MySQL database',
  DATABASE_MONGO: 'Query a MongoDB collection',
  OPENAPI: 'Connect any API via an OpenAPI spec',
  MCP: 'Any tool server via Model Context Protocol',
};

export const PROVIDER_ICON_META: Record<IntegrationProvider, { bg: string; icon: ProviderIcon }> = {
  GITHUB: { bg: '#24292f', icon: SiGithub },
  SLACK: { bg: '#4a154b', icon: SiSlack },
  STRIPE: { bg: '#635bff', icon: SiStripe },
  HUBSPOT: { bg: '#e8714a', icon: SiHubspot },
  LINEAR: { bg: '#5e6ad2', icon: SiLinear },
  NOTION: { bg: '#373530', icon: SiNotion },
  GOOGLE_DRIVE: { bg: '#4285f4', icon: SiGoogledrive },
  GMAIL: { bg: '#ea4335', icon: SiGmail },
  SMTP: { bg: '#6b7a8d', icon: Mail },
  RESEND: { bg: '#000000', icon: Mail },
  SENDGRID: { bg: '#1a82e2', icon: Mail },
  POSTHOG: { bg: '#e4511e', icon: SiPosthog },
  INTERCOM: { bg: '#1f8ded', icon: SiIntercom },
  DATABASE_PG: { bg: '#336791', icon: SiPostgresql },
  DATABASE_MYSQL: { bg: '#00758f', icon: SiMysql },
  DATABASE_MONGO: { bg: '#13aa52', icon: SiMongodb },
  OPENAPI: { bg: '#0d9488', icon: FileCode2 },
  MCP: { bg: '#7c3aed', icon: Cpu },
};

export const databaseOperationLabels: Record<DatabaseOperation, string> = {
  READ: 'Read',
  INSERT: 'Insert',
  UPDATE: 'Update',
  DELETE: 'Delete',
};

export const openApiAuthLabels: Record<OpenApiAuthType, string> = {
  NONE: 'None',
  API_KEY: 'API key',
  BEARER: 'Bearer token',
  OAUTH2: 'OAuth2 token',
  CUSTOM_HEADERS: 'Custom headers',
};

export const mcpAuthLabels: Record<McpAuthType, string> = {
  NONE: 'None',
  BEARER: 'Bearer token',
  CUSTOM_HEADERS: 'Custom headers',
  OAUTH: 'OAuth',
};

export interface ProviderSetupGuide {
  summary: string;
  steps: { text: string; code?: string }[];
  docsUrl: string;
  docsLabel: string;
  scopes: string[];
  credentialKind: 'api-key' | 'oauth' | 'smtp' | 'connection-string';
}

export const PROVIDER_SETUP_GUIDES: Partial<Record<IntegrationProvider, ProviderSetupGuide>> = {
  GITHUB: {
    summary: 'Connect GitHub to read repos, issues, pull requests, and run workflows via a Personal Access Token.',
    credentialKind: 'api-key',
    docsUrl: 'https://github.com/settings/tokens/new',
    docsLabel: 'Open GitHub token settings',
    scopes: ['repo', 'read:org', 'workflow'],
    steps: [
      { text: 'Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.' },
      { text: 'Click "Generate new token" and set an expiry.' },
      { text: 'Under "Repository access" select the repos this agent may touch.' },
      { text: 'Grant permissions: Contents (Read), Issues (Read & write), Pull requests (Read & write), Metadata (Read).' },
      { text: 'Copy the generated token into the Access token field above.' },
    ],
  },
  SLACK: {
    summary: 'Send messages, list channels, and manage workspace data via a Slack Bot Token.',
    credentialKind: 'api-key',
    docsUrl: 'https://api.slack.com/apps',
    docsLabel: 'Open Slack app settings',
    scopes: ['channels:read', 'chat:write', 'users:read', 'files:read'],
    steps: [
      { text: 'Go to api.slack.com/apps and create a new app (from scratch).' },
      { text: 'Navigate to OAuth & Permissions and add the required bot token scopes.' },
      { text: 'Click "Install to Workspace" to authorize the app.' },
      { text: 'Copy the "Bot User OAuth Token" (starts with xoxb-) into the Bot token field above.' },
    ],
  },
  STRIPE: {
    summary: 'Access customers, payments, invoices, and subscriptions via the Stripe API.',
    credentialKind: 'api-key',
    docsUrl: 'https://dashboard.stripe.com/apikeys',
    docsLabel: 'Open Stripe API keys',
    scopes: [],
    steps: [
      { text: 'Go to your Stripe Dashboard → Developers → API keys.' },
      { text: 'For production use a Restricted key with only the permissions the agent needs.' },
      { text: 'Copy the secret key (sk_live_... or sk_test_...) into the Secret key field above.' },
    ],
  },
  HUBSPOT: {
    summary: 'Read and write CRM contacts, companies, and deals via a HubSpot Private App token.',
    credentialKind: 'api-key',
    docsUrl: 'https://app.hubspot.com/private-apps',
    docsLabel: 'Open HubSpot private apps',
    scopes: ['crm.objects.contacts.read', 'crm.objects.contacts.write', 'crm.objects.companies.read'],
    steps: [
      { text: 'Go to HubSpot → Settings → Integrations → Private Apps.' },
      { text: 'Create a new private app and grant the required CRM scopes.' },
      { text: 'Copy the access token from the "Auth" tab into the Access token field above.' },
    ],
  },
  LINEAR: {
    summary: 'Manage issues, projects, and teams via the Linear API.',
    credentialKind: 'api-key',
    docsUrl: 'https://linear.app/settings/api',
    docsLabel: 'Open Linear API settings',
    scopes: [],
    steps: [
      { text: 'Go to Linear → Settings → API.' },
      { text: 'Click "Create key", give it a label, and copy it.' },
      { text: 'Paste the key into the API key field above.' },
    ],
  },
  NOTION: {
    summary: 'Access Notion databases and pages via an internal integration token.',
    credentialKind: 'api-key',
    docsUrl: 'https://www.notion.so/my-integrations',
    docsLabel: 'Open Notion integrations',
    scopes: [],
    steps: [
      { text: 'Go to notion.so/my-integrations and create a new integration.' },
      { text: 'Set the capabilities (read content, update content, etc.) and submit.' },
      { text: 'Copy the "Internal Integration Secret" into the API key field above.' },
      { text: 'Important: open each Notion database you want to share and add the integration via the "..." menu → Connections.' },
    ],
  },
  GOOGLE_DRIVE: {
    summary: 'Read and manage files in Google Drive using OAuth 2.0 credentials from a Google Cloud project.',
    credentialKind: 'oauth',
    docsUrl: 'https://console.cloud.google.com/apis/credentials',
    docsLabel: 'Open Google Cloud credentials',
    scopes: ['https://www.googleapis.com/auth/drive'],
    steps: [
      { text: 'Open Google Cloud Console (console.cloud.google.com) and create or select a project.' },
      { text: 'Go to APIs & Services → Library, search for "Google Drive API", and enable it.' },
      { text: 'Go to APIs & Services → OAuth consent screen, choose External, fill in the app name and support email, then add the Drive scope.' },
      { text: 'Go to APIs & Services → Credentials → Create credentials → OAuth client ID. Choose "Web application".' },
      { text: "Add your app's callback URL as an Authorized redirect URI, then save." },
      { text: 'Copy the Client ID and Client Secret from the credentials details into the fields above.' },
      { text: 'Run an OAuth flow (e.g. Google OAuth Playground at developers.google.com/oauthplayground) to obtain an Access Token and Refresh Token, then paste them above.' },
    ],
  },
  GMAIL: {
    summary: 'Read and send email via Gmail using OAuth 2.0 credentials from a Google Cloud project.',
    credentialKind: 'oauth',
    docsUrl: 'https://console.cloud.google.com/apis/credentials',
    docsLabel: 'Open Google Cloud credentials',
    scopes: ['https://www.googleapis.com/auth/gmail.modify'],
    steps: [
      { text: 'Open Google Cloud Console (console.cloud.google.com) and create or select a project.' },
      { text: 'Go to APIs & Services → Library, search for "Gmail API", and enable it.' },
      { text: 'Go to APIs & Services → OAuth consent screen, choose External, fill in the app name and support email, then add the Gmail scope.' },
      { text: 'Go to APIs & Services → Credentials → Create credentials → OAuth client ID. Choose "Web application".' },
      { text: "Add your app's callback URL as an Authorized redirect URI, then save." },
      { text: 'Copy the Client ID and Client Secret from the credentials details into the fields above.' },
      { text: 'Run an OAuth flow (e.g. Google OAuth Playground at developers.google.com/oauthplayground) to obtain an Access Token and Refresh Token, then paste them above.' },
    ],
  },
  SMTP: {
    summary: 'Send email through any SMTP relay (Gmail, SendGrid, Mailgun, etc.).',
    credentialKind: 'smtp',
    docsUrl: '',
    docsLabel: '',
    scopes: [],
    steps: [
      { text: 'For Gmail: go to Google Account → Security → App Passwords and create a new app password.' },
      { text: 'Set host to smtp.gmail.com, port to 587 (STARTTLS) or 465 (SSL/TLS).', code: 'smtp.gmail.com' },
      { text: 'Use your email address as the username and the app password (not your account password) as the password.' },
      { text: 'For other providers (SendGrid, Mailgun, etc.) use the SMTP credentials from their dashboard.' },
    ],
  },
  RESEND: {
    summary: 'Send transactional email via the Resend HTTP API using an API key and verified sender.',
    credentialKind: 'api-key',
    docsUrl: 'https://resend.com/api-keys',
    docsLabel: 'Open Resend API keys',
    scopes: [],
    steps: [
      { text: 'Sign in at resend.com and verify your sending domain under Domains.' },
      { text: 'Go to API Keys and create a key with sending access.' },
      { text: 'Copy the API key (starts with re_) into the API key field above.' },
      { text: 'Set From email to an address on your verified domain.', code: 'hello@yourdomain.com' },
    ],
  },
  SENDGRID: {
    summary: 'Send transactional email via the SendGrid HTTP API using an API key and verified sender.',
    credentialKind: 'api-key',
    docsUrl: 'https://app.sendgrid.com/settings/api_keys',
    docsLabel: 'Open SendGrid API keys',
    scopes: [],
    steps: [
      { text: 'Sign in to SendGrid and complete sender authentication for your domain or single sender.' },
      { text: 'Go to Settings → API Keys → Create API Key with Mail Send permission.' },
      { text: 'Copy the API key (starts with SG.) into the API key field above.' },
      { text: 'Set From email to your verified sender address.', code: 'hello@yourdomain.com' },
    ],
  },
  POSTHOG: {
    summary: 'Query product analytics events and feature flags via the PostHog API.',
    credentialKind: 'api-key',
    docsUrl: 'https://app.posthog.com/settings/project',
    docsLabel: 'Open PostHog project settings',
    scopes: [],
    steps: [
      { text: 'Go to PostHog → Project Settings → Project API key.' },
      { text: 'Copy the project API key into the API key field above.' },
      { text: 'Set the host to your PostHog instance URL (e.g. app.posthog.com for Cloud).', code: 'https://app.posthog.com' },
      { text: 'Find your Project ID in the URL bar when viewing your project (the number after /project/).' },
    ],
  },
  INTERCOM: {
    summary: 'Manage contacts, conversations, and support tickets via the Intercom API.',
    credentialKind: 'api-key',
    docsUrl: 'https://app.intercom.com/a/apps/_/developer-hub',
    docsLabel: 'Open Intercom developer hub',
    scopes: [],
    steps: [
      { text: 'Go to Intercom → Settings → Developer Hub → Your apps → Create a new app.' },
      { text: 'Under "Authentication", copy the Access Token.' },
      { text: 'Paste it into the Access token field above.' },
    ],
  },
  DATABASE_PG: {
    summary: 'Connect to a PostgreSQL database using a connection string.',
    credentialKind: 'connection-string',
    docsUrl: '',
    docsLabel: '',
    scopes: [],
    steps: [
      { text: 'Build a connection string using your database host, port, name, and credentials.', code: 'postgresql://user:password@host:5432/dbname' },
      { text: 'For SSL connections append ?sslmode=require to the connection string.' },
      { text: 'Ensure the database user has SELECT (and other permitted) privileges on the target tables.' },
    ],
  },
  DATABASE_MYSQL: {
    summary: 'Connect to a MySQL database using a connection string.',
    credentialKind: 'connection-string',
    docsUrl: '',
    docsLabel: '',
    scopes: [],
    steps: [
      { text: 'Build a connection string using your database host, port, name, and credentials.', code: 'mysql://user:password@host:3306/dbname' },
      { text: 'Ensure the database user has SELECT (and other permitted) privileges on the target tables.' },
    ],
  },
  DATABASE_MONGO: {
    summary: 'Connect to a MongoDB database using a connection string.',
    credentialKind: 'connection-string',
    docsUrl: '',
    docsLabel: '',
    scopes: [],
    steps: [
      { text: 'Use your MongoDB Atlas or self-hosted connection string.', code: 'mongodb+srv://user:password@cluster.mongodb.net/dbname' },
      { text: 'For Atlas: go to Database → Connect → Drivers and copy the connection string.' },
      { text: "Replace <password> with your database user's password and append the database name." },
    ],
  },
};

// Re-export enums that are needed alongside these constants
export { DatabaseOperations, McpAuthTypes, OpenApiAuthTypes };
