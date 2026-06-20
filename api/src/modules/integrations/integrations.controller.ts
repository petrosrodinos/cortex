import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrganizationPermission } from '@/shared/decorators/organization-permission.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { ToggleIntegrationActionDto } from './dto/toggle-integration-action.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { IntegrationActionsService } from './integration-actions.service';
import { IntegrationsService } from './integrations.service';

@Controller('organizations/:organization_uuid/integrations')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class IntegrationsController {
  constructor(
    private readonly integrations_service: IntegrationsService,
    private readonly integration_actions_service: IntegrationActionsService,
  ) {}

  @Get()
  async findAll(@Param('organization_uuid') organization_uuid: string) {
    return await this.integrations_service.findAll(organization_uuid);
  }

  @Get('tools')
  async getEnabledTools(@Param('organization_uuid') organization_uuid: string) {
    return await this.integrations_service.getEnabledTools(organization_uuid);
  }

  @Get(':integration_uuid')
  async findOne(
    @Param('organization_uuid') organization_uuid: string,
    @Param('integration_uuid') integration_uuid: string,
  ) {
    return await this.integrations_service.findOne(
      organization_uuid,
      integration_uuid,
    );
  }

  @Patch(':integration_uuid')
  @OrganizationPermission('org:integrations:manage')
  async update(
    @Param('organization_uuid') organization_uuid: string,
    @Param('integration_uuid') integration_uuid: string,
    @Body() dto: UpdateIntegrationDto,
  ) {
    return await this.integrations_service.update(
      organization_uuid,
      integration_uuid,
      dto,
    );
  }

  @Delete(':integration_uuid')
  @OrganizationPermission('org:integrations:manage')
  async delete(
    @Param('organization_uuid') organization_uuid: string,
    @Param('integration_uuid') integration_uuid: string,
  ) {
    return await this.integrations_service.delete(
      organization_uuid,
      integration_uuid,
    );
  }

  @Post(':integration_uuid/test')
  async testConnection(
    @Param('organization_uuid') organization_uuid: string,
    @Param('integration_uuid') integration_uuid: string,
  ) {
    return await this.integrations_service.testConnection(
      organization_uuid,
      integration_uuid,
    );
  }

  @Get(':integration_uuid/actions')
  async getActions(@Param('integration_uuid') integration_uuid: string) {
    return await this.integration_actions_service.getActions(integration_uuid);
  }

  @Patch(':integration_uuid/actions/:action_uuid')
  @OrganizationPermission('org:integrations:manage')
  async toggleAction(
    @Param('integration_uuid') integration_uuid: string,
    @Param('action_uuid') action_uuid: string,
    @Body() dto: ToggleIntegrationActionDto,
  ) {
    return await this.integration_actions_service.toggleAction(
      integration_uuid,
      action_uuid,
      dto.enabled,
    );
  }
}
