import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AppCacheModule } from '@/shared/services/cache/cache.module';
import { IntegrationFrameworkModule } from '@/modules/integrations/framework/integration-framework.module';
import { WebsocketsModule } from '@/core/websockets/websockets.module';
import { GcsIntegrationModule } from '@/integrations/storage/gcs/gcs.module';
import { OpenAiProviderAdapter } from './providers/openai-provider';
import { ClaudeProviderAdapter } from './providers/claude-provider';
import { GrokProviderAdapter } from './providers/grok-provider';
import { AiProviderFactoryService } from './providers/ai-provider-factory.service';
import { ConversationMemoryService } from './memory/conversation-memory.service';
import { AgentRunnerService } from './agents/runner/agent-runner.service';
import { ToolDispatcherService } from './agents/tools/tool-dispatcher.service';
import { IntegrationToolsFactory } from './agents/tools/integration-tools.factory';
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
import { ImageGeneratorService } from './agents/outputs/image-generator.service';
import { DocxGeneratorService } from './agents/outputs/docx-generator.service';
import { DocumentOutputService } from './agents/outputs/document-output.service';
import { WordGeneratorService } from './agents/outputs/word-generator.service';
import { PdfGeneratorService } from './agents/outputs/pdf-generator.service';
import { OutputToolsFactory } from './agents/outputs/output-tools.factory';
import { ExecutionToolIdempotencyService } from './agents/tools/execution-tool-idempotency.service';
import { OrganizationToolsFactory } from './agents/organization/organization-tools.factory';
import { OrganizationToolsService } from './agents/organization/organization-tools.service';
import { EncryptionService } from '@/shared/utils/encryption.service';

@Module({
  imports: [PrismaModule, AppCacheModule, IntegrationFrameworkModule, WebsocketsModule, GcsIntegrationModule],
  providers: [
    EncryptionService,
    OpenAiProviderAdapter,
    ClaudeProviderAdapter,
    GrokProviderAdapter,
    AiProviderFactoryService,
    ConversationMemoryService,
    ToolDispatcherService,
    ExecutionToolIdempotencyService,
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
    IntegrationToolsFactory,
    ImageGeneratorService,
    DocxGeneratorService,
    DocumentOutputService,
    WordGeneratorService,
    PdfGeneratorService,
    OutputToolsFactory,
    OrganizationToolsService,
    OrganizationToolsFactory,
    SystemPromptBuilder,
    AgentRunnerService,
  ],
  exports: [AgentRunnerService, ConversationMemoryService, AiProviderFactoryService],
})
export class AiModule {}

