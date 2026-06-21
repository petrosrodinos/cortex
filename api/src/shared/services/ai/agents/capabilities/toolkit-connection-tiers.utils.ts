import { ComposioConnectionTier } from 'generated/prisma';

export type ToolkitConnectionTierMap = Partial<
  Record<string, ComposioConnectionTier>
>;

export interface ToolkitConnectionTierChoice {
  slug: string;
  name: string;
  availableTiers: ComposioConnectionTier[];
}

export function inferConnectionTierFromAccount(account: {
  user_uuid: string | null;
}): ComposioConnectionTier {
  return account.user_uuid
    ? ComposioConnectionTier.USER_PERSONAL
    : ComposioConnectionTier.ORG_SHARED;
}

export function normalizeToolkitConnectionTierMap(
  raw?: Record<string, string> | null,
): ToolkitConnectionTierMap {
  if (!raw) {
    return {};
  }

  const result: ToolkitConnectionTierMap = {};

  for (const [slug, tier] of Object.entries(raw)) {
    const normalized = tier.trim().toUpperCase();

    if (
      normalized === ComposioConnectionTier.ORG_SHARED ||
      normalized === ComposioConnectionTier.USER_PERSONAL
    ) {
      result[slug] = normalized as ComposioConnectionTier;
    }
  }

  return result;
}

export function resolveToolkitConnectionTiers(
  toolkitSlugs: string[],
  connectedTiersBySlug: Map<string, Set<ComposioConnectionTier>>,
  toolkitNamesBySlug: Map<string, string>,
  providedTiers: ToolkitConnectionTierMap,
): {
  resolvedTierMap: Record<string, ComposioConnectionTier>;
  ambiguousChoices: ToolkitConnectionTierChoice[];
} {
  const resolvedTierMap: Record<string, ComposioConnectionTier> = {};
  const ambiguousChoices: ToolkitConnectionTierChoice[] = [];

  for (const slug of toolkitSlugs) {
    const connectedTiers = connectedTiersBySlug.get(slug);

    if (!connectedTiers || connectedTiers.size === 0) {
      continue;
    }

    const providedTier = providedTiers[slug];

    if (providedTier) {
      if (connectedTiers.has(providedTier)) {
        resolvedTierMap[slug] = providedTier;
      }
      continue;
    }

    const tiers = [...connectedTiers];

    if (tiers.length === 1) {
      resolvedTierMap[slug] = tiers[0];
      continue;
    }

    ambiguousChoices.push({
      slug,
      name: toolkitNamesBySlug.get(slug) ?? slug,
      availableTiers: tiers,
    });
  }

  return { resolvedTierMap, ambiguousChoices };
}
