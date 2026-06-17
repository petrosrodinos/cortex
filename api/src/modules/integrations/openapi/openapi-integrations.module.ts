import { Module } from '@nestjs/common';
import { IntegrationFrameworkModule } from '../framework/integration-framework.module';
import { OpenApiAuthService } from './auth/openapi-auth.service';
import { OpenApiIntegrationsController } from './controllers/openapi-integrations.controller';
import { OpenApiIntegrationRegistrar } from './integration/openapi-integration.registrar';
import { OpenApiIntegration } from './integration/openapi.integration';
import { OpenApiParserService } from './parser/openapi-parser.service';
import { OpenApiIntegrationsService } from './services/openapi-integrations.service';
import { ToolGeneratorService } from './tools/tool-generator.service';

@Module({
  imports: [IntegrationFrameworkModule],
  controllers: [OpenApiIntegrationsController],
  providers: [
    OpenApiParserService,
    ToolGeneratorService,
    OpenApiAuthService,
    OpenApiIntegration,
    OpenApiIntegrationsService,
    OpenApiIntegrationRegistrar,
  ],
  exports: [OpenApiIntegrationsService, OpenApiIntegration],
})
export class OpenApiIntegrationsModule {}
