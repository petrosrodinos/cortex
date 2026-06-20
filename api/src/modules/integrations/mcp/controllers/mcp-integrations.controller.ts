import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrganizationPermission } from '@/shared/decorators/organization-permission.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { CreateMcpIntegrationDto, TestMcpConnectionDto } from '../dto/create-mcp-integration.dto';
import { McpIntegrationsService } from '../services/mcp-integrations.service';

@Controller('organizations/:organization_uuid/integrations/mcp')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class McpIntegrationsController {
  constructor(private readonly mcpIntegrationsService: McpIntegrationsService) {}

  @Post('test-connection')
  async testConnectionDraft(@Body() dto: TestMcpConnectionDto) {
    return await this.mcpIntegrationsService.testConnectionDraft(dto);
  }

  @Post()
  @OrganizationPermission('org:integrations:manage')
  async create(@Param('organization_uuid') organizationUuid: string, @Body() dto: CreateMcpIntegrationDto) {
    return await this.mcpIntegrationsService.create(organizationUuid, dto);
  }

  @Get(':integration_uuid')
  async getDetails(
    @Param('organization_uuid') organizationUuid: string,
    @Param('integration_uuid') integrationUuid: string,
  ) {
    return await this.mcpIntegrationsService.getDetails(organizationUuid, integrationUuid);
  }

  @Post(':integration_uuid/sync-tools')
  @OrganizationPermission('org:integrations:manage')
  async syncTools(
    @Param('organization_uuid') organizationUuid: string,
    @Param('integration_uuid') integrationUuid: string,
  ) {
    return await this.mcpIntegrationsService.syncTools(organizationUuid, integrationUuid);
  }

  @Post(':integration_uuid/test')
  async testConnection(
    @Param('organization_uuid') organizationUuid: string,
    @Param('integration_uuid') integrationUuid: string,
  ) {
    return await this.mcpIntegrationsService.testConnection(organizationUuid, integrationUuid);
  }
}
