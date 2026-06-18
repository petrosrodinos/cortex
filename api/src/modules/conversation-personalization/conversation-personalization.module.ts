import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { ConversationPersonalizationController } from './conversation-personalization.controller';
import { ConversationPersonalizationService } from './conversation-personalization.service';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [ConversationPersonalizationController],
  providers: [ConversationPersonalizationService],
  exports: [ConversationPersonalizationService],
})
export class ConversationPersonalizationModule {}
