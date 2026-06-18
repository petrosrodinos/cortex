import type { IntegrationProvider } from '@/features/integrations/common/interfaces/integration.interface';
import { AiProviderTypes, type AiProviderType } from '@/features/integrations/constants/ai-provider-types';

export type CatalogProvider = IntegrationProvider | AiProviderType;

export function isAiCatalogProvider(provider: CatalogProvider): provider is AiProviderType {
  return Object.values(AiProviderTypes).includes(provider as AiProviderType);
}
