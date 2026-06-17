export const GITHUB_PERMISSIONS = {
  READ: 'integrations:github:read_repos',
  WRITE: 'integrations:github:connect',
} as const;

export const GITHUB_DEFAULTS = {
  PER_PAGE: 100,
  MERGE_METHOD: 'merge' as const,
} as const;

export const GITHUB_REQUIRED_CONFIG_KEYS = ['accessToken'] as const;
