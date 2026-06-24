import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PermissionsBootstrapService } from './permissions-bootstrap.service';

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [RolesController],
  providers: [RolesService, PermissionsBootstrapService],
})
export class RolesModule {}
