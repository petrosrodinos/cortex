import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { AiProvidersController } from './ai-providers.controller';
import { AiProvidersService } from './ai-providers.service';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [AiProvidersController],
  providers: [AiProvidersService, EncryptionService],
  exports: [AiProvidersService],
})
export class AiProvidersModule {}
