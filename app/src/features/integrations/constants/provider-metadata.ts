import type { ComponentType } from 'react';
import { Bot, Cpu, FileCode2, Zap } from 'lucide-react';
import { SiMongodb, SiMysql, SiOpenai, SiPostgresql } from 'react-icons/si';
import type { IntegrationProvider } from '@/features/integrations/common/interfaces/integration.interface';
import { AiProviderTypes } from '@/features/integrations/constants/ai-provider-types';
import type { CatalogProvider } from '@/features/integrations/constants/catalog-provider';
import type { DatabaseOperation } from '@/features/integrations/database/interfaces/database.interface';
import { DatabaseOperations } from '@/features/integrations/database/interfaces/database.interface';
import type { McpAuthType } from '@/features/integrations/mcp/interfaces/mcp.interface';
import { McpAuthTypes } from '@/features/integrations/mcp/interfaces/mcp.interface';
import type { OpenApiAuthType } from '@/features/integrations/openapi/interfaces/openapi.interface';
import { OpenApiAuthTypes } from '@/features/integrations/openapi/interfaces/openapi.interface';

export type ProviderIcon = ComponentType<{ size?: number; className?: string }>;

export type ProviderVisualMeta = {
  bg: string;
  icon: ProviderIcon;
};

function createProviderMeta(bg: string, icon: ProviderIcon): ProviderVisualMeta {
  return { bg, icon };
}

const integrationProviderLabels: Record<IntegrationProvider, string> = {
  DATABASE_PG: 'PostgreSQL',
  DATABASE_MYSQL: 'MySQL',
  DATABASE_MONGO: 'MongoDB',
  OPENAPI: 'OpenAPI',
  MCP: 'MCP',
};

export const providerLabels = integrationProviderLabels;

export const catalogProviderLabels: Record<CatalogProvider, string> = {
  ...integrationProviderLabels,
  [AiProviderTypes.OPENAI]: 'OpenAI',
  [AiProviderTypes.CLAUDE]: 'Claude',
  [AiProviderTypes.GROK]: 'Grok',
};

const integrationProviderDescriptions: Record<IntegrationProvider, string> = {
  DATABASE_PG: 'Query a PostgreSQL database',
  DATABASE_MYSQL: 'Query a MySQL database',
  DATABASE_MONGO: 'Query a MongoDB collection',
  OPENAPI: 'Connect any API via an OpenAPI spec',
  MCP: 'Any tool server via Model Context Protocol',
};

export const providerDescriptions = integrationProviderDescriptions;

export const catalogProviderDescriptions: Record<CatalogProvider, string> = {
  ...integrationProviderDescriptions,
  [AiProviderTypes.OPENAI]: 'GPT models for chat, reasoning, and tool use',
  [AiProviderTypes.CLAUDE]: 'Anthropic models for chat and agent workflows',
  [AiProviderTypes.GROK]: 'xAI models for fast chat and reasoning',
};

const integrationProviderIconMeta: Record<IntegrationProvider, ProviderVisualMeta> = {
  DATABASE_PG: createProviderMeta('#336791', SiPostgresql),
  DATABASE_MYSQL: createProviderMeta('#00758f', SiMysql),
  DATABASE_MONGO: createProviderMeta('#13aa52', SiMongodb),
  OPENAPI: createProviderMeta('#0d9488', FileCode2),
  MCP: createProviderMeta('#7c3aed', Cpu),
};

export const PROVIDER_ICON_META = integrationProviderIconMeta;

export function getProviderBrandColor(provider: IntegrationProvider): string {
  return PROVIDER_ICON_META[provider].bg;
}

export const CATALOG_PROVIDER_ICON_META: Record<CatalogProvider, ProviderVisualMeta> = {
  ...integrationProviderIconMeta,
  [AiProviderTypes.OPENAI]: createProviderMeta('#10a37f', SiOpenai),
  [AiProviderTypes.CLAUDE]: createProviderMeta('#d97706', Bot),
  [AiProviderTypes.GROK]: createProviderMeta('#111827', Zap),
};

export const aiProviderModelOptions: Record<
  (typeof AiProviderTypes)[keyof typeof AiProviderTypes],
  { value: string; label: string; search?: boolean; deepResearch?: boolean }[]
> = {
  [AiProviderTypes.OPENAI]: [
    { value: 'gpt-4o', label: 'GPT-4o', search: true, deepResearch: true },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini', search: true },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', search: true, deepResearch: true },
    { value: 'gpt-4', label: 'GPT-4', search: true },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  [AiProviderTypes.CLAUDE]: [
    { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4', search: true, deepResearch: true },
    { value: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet', search: true, deepResearch: true },
    { value: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku', search: true },
    { value: 'claude-3-opus-latest', label: 'Claude 3 Opus', search: true, deepResearch: true },
  ],
  [AiProviderTypes.GROK]: [
    { value: 'grok-beta', label: 'Grok Beta', search: true },
    { value: 'grok-pro', label: 'Grok Pro', search: true, deepResearch: true },
  ],
};

export const AiResearchModes = {
  DEFAULT: 'DEFAULT',
  SEARCH: 'SEARCH',
  DEEP_RESEARCH: 'DEEP_RESEARCH',
} as const;

export type AiResearchMode = (typeof AiResearchModes)[keyof typeof AiResearchModes];

export type ModelCapabilities = {
  search: boolean;
  deepResearch: boolean;
};

export function getModelCapabilities(
  provider?: string | null,
  model?: string | null,
): ModelCapabilities {
  if (!provider || !model) {
    return { search: false, deepResearch: false };
  }

  const options = aiProviderModelOptions[provider as keyof typeof aiProviderModelOptions];
  const matched = options?.find((option) => option.value === model);

  return {
    search: matched?.search ?? false,
    deepResearch: matched?.deepResearch ?? false,
  };
}

export function supportsResearchMode(
  provider: string | null | undefined,
  model: string | null | undefined,
  mode: AiResearchMode,
): boolean {
  if (mode === AiResearchModes.DEFAULT) {
    return true;
  }

  const capabilities = getModelCapabilities(provider, model);
  if (mode === AiResearchModes.SEARCH) {
    return capabilities.search;
  }

  return capabilities.deepResearch;
}

export const aiProviderDefaultModels: Record<(typeof AiProviderTypes)[keyof typeof AiProviderTypes], string> = {
  [AiProviderTypes.OPENAI]: aiProviderModelOptions[AiProviderTypes.OPENAI][0].value,
  [AiProviderTypes.CLAUDE]: aiProviderModelOptions[AiProviderTypes.CLAUDE][0].value,
  [AiProviderTypes.GROK]: aiProviderModelOptions[AiProviderTypes.GROK][0].value,
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
      { text: 'For Atlas: go to Database > Connect > Drivers and copy the connection string.' },
      { text: "Replace <password> with your database user's password and append the database name." },
    ],
  },
};

export { DatabaseOperations, McpAuthTypes, OpenApiAuthTypes };
