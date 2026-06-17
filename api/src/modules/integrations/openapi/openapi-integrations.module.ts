import { Module, OnModuleInit } from '@nestjs/common';
import { IntegrationFrameworkModule } from '../framework/integration-framework.module';
import { IntegrationRegistry } from '../framework/integration-registry.service';
import { OpenApiAuthService } from './openapi-auth.service';
import { OpenApiIntegration } from './openapi.integration';
import { OpenApiIntegrationsController } from './openapi-integrations.controller';
import { OpenApiIntegrationsService } from './openapi-integrations.service';
import { OpenApiParserService } from './openapi-parser.service';
import { ToolGeneratorService } from './tool-generator.service';

class OpenApiIntegrationRegistrar implements OnModuleInit {
  constructor(
    private readonly registry: IntegrationRegistry,
    private readonly openApiIntegration: OpenApiIntegration,
  ) {}

  onModuleInit() {
    this.registry.register(this.openApiIntegration);
  }
}

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
