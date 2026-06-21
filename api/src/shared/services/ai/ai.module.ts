import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AppCacheModule } from '@/shared/services/cache/cache.module';
import { IntegrationFrameworkModule } from '@/modules/integrations/framework/integration-framework.module';
import { WebsocketsModule } from '@/core/websockets/websockets.module';
import { GcsIntegrationModule } from '@/integrations/storage/gcs/gcs.module';
import { ComposioModule } from '@/modules/composio/composio.module';
import { OpenAiProviderAdapter } from './providers/openai-provider';
import { ClaudeProviderAdapter } from './providers/claude-provider';
import { GrokProviderAdapter } from './providers/grok-provider';
import { AiProviderFactoryService } from './providers/ai-provider-factory.service';
import { ConversationMemoryService } from './memory/conversation-memory.service';
import { AgentProgressEmitterService } from './agents/progress/agent-progress-emitter.service';
import { AgentRunnerService } from './agents/runner/agent-runner.service';
import { ToolDispatcherService } from './agents/tools/tool-dispatcher.service';
import { AgentToolsFactory } from './agents/tools/agent-tools.factory';
import { CapabilitiesToolsFactory } from './agents/capabilities/capabilities-tools.factory';
import { CapabilitiesToolsService } from './agents/capabilities/capabilities-tools.service';
import { CapabilitiesToolProvider } from './agents/tools/capabilities-tool.provider';
import { ComposioToolProvider } from './agents/tools/composio-tool.provider';
import { DocumentToolProvider } from './agents/tools/document-tool.provider';
import { LegacyIntegrationToolProvider } from './agents/tools/legacy-integration-tool.provider';
import { OrganizationToolProvider } from './agents/tools/organization-tool.provider';
import { OutputToolProvider } from './agents/tools/output-tool.provider';
import { SandboxToolProvider } from './agents/tools/sandbox-tool.provider';
import { UnifiedToolRegistry } from './agents/tools/unified-tool-registry.service';
import { SandboxCodeService } from './agents/sandbox/sandbox-code.service';
import { DocumentReaderService } from './agents/documents/document-reader.service';
import { DocumentToolsFactory } from './agents/documents/document-tools.factory';
import { DocumentParserRegistry } from './agents/documents/document-parser.registry';
import { PdfDocumentParser } from './agents/documents/parsers/pdf-document.parser';
import { WordDocumentParser } from './agents/documents/parsers/word-document.parser';
import { ExcelDocumentParser } from './agents/documents/parsers/excel-document.parser';
import { CsvDocumentParser } from './agents/documents/parsers/csv-document.parser';
import { TextDocumentParser } from './agents/documents/parsers/text-document.parser';
import { ImageDocumentParser } from './agents/documents/parsers/image-document.parser';
import { SystemPromptBuilder } from './agents/prompt/system-prompt.builder';
import { ImageGeneratorService } from './agents/outputs/image/image-generator.service';
import { DocxGeneratorService } from './agents/outputs/word/docx-generator.service';
import { DocumentOutputService } from './agents/outputs/shared/document-output.service';
import { WordGeneratorService } from './agents/outputs/word/word-generator.service';
import { PdfGeneratorService } from './agents/outputs/pdf/pdf-generator.service';
import { ExcelGeneratorService } from './agents/outputs/excel/excel-generator.service';
import { WidgetGeneratorService } from './agents/outputs/widget/widget-generator.service';
import { WidgetHtmlDebugService } from './agents/outputs/widget/widget-html-debug.service';
import { OutputToolsFactory } from './agents/outputs/tools/output-tools.factory';
import { ExecutionToolIdempotencyService } from './agents/tools/execution-tool-idempotency.service';
import { EmailToolPreprocessorService } from './agents/tools/email-tool-preprocessor.service';
import { AgentActorService } from './agents/actor/agent-actor.service';
import { OrganizationToolsFactory } from './agents/organization/organization-tools.factory';
import { OrganizationToolsService } from './agents/organization/organization-tools.service';
import { ConversationPersonalizationModule } from '@/modules/conversation-personalization/conversation-personalization.module';
import { EncryptionService } from '@/shared/utils/encryption.service';

@Module({
  imports: [
    PrismaModule,
    AppCacheModule,
    IntegrationFrameworkModule,
    WebsocketsModule,
    GcsIntegrationModule,
    ConversationPersonalizationModule,
    ComposioModule,
  ],
  providers: [
    EncryptionService,
    OpenAiProviderAdapter,
    ClaudeProviderAdapter,
    GrokProviderAdapter,
    AiProviderFactoryService,
    ConversationMemoryService,
    ToolDispatcherService,
    ExecutionToolIdempotencyService,
    EmailToolPreprocessorService,
    SandboxCodeService,
    PdfDocumentParser,
    WordDocumentParser,
    ExcelDocumentParser,
    CsvDocumentParser,
    TextDocumentParser,
    ImageDocumentParser,
    DocumentParserRegistry,
    DocumentReaderService,
    DocumentToolsFactory,
    LegacyIntegrationToolProvider,
    ComposioToolProvider,
    CapabilitiesToolsService,
    CapabilitiesToolsFactory,
    CapabilitiesToolProvider,
    SandboxToolProvider,
    DocumentToolProvider,
    OutputToolProvider,
    OrganizationToolProvider,
    UnifiedToolRegistry,
    AgentToolsFactory,
    ImageGeneratorService,
    DocxGeneratorService,
    DocumentOutputService,
    WordGeneratorService,
    PdfGeneratorService,
    ExcelGeneratorService,
    WidgetGeneratorService,
    WidgetHtmlDebugService,
    OutputToolsFactory,
    AgentActorService,
    OrganizationToolsService,
    OrganizationToolsFactory,
    SystemPromptBuilder,
    AgentProgressEmitterService,
    AgentRunnerService,
  ],
  exports: [
    AgentRunnerService,
    ConversationMemoryService,
    AiProviderFactoryService,
  ],
})
export class AiModule {}
