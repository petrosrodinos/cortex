import { Injectable } from '@nestjs/common';
import { createOpenAI } from '@ai-sdk/openai';
import { ToolLoopAgent, stepCountIs } from 'ai';
import type { LanguageModel, StopCondition, ToolSet } from 'ai';
import type { AiProviderAdapter } from './ai-provider.interface';

const XAI_BASE_URL = 'https://api.x.ai/v1';

@Injectable()
export class GrokProviderAdapter implements AiProviderAdapter {
  createModel(apiKey: string, modelId: string): LanguageModel {
    const client = createOpenAI({ apiKey, baseURL: XAI_BASE_URL });
    return client(modelId);
  }

  createAgent<T extends ToolSet>(
    tools: T,
    model: LanguageModel,
    instructions: string,
    options?: {
      stopWhen?: StopCondition<T>;
      onStepFinish?: (step: unknown) => Promise<void> | void;
    },
  ) {
    return new ToolLoopAgent({
      model,
      instructions,
      tools,
      stopWhen: options?.stopWhen ?? stepCountIs(20),
      onStepFinish: options?.onStepFinish as never,
    });
  }
}
