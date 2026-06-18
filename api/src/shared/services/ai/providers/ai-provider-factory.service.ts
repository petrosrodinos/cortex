import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { AiProviderType } from 'generated/prisma';
import type { LanguageModel, ToolLoopAgent, ToolSet } from 'ai';
import type { AiProviderAdapter } from './ai-provider.interface';
import { OpenAiProviderAdapter } from './openai-provider';
import { ClaudeProviderAdapter } from './claude-provider';
import { GrokProviderAdapter } from './grok-provider';

export interface ResolvedAiProvider {
  provider: AiProviderType;
  modelId: string;
  model: LanguageModel;
  adapter: AiProviderAdapter;
}

@Injectable()
export class AiProviderFactoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly config: ConfigService,
    private readonly openai: OpenAiProviderAdapter,
    private readonly claude: ClaudeProviderAdapter,
    private readonly grok: GrokProviderAdapter,
  ) {}

  async resolveProvider(organizationUuid: string): Promise<ResolvedAiProvider> {
    const record = await this.prisma.aiProvider.findFirst({
      where: { org_uuid: organizationUuid, is_default: true },
      orderBy: { created_at: 'asc' },
    });

    if (record) {
      const apiKey = this.encryption.decrypt(record.api_key);
      const adapter = this.getAdapter(record.provider);
      return {
        provider: record.provider,
        modelId: record.default_model,
        model: adapter.createModel(apiKey, record.default_model),
        adapter,
      };
    }

    const fallbackKey = this.config.get<string>('OPENAI_API_KEY');
    if (!fallbackKey) {
      throw new NotFoundException('No AI provider configured for this organization');
    }

    return {
      provider: AiProviderType.OPENAI,
      modelId: 'gpt-4o-mini',
      model: this.openai.createModel(fallbackKey, 'gpt-4o-mini'),
      adapter: this.openai,
    };
  }

  createAgent<T extends ToolSet>(
    resolved: ResolvedAiProvider,
    tools: T,
    instructions: string,
    options?: {
      onStepFinish?: (step: unknown) => Promise<void> | void;
    },
  ): ToolLoopAgent<never, T> {
    return resolved.adapter.createAgent(tools, resolved.model, instructions, options);
  }

  async resolveOpenAiApiKey(organizationUuid: string): Promise<string | null> {
    const defaultProvider = await this.prisma.aiProvider.findFirst({
      where: { org_uuid: organizationUuid, is_default: true },
      orderBy: { created_at: 'asc' },
    });

    if (defaultProvider?.provider === AiProviderType.OPENAI) {
      return this.encryption.decrypt(defaultProvider.api_key);
    }

    const openAiProvider = await this.prisma.aiProvider.findFirst({
      where: { org_uuid: organizationUuid, provider: AiProviderType.OPENAI },
      orderBy: { created_at: 'asc' },
    });

    if (openAiProvider) {
      return this.encryption.decrypt(openAiProvider.api_key);
    }

    return this.config.get<string>('OPENAI_API_KEY') ?? null;
  }

  private getAdapter(provider: AiProviderType): AiProviderAdapter {
    switch (provider) {
      case AiProviderType.OPENAI:
        return this.openai;
      case AiProviderType.CLAUDE:
        return this.claude;
      case AiProviderType.GROK:
        return this.grok;
      default:
        return this.openai;
    }
  }
}
