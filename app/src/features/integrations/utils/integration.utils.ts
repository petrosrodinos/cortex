import { IntegrationProviders, type IntegrationProvider } from '@/features/integrations/common/interfaces/integration.interface';
import { isAiCatalogProvider, type CatalogProvider } from '@/features/integrations/constants/catalog-provider';
import { saasProviderGroups } from '@/features/integrations/constants/provider-categories';

export { isAiCatalogProvider };
export type { CatalogProvider };

export const saasProviders = saasProviderGroups.flatMap((group) => group.providers);

export const databaseProviders = [
  IntegrationProviders.DATABASE_PG,
  IntegrationProviders.DATABASE_MYSQL,
  IntegrationProviders.DATABASE_MONGO,
] as const;

export function isDatabaseProvider(provider: IntegrationProvider): provider is (typeof databaseProviders)[number] {
  return databaseProviders.includes(provider as (typeof databaseProviders)[number]);
}

export function isSaasProvider(provider: IntegrationProvider): provider is (typeof saasProviders)[number] {
  return saasProviders.includes(provider as (typeof saasProviders)[number]);
}

export function isOpenApiProvider(provider: IntegrationProvider) {
  return provider === IntegrationProviders.OPENAPI;
}

export function isMcpProvider(provider: IntegrationProvider) {
  return provider === IntegrationProviders.MCP;
}
