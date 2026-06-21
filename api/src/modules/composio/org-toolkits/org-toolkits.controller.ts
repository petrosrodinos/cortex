import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizationPermission } from '@/shared/decorators/organization-permission.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { ListOrgToolkitToolsDto } from './dto/list-org-toolkit-tools.dto';
import { ListOrgToolkitsDto } from './dto/list-org-toolkits.dto';
import {
  ListOrgToolkitToolsSchema,
  ListOrgToolkitsSchema,
  UpdateOrgToolPermissionSchema,
} from './dto/org-toolkits.schemas';
import { UpdateOrgToolPermissionDto } from './dto/update-org-tool-permission.dto';
import { OrgToolkitsService } from './org-toolkits.service';

@Controller([
  'organizations/:organization_uuid/integrations/composio',
  'organizations/:organization_uuid/integrations/apps',
])
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class OrgToolkitsController {
  constructor(private readonly service: OrgToolkitsService) {}

  @Get('toolkits')
  listToolkits(
    @Param('organization_uuid') organizationUuid: string,
    @Query(new ZodValidationPipe(ListOrgToolkitsSchema))
    query: ListOrgToolkitsDto,
  ) {
    return this.service.listToolkits(organizationUuid, query);
  }

  @Get('toolkits/:slug/tools')
  listToolkitTools(
    @Param('organization_uuid') organizationUuid: string,
    @Param('slug') slug: string,
    @Query(new ZodValidationPipe(ListOrgToolkitToolsSchema))
    query: ListOrgToolkitToolsDto,
  ) {
    return this.service.listToolkitTools(organizationUuid, slug, query);
  }

  @Get('toolkits/:slug')
  getToolkit(
    @Param('organization_uuid') organizationUuid: string,
    @Param('slug') slug: string,
  ) {
    return this.service.getToolkit(organizationUuid, slug);
  }

  @Post('toolkits/:slug/enable')
  @OrganizationPermission('org:integrations:manage')
  enableToolkit(
    @Param('organization_uuid') organizationUuid: string,
    @Param('slug') slug: string,
  ) {
    return this.service.enableToolkit(organizationUuid, slug);
  }

  @Post('toolkits/:slug/disable')
  @OrganizationPermission('org:integrations:manage')
  disableToolkit(
    @Param('organization_uuid') organizationUuid: string,
    @Param('slug') slug: string,
  ) {
    return this.service.disableToolkit(organizationUuid, slug);
  }

  @Patch('tools/:tool_slug')
  @OrganizationPermission('org:integrations:manage')
  updateToolPermission(
    @Param('organization_uuid') organizationUuid: string,
    @Param('tool_slug') toolSlug: string,
    @Body(new ZodValidationPipe(UpdateOrgToolPermissionSchema))
    dto: UpdateOrgToolPermissionDto,
  ) {
    return this.service.updateToolPermission(organizationUuid, toolSlug, dto);
  }

  @Get('tools')
  listEnabledTools(@Param('organization_uuid') organizationUuid: string) {
    return this.service.listEnabledTools(organizationUuid);
  }
}
