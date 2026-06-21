import type { IntegrationAppsToolkit } from '@/features/integration-apps/interfaces/integrationApps.interface';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import {
  getIntegrationDisplayLabel,
  getIntegrationSlashSlug,
  getToolEligibleIntegrations,
} from './integration-tools-list';

export type ConversationToolItem =
  | { kind: 'integration'; integration: Integration }
  | { kind: 'toolkit'; toolkit: IntegrationAppsToolkit };

export function getToolEligibleToolkits(toolkits: IntegrationAppsToolkit[]): IntegrationAppsToolkit[] {
  return toolkits.filter((toolkit) => toolkit.is_org_enabled && toolkit.tool_count > 0);
}

export function getConversationToolItemId(item: ConversationToolItem): string {
  return item.kind === 'integration'
    ? `integration:${item.integration.uuid}`
    : `toolkit:${item.toolkit.slug}`;
}

export function getConversationToolItemLabel(item: ConversationToolItem): string {
  return item.kind === 'integration'
    ? getIntegrationDisplayLabel(item.integration)
    : item.toolkit.name;
}

export function buildConversationToolItems(
  integrations: Integration[],
  toolkits: IntegrationAppsToolkit[],
): ConversationToolItem[] {
  return sortConversationToolItems([
    ...getToolEligibleIntegrations(integrations).map((integration) => ({
      kind: 'integration' as const,
      integration,
    })),
    ...getToolEligibleToolkits(toolkits).map((toolkit) => ({
      kind: 'toolkit' as const,
      toolkit,
    })),
  ]);
}

export function filterConversationToolItems(
  items: ConversationToolItem[],
  query: string,
): ConversationToolItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => {
    const label = getConversationToolItemLabel(item).toLowerCase();
    const name =
      item.kind === 'integration' ? item.integration.name.toLowerCase() : item.toolkit.slug.toLowerCase();
    const slug =
      item.kind === 'integration'
        ? getIntegrationSlashSlug(item.integration)
        : item.toolkit.slug.toLowerCase();

    return (
      label.includes(normalizedQuery) ||
      name.includes(normalizedQuery) ||
      slug.includes(normalizedQuery)
    );
  });
}

export function sortConversationToolItems(items: ConversationToolItem[]): ConversationToolItem[] {
  return [...items].sort((a, b) =>
    getConversationToolItemLabel(a).localeCompare(getConversationToolItemLabel(b)),
  );
}

export function isConversationToolItemSelected(
  item: ConversationToolItem,
  selectedIntegrationUuids: string[],
  selectedToolkitSlugs: string[],
): boolean {
  return item.kind === 'integration'
    ? selectedIntegrationUuids.includes(item.integration.uuid)
    : selectedToolkitSlugs.includes(item.toolkit.slug);
}
