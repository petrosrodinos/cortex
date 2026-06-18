import { IntegrationProviders, type IntegrationProvider } from '@/features/integrations/common/interfaces/integration.interface';
import { AiProviderTypes } from '@/features/integrations/constants/ai-provider-types';
import type { CatalogProvider } from '@/features/integrations/constants/catalog-provider';

export interface ProviderGroup {
  label: string;
  providers: IntegrationProvider[];
}

export interface CatalogTab {
  id: string;
  label: string;
  providers: CatalogProvider[];
}

export const saasProviderGroups: ProviderGroup[] = [
  {
    label: 'Development',
    providers: [IntegrationProviders.GITHUB, IntegrationProviders.LINEAR],
  },
  {
    label: 'Communication',
    providers: [IntegrationProviders.SLACK],
  },
  {
    label: 'Email',
    providers: [
      IntegrationProviders.GMAIL,
      IntegrationProviders.SMTP,
      IntegrationProviders.RESEND,
      IntegrationProviders.SENDGRID,
    ],
  },
  {
    label: 'Productivity',
    providers: [IntegrationProviders.NOTION, IntegrationProviders.GOOGLE_DRIVE],
  },
  {
    label: 'Sales & CRM',
    providers: [IntegrationProviders.HUBSPOT, IntegrationProviders.STRIPE],
  },
  {
    label: 'Analytics & Support',
    providers: [IntegrationProviders.POSTHOG, IntegrationProviders.INTERCOM],
  },
];

function toTabId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const INTEGRATION_CATALOG_TABS: CatalogTab[] = [
  {
    id: 'ai',
    label: 'AI',
    providers: [AiProviderTypes.OPENAI, AiProviderTypes.CLAUDE, AiProviderTypes.GROK],
  },
  ...saasProviderGroups.map((group) => ({
    id: toTabId(group.label),
    label: group.label,
    providers: group.providers,
  })),
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
