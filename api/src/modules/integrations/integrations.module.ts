import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationRegistry } from './framework/integration-registry.service';
import { IntegrationActionsService } from './integration-actions.service';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

@Module({
  imports: [PrismaModule],
  controllers: [IntegrationsController],
  providers: [EncryptionService, IntegrationRegistry, IntegrationsService, IntegrationActionsService],
  exports: [IntegrationRegistry, IntegrationsService, IntegrationActionsService],
})
export class IntegrationsModule {}
