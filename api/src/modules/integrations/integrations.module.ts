import { Module } from '@nestjs/common';
import { DatabaseIntegrationsModule } from './databases/database-integrations.module';
import { IntegrationFrameworkModule } from './framework/integration-framework.module';
import { IntegrationActionsService } from './integration-actions.service';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { OpenApiIntegrationsModule } from './openapi/openapi-integrations.module';
import { McpIntegrationsModule } from './mcp/mcp-integrations.module';

@Module({
  imports: [
    IntegrationFrameworkModule,
    DatabaseIntegrationsModule,
    OpenApiIntegrationsModule,
    McpIntegrationsModule,
  ],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, IntegrationActionsService],
  exports: [
    IntegrationFrameworkModule,
    IntegrationsService,
    IntegrationActionsService,
  ],
})
export class IntegrationsModule {}
