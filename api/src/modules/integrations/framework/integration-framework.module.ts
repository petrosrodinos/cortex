import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationRegistry } from './registry/integration-registry.service';

@Module({
  imports: [PrismaModule],
  providers: [EncryptionService, IntegrationRegistry],
  exports: [PrismaModule, EncryptionService, IntegrationRegistry],
})
export class IntegrationFrameworkModule {}
