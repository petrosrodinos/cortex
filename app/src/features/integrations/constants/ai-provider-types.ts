export const AiProviderTypes = {
  OPENAI: 'OPENAI',
  CLAUDE: 'CLAUDE',
  GROK: 'GROK',
} as const;

export type AiProviderType = (typeof AiProviderTypes)[keyof typeof AiProviderTypes];

export const AI_PROVIDER_TYPES = Object.values(AiProviderTypes);
