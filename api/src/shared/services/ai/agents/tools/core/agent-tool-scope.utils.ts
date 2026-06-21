import type { ComposioConnectionTier } from 'generated/prisma';

export interface AgentToolScope {
  integrationUuids?: string[];
  toolkitSlugs?: string[];
  toolkitConnectionTiers?: Record<string, ComposioConnectionTier>;
}
