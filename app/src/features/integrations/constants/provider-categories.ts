import { IntegrationProviders } from '@/features/integrations/common/interfaces/integration.interface';
import { AiProviderTypes } from '@/features/integrations/constants/ai-provider-types';
import type { CatalogProvider } from '@/features/integrations/constants/catalog-provider';

export interface CatalogTab {
  id: string;
  label: string;
  providers: CatalogProvider[];
}

export const INTEGRATION_CATALOG_TABS: CatalogTab[] = [
  {
    id: 'ai',
    label: 'AI',
    providers: [AiProviderTypes.OPENAI, AiProviderTypes.CLAUDE, AiProviderTypes.GROK],
  },
  {
    id: 'databases',
    label: 'Databases',
    providers: [
      IntegrationProviders.DATABASE_PG,
      IntegrationProviders.DATABASE_MYSQL,
      IntegrationProviders.DATABASE_MONGO,
    ],
  },
  {
    id: 'custom',
    label: 'Custom',
    providers: [IntegrationProviders.OPENAPI, IntegrationProviders.MCP],
  },
];
