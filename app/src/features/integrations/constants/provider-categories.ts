import { IntegrationProviders } from '@/features/integrations/common/interfaces/integration.interface';
import { AiProviderTypes } from '@/features/integrations/constants/ai-provider-types';
import type { CatalogProvider } from '@/features/integrations/constants/catalog-provider';

export const DATABASE_CATALOG_PROVIDERS: CatalogProvider[] = [
  IntegrationProviders.DATABASE_PG,
  IntegrationProviders.DATABASE_MYSQL,
  IntegrationProviders.DATABASE_MONGO,
];

export const EXTERNAL_CONNECTION_CATALOG_PROVIDERS: CatalogProvider[] = [
  IntegrationProviders.OPENAPI,
  IntegrationProviders.MCP,
];

export const AI_CATALOG_PROVIDERS: CatalogProvider[] = [
  AiProviderTypes.OPENAI,
  AiProviderTypes.CLAUDE,
  AiProviderTypes.GROK,
];

export const CATALOG_PROVIDERS_BY_SECTION = {
  databases: DATABASE_CATALOG_PROVIDERS,
  externalConnections: EXTERNAL_CONNECTION_CATALOG_PROVIDERS,
  ai: AI_CATALOG_PROVIDERS,
} as const;

export type ProviderCatalogSection = keyof typeof CATALOG_PROVIDERS_BY_SECTION;
