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
  [IntegrationProviders.OPENAPI]: [{ key: 'apiKey', label: 'API key', type: 'password' }],
};
