export const HUBSPOT_DEFAULTS = {
  LIMIT: 100,
} as const;

export const HUBSPOT_REQUIRED_CONFIG_KEYS = ['accessToken'] as const;

export const HUBSPOT_OBJECT_TYPES = {
  CONTACTS: 'contacts',
  COMPANIES: 'companies',
  DEALS: 'deals',
  TICKETS: 'tickets',
  NOTES: 'notes',
} as const;
