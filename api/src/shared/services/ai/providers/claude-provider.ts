import { Injectable } from '@nestjs/common';
import { createAnthropic } from '@ai-sdk/anthropic';
import { ToolLoopAgent, stepCountIs } from 'ai';
import type { LanguageModel, ToolSet } from 'ai';
import type { AiProviderAdapter } from './ai-provider.interface';

@Injectable()
export class ClaudeProviderAdapter implements AiProviderAdapter {
  createModel(apiKey: string, modelId: string): LanguageModel {
    const client = createAnthropic({ apiKey });
    return client(modelId);
  }

  createAgent<T extends ToolSet>(
    tools: T,
    model: LanguageModel,
    instructions: string,
    options?: {
      stopWhen?: (opts: { steps: unknown[] }) => boolean;
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
