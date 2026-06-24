import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrganizationPermission } from '@/shared/decorators/organization-permission.decorator';
import { PermissionKeys } from '@/modules/roles/permissions';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { CreateOpenApiIntegrationDto } from '../dto/create-openapi-integration.dto';
import { ParseOpenApiSpecDto } from '../dto/parse-openapi-spec.dto';
import { OpenApiIntegrationsService } from '../services/openapi-integrations.service';

@Controller('organizations/:organization_uuid/openapi-integrations')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class OpenApiIntegrationsController {
  constructor(private readonly openApiIntegrationsService: OpenApiIntegrationsService) {}

  @Post('parse')
  @OrganizationPermission(PermissionKeys.INTEGRATIONS_MANAGE)
  async parsePreview(@Body() dto: ParseOpenApiSpecDto) {
    return await this.openApiIntegrationsService.parsePreview(dto);
  }

  @Post()
  @OrganizationPermission(PermissionKeys.INTEGRATIONS_MANAGE)
  async create(@Param('organization_uuid') organizationUuid: string, @Body() dto: CreateOpenApiIntegrationDto) {
    return await this.openApiIntegrationsService.create(organizationUuid, dto);
  }

  @Get(':integration_uuid')
  async getDetails(
    @Param('organization_uuid') organizationUuid: string,
    @Param('integration_uuid') integrationUuid: string,
  ) {
    return await this.openApiIntegrationsService.getDetails(organizationUuid, integrationUuid);
  }

  @Post(':integration_uuid/regenerate')
  @OrganizationPermission(PermissionKeys.INTEGRATIONS_MANAGE)
  async regenerateTools(
    @Param('organization_uuid') organizationUuid: string,
    @Param('integration_uuid') integrationUuid: string,
  ) {
    return await this.openApiIntegrationsService.regenerateTools(organizationUuid, integrationUuid);
  }

  @Post(':integration_uuid/test')
  async testConnection(
    @Param('organization_uuid') organizationUuid: string,
    @Param('integration_uuid') integrationUuid: string,
  ) {
    return await this.openApiIntegrationsService.testConnection(organizationUuid, integrationUuid);
  }
}
