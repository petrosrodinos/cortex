import { IntegrationProviders, type IntegrationProvider } from '../common/interfaces/integration.interface';

export interface ProviderConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'number';
  span?: 'full';
  placeholder?: string;
}

export const PROVIDER_CONFIG_FIELDS: Record<IntegrationProvider, ProviderConfigField[]> = {
  [IntegrationProviders.GITHUB]: [{ key: 'accessToken', label: 'Access token', type: 'password', span: 'full', placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxx' }],
  [IntegrationProviders.SLACK]: [{ key: 'botToken', label: 'Bot token', type: 'password', span: 'full', placeholder: 'xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx' }],
  [IntegrationProviders.STRIPE]: [{ key: 'secretKey', label: 'Secret key', type: 'password', span: 'full', placeholder: 'sk_live_xxxxxxxxxxxxxxxxxxxx' }],
  [IntegrationProviders.HUBSPOT]: [{ key: 'accessToken', label: 'Access token', type: 'password', span: 'full', placeholder: 'pat-na1-xxxxxxxxxxxxxxxxxxxx' }],
  [IntegrationProviders.LINEAR]: [{ key: 'apiKey', label: 'API key', type: 'password', span: 'full', placeholder: 'lin_api_xxxxxxxxxxxxxxxxxxxx' }],
  [IntegrationProviders.NOTION]: [{ key: 'apiKey', label: 'API key', type: 'password', span: 'full', placeholder: 'secret_xxxxxxxxxxxxxxxxxxxx' }],
  [IntegrationProviders.GOOGLE_DRIVE]: [
    { key: 'accessToken', label: 'Access token', type: 'password', span: 'full', placeholder: 'ya29.xxxxxxxxxxxxxxxxxxxx' },
    { key: 'refreshToken', label: 'Refresh token', type: 'password', span: 'full', placeholder: '1//xxxxxxxxxxxxxxxxxxxx' },
    { key: 'clientId', label: 'Client ID', type: 'text', placeholder: 'xxxxxxxxxxxx.apps.googleusercontent.com' },
    { key: 'clientSecret', label: 'Client secret', type: 'password', placeholder: 'GOCSPX-xxxxxxxxxxxxxxxxxxxx' },
  ],
  [IntegrationProviders.SMTP]: [
    { key: 'host', label: 'Host', type: 'text', placeholder: 'smtp.example.com' },
    { key: 'port', label: 'Port', type: 'number', placeholder: '587' },
    { key: 'user', label: 'Username', type: 'text', placeholder: 'user@example.com' },
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { key: 'from', label: 'From email', type: 'text', span: 'full', placeholder: 'noreply@example.com' },
  ],
  [IntegrationProviders.RESEND]: [
    { key: 'apiKey', label: 'API key', type: 'password', span: 'full', placeholder: 're_xxxxxxxxxxxxxxxxxxxx' },
    { key: 'from', label: 'From email', type: 'text', span: 'full', placeholder: 'hello@yourdomain.com' },
  ],
  [IntegrationProviders.SENDGRID]: [
    { key: 'apiKey', label: 'API key', type: 'password', span: 'full', placeholder: 'SG.xxxxxxxxxxxxxxxxxxxx' },
    { key: 'from', label: 'From email', type: 'text', span: 'full', placeholder: 'hello@yourdomain.com' },
  ],
  [IntegrationProviders.GMAIL]: [
    { key: 'accessToken', label: 'Access token', type: 'password', span: 'full', placeholder: 'ya29.xxxxxxxxxxxxxxxxxxxx' },
    { key: 'refreshToken', label: 'Refresh token', type: 'password', span: 'full', placeholder: '1//xxxxxxxxxxxxxxxxxxxx' },
    { key: 'clientId', label: 'Client ID', type: 'text', placeholder: 'xxxxxxxxxxxx.apps.googleusercontent.com' },
    { key: 'clientSecret', label: 'Client secret', type: 'password', placeholder: 'GOCSPX-xxxxxxxxxxxxxxxxxxxx' },
  ],
  [IntegrationProviders.POSTHOG]: [
    { key: 'apiKey', label: 'API key', type: 'password', span: 'full', placeholder: 'phx_xxxxxxxxxxxxxxxxxxxx' },
    { key: 'host', label: 'Host', type: 'text', placeholder: 'https://app.posthog.com' },
    { key: 'projectId', label: 'Project ID', type: 'text', placeholder: '12345' },
  ],
  [IntegrationProviders.INTERCOM]: [{ key: 'accessToken', label: 'Access token', type: 'password', span: 'full', placeholder: 'dG9rOxxxxxxxxxxxxxxxxxxxx' }],
  [IntegrationProviders.DATABASE_PG]: [{ key: 'connectionString', label: 'Connection string', type: 'password', span: 'full', placeholder: 'postgresql://user:password@host:5432/database' }],
  [IntegrationProviders.DATABASE_MYSQL]: [{ key: 'connectionString', label: 'Connection string', type: 'password', span: 'full', placeholder: 'mysql://user:password@host:3306/database' }],
  [IntegrationProviders.DATABASE_MONGO]: [{ key: 'connectionString', label: 'Connection string', type: 'password', span: 'full', placeholder: 'mongodb://user:password@host:27017/database' }],
  [IntegrationProviders.OPENAPI]: [
    { key: 'specUrl', label: 'Spec URL', type: 'text', span: 'full', placeholder: 'https://api.example.com/openapi.json' },
    { key: 'apiKeyName', label: 'API key name', type: 'text', placeholder: 'X-Api-Key' },
    { key: 'apiKeyLocation', label: 'API key location', type: 'text', placeholder: 'header' },
    { key: 'apiKey', label: 'API key', type: 'password', span: 'full', placeholder: 'xxxxxxxxxxxxxxxxxxxx' },
    { key: 'token', label: 'Token', type: 'password', span: 'full', placeholder: 'xxxxxxxxxxxxxxxxxxxx' },
    { key: 'customHeaders', label: 'Custom headers JSON', type: 'text', span: 'full', placeholder: '{"X-Custom-Header": "value"}' },
  ],
  [IntegrationProviders.MCP]: [
    { key: 'serverUrl', label: 'Server URL', type: 'text', span: 'full', placeholder: 'https://mcp.example.com/v1' },
    { key: 'token', label: 'Bearer token', type: 'password', span: 'full', placeholder: 'xxxxxxxxxxxxxxxxxxxx' },
    { key: 'customHeaders', label: 'Custom headers JSON', type: 'text', span: 'full', placeholder: '{"X-Custom-Header": "value"}' },
    { key: 'accessToken', label: 'OAuth access token', type: 'password', span: 'full', placeholder: 'ya29.xxxxxxxxxxxxxxxxxxxx' },
    { key: 'refreshToken', label: 'OAuth refresh token', type: 'password', span: 'full', placeholder: '1//xxxxxxxxxxxxxxxxxxxx' },
    { key: 'clientId', label: 'OAuth client ID', type: 'text', placeholder: 'xxxxxxxxxxxx.apps.googleusercontent.com' },
    { key: 'clientSecret', label: 'OAuth client secret', type: 'password', placeholder: 'GOCSPX-xxxxxxxxxxxxxxxxxxxx' },
    { key: 'tokenEndpoint', label: 'OAuth token endpoint', type: 'text', span: 'full', placeholder: 'https://oauth2.example.com/token' },
    { key: 'allowedOrigins', label: 'Allowed OAuth origins (comma-separated)', type: 'text', span: 'full', placeholder: 'https://example.com, https://app.example.com' },
  ],
};
