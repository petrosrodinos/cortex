import { Module } from '@nestjs/common';
import { IntegrationFrameworkModule } from './framework/integration-framework.module';
import { IntegrationRegistry } from './framework/integration-registry.service';
import { IntegrationActionsService } from './integration-actions.service';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { SaasIntegrationsModule } from './saas/saas-integrations.module';

@Module({
  imports: [IntegrationFrameworkModule, SaasIntegrationsModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, IntegrationActionsService],
  exports: [IntegrationRegistry, IntegrationsService, IntegrationActionsService],
})
export class IntegrationsModule {}
