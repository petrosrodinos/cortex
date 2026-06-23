import { AiProviderType, AiResearchMode } from 'generated/prisma';

export type ModelCapabilities = {
  search: boolean;
  deepResearch: boolean;
};

const MODEL_CAPABILITIES: Record<AiProviderType, Record<string, ModelCapabilities>> = {
  [AiProviderType.OPENAI]: {
    'gpt-4o': { search: true, deepResearch: true },
    'gpt-4o-mini': { search: true, deepResearch: false },
    'gpt-4-turbo': { search: true, deepResearch: true },
    'gpt-4': { search: true, deepResearch: false },
    'gpt-3.5-turbo': { search: false, deepResearch: false },
  },
  [AiProviderType.CLAUDE]: {
    'claude-sonnet-4-20250514': { search: true, deepResearch: true },
    'claude-3-5-sonnet-latest': { search: true, deepResearch: true },
    'claude-3-5-haiku-latest': { search: true, deepResearch: false },
    'claude-3-opus-latest': { search: true, deepResearch: true },
  },
  [AiProviderType.GROK]: {
    'grok-beta': { search: true, deepResearch: false },
    'grok-pro': { search: true, deepResearch: true },
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
