import { IntegrationProviders, type IntegrationProvider } from '@/features/integrations/common/interfaces/integration.interface';
import { isAiCatalogProvider, type CatalogProvider } from '@/features/integrations/constants/catalog-provider';

export { isAiCatalogProvider };
export type { CatalogProvider };

export const databaseProviders = [
  IntegrationProviders.DATABASE_PG,
  IntegrationProviders.DATABASE_MYSQL,
  IntegrationProviders.DATABASE_MONGO,
] as const;

export function isDatabaseProvider(provider: IntegrationProvider): provider is (typeof databaseProviders)[number] {
  return databaseProviders.includes(provider as (typeof databaseProviders)[number]);
}

export function isOpenApiProvider(provider: IntegrationProvider) {
  return provider === IntegrationProviders.OPENAPI;
}

export function isMcpProvider(provider: IntegrationProvider) {
  return provider === IntegrationProviders.MCP;
}
