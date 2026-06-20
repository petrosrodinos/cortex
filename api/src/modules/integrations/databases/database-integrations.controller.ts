import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrganizationPermission } from '@/shared/decorators/organization-permission.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { DatabaseIntegrationsService } from './database-integrations.service';
import { CreateDatabaseIntegrationDto } from './dto/create-database-integration.dto';
import { TestDatabaseConnectionDto } from './dto/test-database-connection.dto';

@Controller('organizations/:organization_uuid/database-integrations')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class DatabaseIntegrationsController {
  constructor(private readonly databaseIntegrationsService: DatabaseIntegrationsService) {}

  @Post()
  @OrganizationPermission('org:integrations:manage')
  async createDatabaseIntegration(
    @Param('organization_uuid') organizationUuid: string,
    @Body() dto: CreateDatabaseIntegrationDto,
  ) {
    return await this.databaseIntegrationsService.create(organizationUuid, dto);
  }

  @Post('test')
  @OrganizationPermission('org:integrations:manage')
  async testDraftConnection(@Body() dto: TestDatabaseConnectionDto) {
    return await this.databaseIntegrationsService.testDraftConnection(dto);
  }

  @Get(':integration_uuid')
  async getDetails(
    @Param('organization_uuid') organizationUuid: string,
    @Param('integration_uuid') integrationUuid: string,
  ) {
    return await this.databaseIntegrationsService.getDetails(organizationUuid, integrationUuid);
  }

  @Post(':integration_uuid/sync')
  @OrganizationPermission('org:integrations:manage')
  async syncSchema(
    @Param('organization_uuid') organizationUuid: string,
    @Param('integration_uuid') integrationUuid: string,
  ) {
    return await this.databaseIntegrationsService.syncSchema(organizationUuid, integrationUuid);
  }

  @Post(':integration_uuid/test')
  async testSavedConnection(
    @Param('organization_uuid') organizationUuid: string,
    @Param('integration_uuid') integrationUuid: string,
  ) {
    return await this.databaseIntegrationsService.testConnection(organizationUuid, integrationUuid);
  }
}
