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
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { OrganizationPermission } from '@/shared/decorators/organization-permission.decorator';
import { PermissionKeys } from '@/modules/roles/permissions';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { CreateSavedPromptDto } from './dto/create-saved-prompt.dto';
import { UpdateSavedPromptDto } from './dto/update-saved-prompt.dto';
import { SavedPromptsService } from './saved-prompts.service';

@Controller('organizations/:organization_uuid/saved-prompts')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class SavedPromptsController {
  constructor(private readonly savedPrompts: SavedPromptsService) {}

  @Get()
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_READ)
  findAll(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
  ) {
    return this.savedPrompts.findAll(userUuid, organizationUuid);
  }

  @Post()
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_WRITE)
  create(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Body() dto: CreateSavedPromptDto,
  ) {
    return this.savedPrompts.create(userUuid, organizationUuid, dto);
  }

  @Get(':prompt_uuid')
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_READ)
  findOne(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('prompt_uuid') promptUuid: string,
  ) {
    return this.savedPrompts.findOne(userUuid, organizationUuid, promptUuid);
  }

  @Patch(':prompt_uuid')
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_WRITE)
  update(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('prompt_uuid') promptUuid: string,
    @Body() dto: UpdateSavedPromptDto,
  ) {
    return this.savedPrompts.update(userUuid, organizationUuid, promptUuid, dto);
  }

  @Delete(':prompt_uuid')
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_DELETE)
  remove(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('prompt_uuid') promptUuid: string,
  ) {
    return this.savedPrompts.remove(userUuid, organizationUuid, promptUuid);
  }
}
