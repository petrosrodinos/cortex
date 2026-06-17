import { Module } from '@nestjs/common';
import { DatabaseIntegrationsModule } from './databases/database-integrations.module';
import { IntegrationFrameworkModule } from './framework/integration-framework.module';
import { IntegrationRegistry } from './framework/integration-registry.service';
import { IntegrationActionsService } from './integration-actions.service';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { OpenApiIntegrationsModule } from './openapi/openapi-integrations.module';
import { SaasIntegrationsModule } from './saas/saas-integrations.module';

@Module({
  imports: [IntegrationFrameworkModule, SaasIntegrationsModule, DatabaseIntegrationsModule, OpenApiIntegrationsModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, IntegrationActionsService],
  exports: [IntegrationRegistry, IntegrationsService, IntegrationActionsService],
})
export class IntegrationsModule {}
