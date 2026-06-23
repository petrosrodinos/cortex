import type {
  IntegrationAppsConnectionTier,
  IntegrationAppsToolkit,
} from '@/features/integration-apps/interfaces/integrationApps.interface';
import type { ConversationAgentToolkit } from '@/features/conversations/interfaces/conversation.interfaces';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import {
  getConnectionTierFromAccount,
  getConnectionTierLabel,
} from '@/pages/integrations/components/integration-apps/connection-tier-selector';
import {
  getIntegrationDisplayLabel,
  getIntegrationSlashSlug,
  getToolEligibleIntegrations,
} from './integration-tools-list';
import {
  getActiveToolkitConnectionTierScope,
  isToolkitBindingDisabledByTierScope,
  type ToolkitBinding,
} from '../../utils/conversation-toolkit-bindings.utils';

export type ConversationToolItem =
  | { kind: 'integration'; integration: Integration }
  | {
      kind: 'toolkit';
      toolkit: IntegrationAppsToolkit;
      connectionTier: IntegrationAppsConnectionTier;
    };

export function mapConversationAgentToolkitToIntegrationAppsToolkit(
  toolkit: ConversationAgentToolkit,
): IntegrationAppsToolkit {
  return {
    uuid: toolkit.uuid,
    slug: toolkit.slug,
    name: toolkit.name,
    description: toolkit.description,
    logo_url: toolkit.logo_url,
    categories: [],
    connection_tiers: toolkit.connection_tiers,
    is_connected: toolkit.is_connected,
    connected_accounts: toolkit.connected_accounts.map((account, index) => ({
      id: `${toolkit.slug}:${account.connection_tier}:${index}`,
      account_id: `${toolkit.slug}:${index}`,
      label: account.account_label,
      status: 'ACTIVE',
      connection_tier: account.connection_tier,
    })),
    is_org_enabled: true,
    tool_count: toolkit.tool_count,
  };
}

function getToolkitConnectedTiers(
  toolkit: IntegrationAppsToolkit,
): IntegrationAppsConnectionTier[] {
  const tiers = new Set<IntegrationAppsConnectionTier>();

  for (const account of toolkit.connected_accounts ?? []) {
    tiers.add(
      account.connection_tier ?? getConnectionTierFromAccount(account.user_uuid),
    );
  }

  return [...tiers];
}

function expandToolkitItems(toolkit: IntegrationAppsToolkit): ConversationToolItem[] {
  const connectedTiers = getToolkitConnectedTiers(toolkit);

  if (connectedTiers.length <= 1) {
    return [
      {
        kind: 'toolkit',
        toolkit,
        connectionTier: connectedTiers[0] ?? toolkit.connection_tiers[0] ?? 'ORG_SHARED',
      },
    ];
  }

  return connectedTiers.map((connectionTier) => ({
    kind: 'toolkit',
    toolkit,
    connectionTier,
  }));
}

export function getToolEligibleToolkits(toolkits: IntegrationAppsToolkit[]): IntegrationAppsToolkit[] {
  return toolkits.filter((toolkit) => toolkit.is_org_enabled && toolkit.tool_count > 0);
}

export function getAutoSelectableToolkitBindings(
  toolkits: IntegrationAppsToolkit[],
): ToolkitBinding[] {
  return getToolEligibleToolkits(toolkits).flatMap((toolkit) => {
    const connectedTiers = getToolkitConnectedTiers(toolkit);

    if (connectedTiers.length !== 1) {
      return [];
    }

    return [{ slug: toolkit.slug, connectionTier: connectedTiers[0] }];
  });
}

export function getConversationToolItemId(item: ConversationToolItem): string {
  return item.kind === 'integration'
    ? `integration:${item.integration.uuid}`
    : `toolkit:${item.toolkit.slug}:${item.connectionTier}`;
}

export function getConversationToolItemLabel(item: ConversationToolItem): string {
  if (item.kind === 'integration') {
    return getIntegrationDisplayLabel(item.integration);
  }

  const connectedTiers = getToolkitConnectedTiers(item.toolkit);

  if (connectedTiers.length <= 1) {
    return item.toolkit.name;
  }

  return `${item.toolkit.name} · ${getConnectionTierLabel(item.connectionTier)}`;
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
    ...getToolEligibleToolkits(toolkits).flatMap((toolkit) => expandToolkitItems(toolkit)),
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
  selectedToolkitBindings: ToolkitBinding[],
): boolean {
  if (item.kind === 'integration') {
    return selectedIntegrationUuids.includes(item.integration.uuid);
  }

  return selectedToolkitBindings.some(
    (binding) =>
      binding.slug === item.toolkit.slug && binding.connectionTier === item.connectionTier,
  );
}

export function getToolkitBindingFromItem(item: ConversationToolItem): ToolkitBinding | null {
  if (item.kind !== 'toolkit') {
    return null;
  }

  return {
    slug: item.toolkit.slug,
    connectionTier: item.connectionTier,
  };
}

export function isConversationToolItemTierDisabled(
  item: ConversationToolItem,
  selectedToolkitBindings: ToolkitBinding[],
): boolean {
  if (item.kind !== 'toolkit') {
    return false;
  }

  const activeScope = getActiveToolkitConnectionTierScope(selectedToolkitBindings);
  const isSelected = isConversationToolItemSelected(
    item,
    [],
    selectedToolkitBindings,
  );

  return isToolkitBindingDisabledByTierScope(
    item.connectionTier,
    activeScope,
    isSelected,
  );
}
