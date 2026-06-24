export const ComposioConnectionTier = {
  ORG_SHARED: 'ORG_SHARED',
  USER_PERSONAL: 'USER_PERSONAL',
} as const;

export type ComposioConnectionTier =
  (typeof ComposioConnectionTier)[keyof typeof ComposioConnectionTier];

export const COMPOSIO_CONNECTION_TIERS = Object.values(ComposioConnectionTier);
