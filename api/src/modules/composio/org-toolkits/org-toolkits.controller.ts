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
import { PermissionKeys } from '@/modules/roles/permissions';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { CountOrgToolkitsDto } from './dto/count-org-toolkits.dto';
import { ListOrgToolkitToolsDto } from './dto/list-org-toolkit-tools.dto';
import { ListOrgToolkitsDto } from './dto/list-org-toolkits.dto';
import {
  CountOrgToolkitsSchema,
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
  @OrganizationPermission(PermissionKeys.INTEGRATIONS_READ)
  listToolkits(
    @Param('organization_uuid') organizationUuid: string,
    @Query(new ZodValidationPipe(ListOrgToolkitsSchema))
    query: ListOrgToolkitsDto,
  ) {
    return this.service.listToolkits(organizationUuid, query);
  }

  @Get('toolkits/count')
  @OrganizationPermission(PermissionKeys.INTEGRATIONS_READ)
  countToolkits(
    @Param('organization_uuid') organizationUuid: string,
    @Query(new ZodValidationPipe(CountOrgToolkitsSchema))
    query: CountOrgToolkitsDto,
  ) {
    return this.service.countToolkits(organizationUuid, query);
  }

  @Get('toolkits/:slug/tools')
  @OrganizationPermission(PermissionKeys.INTEGRATIONS_READ)
  listToolkitTools(
    @Param('organization_uuid') organizationUuid: string,
    @Param('slug') slug: string,
    @Query(new ZodValidationPipe(ListOrgToolkitToolsSchema))
    query: ListOrgToolkitToolsDto,
  ) {
    return this.service.listToolkitTools(organizationUuid, slug, query);
  }

  @Get('toolkits/:slug')
  @OrganizationPermission(PermissionKeys.INTEGRATIONS_READ)
  getToolkit(
    @Param('organization_uuid') organizationUuid: string,
    @Param('slug') slug: string,
  ) {
    return this.service.getToolkit(organizationUuid, slug);
  }

  @Post('toolkits/:slug/enable')
  @OrganizationPermission(PermissionKeys.INTEGRATIONS_MANAGE)
  enableToolkit(
    @Param('organization_uuid') organizationUuid: string,
    @Param('slug') slug: string,
  ) {
    return this.service.enableToolkit(organizationUuid, slug);
  }

  @Post('toolkits/:slug/disable')
  @OrganizationPermission(PermissionKeys.INTEGRATIONS_MANAGE)
  disableToolkit(
    @Param('organization_uuid') organizationUuid: string,
    @Param('slug') slug: string,
  ) {
    return this.service.disableToolkit(organizationUuid, slug);
  }

  @Patch('tools/:tool_slug')
  @OrganizationPermission(PermissionKeys.INTEGRATIONS_MANAGE)
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
