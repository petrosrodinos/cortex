import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { DocumentBoardsController } from './document-boards.controller';
import { DocumentBoardsService } from './document-boards.service';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [DocumentBoardsController],
  providers: [DocumentBoardsService],
  exports: [DocumentBoardsService],
})
export class DocumentBoardsModule {}
