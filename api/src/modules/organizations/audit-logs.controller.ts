import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { AuditLogsService } from './audit-logs.service';

@Controller('organizations/:organization_uuid/audit-logs')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class AuditLogsController {
  constructor(private readonly auditLogs: AuditLogsService) {}

  @Get()
  findAll(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('action') action?: string,
  ) {
    return this.auditLogs.findAll(
      userUuid,
      organizationUuid,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      action,
    );
  }
}
