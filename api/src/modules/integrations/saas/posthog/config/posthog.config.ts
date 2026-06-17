export const POSTHOG_DEFAULTS = {
  HOST: 'https://app.posthog.com',
  LIMIT: 100,
} as const;

export const POSTHOG_REQUIRED_CONFIG_KEYS = ['apiKey', 'projectId'] as const;
