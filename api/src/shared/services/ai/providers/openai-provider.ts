import { Injectable } from '@nestjs/common';
import { createOpenAI } from '@ai-sdk/openai';
import { ToolLoopAgent, stepCountIs } from 'ai';
import type { LanguageModel, StopCondition, ToolSet } from 'ai';
import type { AiProviderAdapter } from './ai-provider.interface';

@Injectable()
export class OpenAiProviderAdapter implements AiProviderAdapter {
  createModel(apiKey: string, modelId: string): LanguageModel {
    const client = createOpenAI({ apiKey });
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
