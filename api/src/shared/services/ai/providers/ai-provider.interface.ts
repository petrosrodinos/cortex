import type { LanguageModel, StopCondition, ToolLoopAgent, ToolSet } from 'ai';

export interface AiProviderAdapter {
  createModel(apiKey: string, modelId: string): LanguageModel;
  createAgent<T extends ToolSet>(
    tools: T,
    model: LanguageModel,
    instructions: string,
    options?: {
      stopWhen?: StopCondition<T>;
      onStepFinish?: (step: unknown) => Promise<void> | void;
    },
  ): ToolLoopAgent<never, T>;
}
