import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { SavedPromptsController } from './saved-prompts.controller';
import { SavedPromptsService } from './saved-prompts.service';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [SavedPromptsController],
  providers: [SavedPromptsService],
  exports: [SavedPromptsService],
})
export class SavedPromptsModule {}
