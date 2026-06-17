import type { LanguageModel } from 'ai';
import type { ToolLoopAgent } from 'ai';
import type { ToolSet } from 'ai';

export interface AiProviderAdapter {
  createModel(apiKey: string, modelId: string): LanguageModel;
  createAgent<T extends ToolSet>(
    tools: T,
    model: LanguageModel,
    instructions: string,
    options?: {
      stopWhen?: (options: { steps: unknown[] }) => boolean;
      onStepFinish?: (step: unknown) => Promise<void> | void;
    },
  ): ToolLoopAgent<never, T>;
}
