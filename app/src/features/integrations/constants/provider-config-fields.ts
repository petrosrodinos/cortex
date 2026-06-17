import { IntegrationProviders, type IntegrationProvider } from '../interfaces/integration.interface';

export interface ProviderConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'number';
}

export const PROVIDER_CONFIG_FIELDS: Record<IntegrationProvider, ProviderConfigField[]> = {
  [IntegrationProviders.GITHUB]: [{ key: 'accessToken', label: 'Access token', type: 'password' }],
  [IntegrationProviders.SLACK]: [{ key: 'botToken', label: 'Bot token', type: 'password' }],
  [IntegrationProviders.STRIPE]: [{ key: 'secretKey', label: 'Secret key', type: 'password' }],
  [IntegrationProviders.HUBSPOT]: [{ key: 'accessToken', label: 'Access token', type: 'password' }],
  [IntegrationProviders.LINEAR]: [{ key: 'apiKey', label: 'API key', type: 'password' }],
  [IntegrationProviders.NOTION]: [{ key: 'apiKey', label: 'API key', type: 'password' }],
  [IntegrationProviders.GOOGLE_DRIVE]: [
    { key: 'accessToken', label: 'Access token', type: 'password' },
    { key: 'refreshToken', label: 'Refresh token', type: 'password' },
    { key: 'clientId', label: 'Client ID', type: 'text' },
    { key: 'clientSecret', label: 'Client secret', type: 'password' },
  ],
  [IntegrationProviders.SMTP]: [
    { key: 'host', label: 'Host', type: 'text' },
    { key: 'port', label: 'Port', type: 'number' },
    { key: 'user', label: 'Username', type: 'text' },
    { key: 'password', label: 'Password', type: 'password' },
    { key: 'from', label: 'From email', type: 'text' },
  ],
  [IntegrationProviders.GMAIL]: [
    { key: 'accessToken', label: 'Access token', type: 'password' },
    { key: 'refreshToken', label: 'Refresh token', type: 'password' },
    { key: 'clientId', label: 'Client ID', type: 'text' },
    { key: 'clientSecret', label: 'Client secret', type: 'password' },
  ],
  [IntegrationProviders.POSTHOG]: [
    { key: 'apiKey', label: 'API key', type: 'password' },
    { key: 'host', label: 'Host', type: 'text' },
    { key: 'projectId', label: 'Project ID', type: 'text' },
  ],
  [IntegrationProviders.INTERCOM]: [{ key: 'accessToken', label: 'Access token', type: 'password' }],
  [IntegrationProviders.DATABASE_PG]: [{ key: 'connectionString', label: 'Connection string', type: 'password' }],
  [IntegrationProviders.DATABASE_MYSQL]: [{ key: 'connectionString', label: 'Connection string', type: 'password' }],
  [IntegrationProviders.DATABASE_MONGO]: [{ key: 'connectionString', label: 'Connection string', type: 'password' }],
  [IntegrationProviders.OPENAPI]: [
    { key: 'specUrl', label: 'Spec URL', type: 'text' },
    { key: 'apiKeyName', label: 'API key name', type: 'text' },
    { key: 'apiKeyLocation', label: 'API key location', type: 'text' },
    { key: 'apiKey', label: 'API key', type: 'password' },
    { key: 'token', label: 'Token', type: 'password' },
    { key: 'customHeaders', label: 'Custom headers JSON', type: 'text' },
  ],
  [IntegrationProviders.MCP]: [
    { key: 'serverUrl', label: 'Server URL', type: 'text' },
    { key: 'token', label: 'Bearer token', type: 'password' },
    { key: 'customHeaders', label: 'Custom headers JSON', type: 'text' },
    { key: 'accessToken', label: 'OAuth access token', type: 'password' },
    { key: 'refreshToken', label: 'OAuth refresh token', type: 'password' },
    { key: 'clientId', label: 'OAuth client ID', type: 'text' },
    { key: 'clientSecret', label: 'OAuth client secret', type: 'password' },
    { key: 'tokenEndpoint', label: 'OAuth token endpoint', type: 'text' },
    { key: 'allowedOrigins', label: 'Allowed OAuth origins (comma-separated)', type: 'text' },
  ],
};
