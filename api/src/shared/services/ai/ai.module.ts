import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AppCacheModule } from '@/shared/services/cache/cache.module';
import { IntegrationFrameworkModule } from '@/modules/integrations/framework/integration-framework.module';
import { WebsocketsModule } from '@/core/websockets/websockets.module';
import { OpenAiProviderAdapter } from './providers/openai-provider';
import { ClaudeProviderAdapter } from './providers/claude-provider';
import { GrokProviderAdapter } from './providers/grok-provider';
import { AiProviderFactoryService } from './providers/ai-provider-factory.service';
import { ConversationMemoryService } from './memory/conversation-memory.service';
import { ToolDispatcherService } from './agents/tool-dispatcher.service';
import { IntegrationToolsFactory } from './agents/integration-tools.factory';
import { AgentRunnerService } from './agents/agent-runner.service';
import { SystemPromptBuilder } from './agents/system-prompt.builder';
import { EncryptionService } from '@/shared/utils/encryption.service';

@Module({
  imports: [PrismaModule, AppCacheModule, IntegrationFrameworkModule, WebsocketsModule],
  providers: [
    EncryptionService,
    OpenAiProviderAdapter,
    ClaudeProviderAdapter,
    GrokProviderAdapter,
    AiProviderFactoryService,
    ConversationMemoryService,
    ToolDispatcherService,
    IntegrationToolsFactory,
    SystemPromptBuilder,
    AgentRunnerService,
  ],
  exports: [AgentRunnerService, ConversationMemoryService, AiProviderFactoryService],
})
export class AiModule {}
