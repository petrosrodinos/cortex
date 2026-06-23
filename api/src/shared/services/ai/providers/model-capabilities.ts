import { AiProviderType, AiResearchMode } from 'generated/prisma';

export type ModelCapabilities = {
  search: boolean;
  deepResearch: boolean;
};

const MODEL_CAPABILITIES: Record<AiProviderType, Record<string, ModelCapabilities>> = {
  [AiProviderType.OPENAI]: {
    'gpt-5.5': { search: true, deepResearch: true },
    'gpt-5.5-pro': { search: true, deepResearch: true },
    'gpt-5.4': { search: true, deepResearch: true },
    'gpt-5.4-pro': { search: true, deepResearch: true },
    'gpt-5.4-mini': { search: true, deepResearch: false },
    'gpt-5.4-nano': { search: true, deepResearch: false },
    'gpt-5': { search: true, deepResearch: true },
    'gpt-5-mini': { search: true, deepResearch: false },
    'gpt-5-nano': { search: true, deepResearch: false },
    'gpt-4.1': { search: true, deepResearch: false },
    'gpt-4.1-mini': { search: true, deepResearch: false },
    'gpt-4.1-nano': { search: true, deepResearch: false },
    'gpt-4o': { search: false, deepResearch: false },
    'gpt-4o-mini': { search: false, deepResearch: false },
    'gpt-4-turbo': { search: false, deepResearch: false },
    'gpt-4': { search: false, deepResearch: false },
    'gpt-3.5-turbo': { search: false, deepResearch: false },
  },
  [AiProviderType.CLAUDE]: {
    'claude-opus-4-8': { search: true, deepResearch: true },
    'claude-sonnet-4-6': { search: true, deepResearch: true },
    'claude-opus-4-6': { search: true, deepResearch: true },
    'claude-sonnet-4-5-20250929': { search: true, deepResearch: false },
    'claude-opus-4-1-20250805': { search: true, deepResearch: false },
    'claude-sonnet-4-20250514': { search: true, deepResearch: false },
    'claude-opus-4-20250514': { search: true, deepResearch: false },
    'claude-haiku-4-5-20251001': { search: true, deepResearch: false },
    'claude-3-5-haiku-latest': { search: true, deepResearch: false },
    'claude-3-5-sonnet-latest': { search: false, deepResearch: false },
    'claude-3-opus-latest': { search: false, deepResearch: false },
  },
  [AiProviderType.GROK]: {
    'grok-4.3': { search: true, deepResearch: true },
    'grok-4.20-reasoning': { search: true, deepResearch: true },
    'grok-4.20-multi-agent': { search: true, deepResearch: true },
    'grok-4.20-non-reasoning': { search: true, deepResearch: false },
    'grok-beta': { search: false, deepResearch: false },
    'grok-pro': { search: false, deepResearch: false },
  },
};

const EMPTY_CAPABILITIES: ModelCapabilities = {
  search: false,
  deepResearch: false,
};

export function getModelCapabilities(
  provider?: AiProviderType | null,
  modelId?: string | null,
): ModelCapabilities {
  if (!provider || !modelId) {
    return EMPTY_CAPABILITIES;
  }

  return MODEL_CAPABILITIES[provider]?.[modelId] ?? EMPTY_CAPABILITIES;
}

export function supportsResearchMode(
  provider: AiProviderType | null | undefined,
  modelId: string | null | undefined,
  mode: AiResearchMode,
): boolean {
  if (mode === AiResearchMode.DEFAULT) {
    return true;
  }

  const capabilities = getModelCapabilities(provider, modelId);
  if (mode === AiResearchMode.SEARCH) {
    return capabilities.search;
  }

  return capabilities.deepResearch;
}

export function normalizeResearchModeForModel(
  provider: AiProviderType | null | undefined,
  modelId: string | null | undefined,
  mode: AiResearchMode | null | undefined,
): AiResearchMode {
  if (!mode || mode === AiResearchMode.DEFAULT) {
    return AiResearchMode.DEFAULT;
  }

  return supportsResearchMode(provider, modelId, mode)
    ? mode
    : AiResearchMode.DEFAULT;
}
