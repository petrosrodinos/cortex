import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { AuditLogsController } from './audit-logs.controller';
import { AuditLogsService } from './audit-logs.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrganizationsController, AuditLogsController],
  providers: [OrganizationsService, AuditLogsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
