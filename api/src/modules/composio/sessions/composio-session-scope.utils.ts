import { ComposioConnectionTier } from 'generated/prisma';
import type { ToolkitConnectionTierMap } from '@/shared/services/ai/agents/capabilities/toolkit-connection-tiers.utils';
import { inferConnectionTierFromAccount } from '@/shared/services/ai/agents/capabilities/toolkit-connection-tiers.utils';

export function mergeConnectionTierMaps(
  autoResolved: ToolkitConnectionTierMap,
  provided: ToolkitConnectionTierMap,
): Record<string, ComposioConnectionTier> {
  return {
    ...autoResolved,
    ...provided,
  };
}

export function resolveComposioUserIdFromTierMap(
  organizationUuid: string,
  userUuid: string,
  toolkitSlugs: string[],
  tierMap: Record<string, ComposioConnectionTier>,
  orgSharedOnlyToolkits: boolean,
): string {
  if (toolkitSlugs.length === 0) {
    return `user:${userUuid}`;
  }

  const scopedTiers = toolkitSlugs
    .map((slug) => tierMap[slug])
    .filter(Boolean) as ComposioConnectionTier[];

  if (scopedTiers.length > 0) {
    const hasOrgTier = scopedTiers.some(
      (tier) => tier === ComposioConnectionTier.ORG_SHARED,
    );
    const hasUserTier = scopedTiers.some(
      (tier) => tier === ComposioConnectionTier.USER_PERSONAL,
    );

    if (hasOrgTier && !hasUserTier) {
      return `org:${organizationUuid}`;
    }

    return `user:${userUuid}`;
  }

  if (orgSharedOnlyToolkits) {
    return `org:${organizationUuid}`;
  }

  return `user:${userUuid}`;
}

export function filterToolkitsForComposioUserId(
  toolkitSlugs: string[],
  tierMap: Record<string, ComposioConnectionTier>,
  composioUserId: string,
): string[] {
  const isOrgSession = composioUserId.startsWith('org:');

  return toolkitSlugs.filter((slug) => {
    const tier = tierMap[slug];
    if (!tier) {
      return true;
    }

    if (tier === ComposioConnectionTier.ORG_SHARED) {
      return isOrgSession;
    }

    if (tier === ComposioConnectionTier.USER_PERSONAL) {
      return !isOrgSession;
    }

    return true;
  });
}

export function isAccountTierCompatibleWithComposioUserId(
  account: { user_uuid: string | null; composio_user_id: string },
  composioUserId: string,
): boolean {
  return account.composio_user_id === composioUserId;
}

export function isToolkitConnectedForTier(
  accounts: Array<{ user_uuid: string | null }>,
  tier?: ComposioConnectionTier,
): boolean {
  if (accounts.length === 0) {
    return false;
  }

  if (!tier) {
    return accounts.length > 0;
  }

  return accounts.some(
    (account) => inferConnectionTierFromAccount(account) === tier,
  );
}

export function allTieredToolkitsHaveConnectedAccounts(
  toolkitSlugs: string[],
  connectedAccounts: Record<string, string>,
): boolean {
  if (toolkitSlugs.length === 0) {
    return true;
  }

  return toolkitSlugs.every((slug) => Boolean(connectedAccounts[slug]));
}
