import { IntegrationProviders, type IntegrationProvider } from '../common/interfaces/integration.interface';

export interface ProviderConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'number';
  span?: 'full';
  placeholder?: string;
}

export const PROVIDER_CONFIG_FIELDS: Record<IntegrationProvider, ProviderConfigField[]> = {
  [IntegrationProviders.DATABASE_PG]: [
    {
      key: 'connectionString',
      label: 'Connection string',
      type: 'password',
      span: 'full',
      placeholder: 'postgresql://user:password@host:5432/database',
    },
  ],
  [IntegrationProviders.DATABASE_MYSQL]: [
    {
      key: 'connectionString',
      label: 'Connection string',
      type: 'password',
      span: 'full',
      placeholder: 'mysql://user:password@host:3306/database',
    },
  ],
  [IntegrationProviders.DATABASE_MONGO]: [
    {
      key: 'connectionString',
      label: 'Connection string',
      type: 'password',
      span: 'full',
      placeholder: 'mongodb://user:password@host:27017/database',
    },
  ],
  [IntegrationProviders.OPENAPI]: [
    {
      key: 'specUrl',
      label: 'Spec URL',
      type: 'text',
      span: 'full',
      placeholder: 'https://api.example.com/openapi.json',
    },
    { key: 'apiKeyName', label: 'API key name', type: 'text', placeholder: 'X-Api-Key' },
    { key: 'apiKeyLocation', label: 'API key location', type: 'text', placeholder: 'header' },
    { key: 'apiKey', label: 'API key', type: 'password', span: 'full', placeholder: 'xxxxxxxxxxxxxxxxxxxx' },
    { key: 'token', label: 'Token', type: 'password', span: 'full', placeholder: 'xxxxxxxxxxxxxxxxxxxx' },
    {
      key: 'customHeaders',
      label: 'Custom headers JSON',
      type: 'text',
      span: 'full',
      placeholder: '{"X-Custom-Header": "value"}',
    },
  ],
  [IntegrationProviders.MCP]: [
    {
      key: 'serverUrl',
      label: 'Server URL',
      type: 'text',
      span: 'full',
      placeholder: 'https://mcp.example.com/v1',
    },
    { key: 'token', label: 'Bearer token', type: 'password', span: 'full', placeholder: 'xxxxxxxxxxxxxxxxxxxx' },
    {
      key: 'customHeaders',
      label: 'Custom headers JSON',
      type: 'text',
      span: 'full',
      placeholder: '{"X-Custom-Header": "value"}',
    },
    {
      key: 'accessToken',
      label: 'OAuth access token',
      type: 'password',
      span: 'full',
      placeholder: 'ya29.xxxxxxxxxxxxxxxxxxxx',
    },
    {
      key: 'refreshToken',
      label: 'OAuth refresh token',
      type: 'password',
      span: 'full',
      placeholder: '1//xxxxxxxxxxxxxxxxxxxx',
    },
    { key: 'clientId', label: 'OAuth client ID', type: 'text', placeholder: 'xxxxxxxxxxxx.apps.googleusercontent.com' },
    {
      key: 'clientSecret',
      label: 'OAuth client secret',
      type: 'password',
      placeholder: 'GOCSPX-xxxxxxxxxxxxxxxxxxxx',
    },
    {
      key: 'tokenEndpoint',
      label: 'OAuth token endpoint',
      type: 'text',
      span: 'full',
      placeholder: 'https://oauth2.example.com/token',
    },
    {
      key: 'allowedOrigins',
      label: 'Allowed OAuth origins (comma-separated)',
      type: 'text',
      span: 'full',
      placeholder: 'https://example.com, https://app.example.com',
    },
  ],
};
