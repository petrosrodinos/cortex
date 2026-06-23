import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { AiProviderType, AiResearchMode } from 'generated/prisma';
import type { ToolSet } from 'ai';
import { getModelCapabilities } from './model-capabilities';

const XAI_BASE_URL = 'https://api.x.ai/v1';

export function buildProviderResearchTools(
  provider: AiProviderType,
  apiKey: string,
  researchMode: AiResearchMode,
  modelId: string,
): ToolSet {
  if (researchMode === AiResearchMode.DEFAULT) {
    return {};
  }

  const capabilities = getModelCapabilities(provider, modelId);
  if (researchMode === AiResearchMode.SEARCH && !capabilities.search) {
    return {};
  }
  if (researchMode === AiResearchMode.DEEP_RESEARCH && !capabilities.deepResearch) {
    return {};
  }

  const isDeep = researchMode === AiResearchMode.DEEP_RESEARCH;

  switch (provider) {
    case AiProviderType.OPENAI: {
      const openai = createOpenAI({ apiKey });
      return {
        web_search: openai.tools.webSearch({
          searchContextSize: isDeep ? 'high' : 'medium',
        }),
      };
    }
    case AiProviderType.CLAUDE: {
      const anthropic = createAnthropic({ apiKey });
      return {
        web_search: anthropic.tools.webSearch_20250305({
          maxUses: isDeep ? 10 : 4,
        }),
      };
    }
    case AiProviderType.GROK: {
      const xai = createOpenAI({ apiKey, baseURL: XAI_BASE_URL });
      return {
        web_search: xai.tools.webSearch({
          searchContextSize: isDeep ? 'high' : 'medium',
        }),
      };
    }
    default:
      return {};
  }
}

export function getResearchModeInstructions(researchMode: AiResearchMode): string | null {
  if (researchMode === AiResearchMode.SEARCH) {
    return 'Web search is enabled. Use the web_search tool when the user needs current events, live data, or facts beyond your training knowledge. Cite sources when possible.';
  }

  if (researchMode === AiResearchMode.DEEP_RESEARCH) {
    return 'Deep research is enabled. Use web_search thoroughly: run multiple targeted searches, cross-check important claims, and synthesize a detailed answer with citations.';
  }

  return null;
}
