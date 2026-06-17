export const SLACK_DEFAULTS = {
  LIMIT: 100,
  CHANNEL_TYPES: 'public_channel',
} as const;

export const SLACK_REQUIRED_CONFIG_KEYS = ['botToken'] as const;
