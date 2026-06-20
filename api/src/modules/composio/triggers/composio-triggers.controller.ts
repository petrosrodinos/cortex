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
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { ComposioTriggersService } from './composio-triggers.service';
import {
  CreateComposioTriggerSchema,
  UpdateComposioTriggerSchema,
} from './dto/composio-triggers.schemas';
import { CreateComposioTriggerDto } from './dto/create-composio-trigger.dto';
import { UpdateComposioTriggerDto } from './dto/update-composio-trigger.dto';

@Controller('organizations/:organization_uuid/integrations/composio/triggers')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class ComposioTriggersController {
  constructor(private readonly service: ComposioTriggersService) {}

  @Get()
  list(@Param('organization_uuid') organizationUuid: string) {
    return this.service.list(organizationUuid);
  }

  @Post()
  @OrganizationPermission('org:integrations:manage')
  create(
    @Param('organization_uuid') organizationUuid: string,
    @Body(new ZodValidationPipe(CreateComposioTriggerSchema))
    dto: CreateComposioTriggerDto,
  ) {
    return this.service.create(organizationUuid, dto);
  }

  @Patch(':uuid')
  @OrganizationPermission('org:integrations:manage')
  update(
    @Param('organization_uuid') organizationUuid: string,
    @Param('uuid') triggerUuid: string,
    @Body(new ZodValidationPipe(UpdateComposioTriggerSchema))
    dto: UpdateComposioTriggerDto,
  ) {
    return this.service.update(organizationUuid, triggerUuid, dto);
  }

  @Delete(':uuid')
  @OrganizationPermission('org:integrations:manage')
  remove(
    @Param('organization_uuid') organizationUuid: string,
    @Param('uuid') triggerUuid: string,
  ) {
    return this.service.remove(organizationUuid, triggerUuid);
  }
}
