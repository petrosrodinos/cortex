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
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentsService } from './agents.service';

@Controller('organizations/:organization_uuid/agents')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class AgentsController {
  constructor(private readonly agents: AgentsService) {}

  @Get()
  @OrganizationPermission(PermissionKeys.AGENTS_READ)
  findAll(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
  ) {
    return this.agents.findAll(userUuid, organizationUuid);
  }

  @Post()
  @OrganizationPermission(PermissionKeys.AGENTS_WRITE)
  create(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Body() dto: CreateAgentDto,
  ) {
    return this.agents.create(userUuid, organizationUuid, dto);
  }

  @Get(':agent_uuid')
  @OrganizationPermission(PermissionKeys.AGENTS_READ)
  findOne(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('agent_uuid') agentUuid: string,
  ) {
    return this.agents.findOne(userUuid, organizationUuid, agentUuid);
  }

  @Patch(':agent_uuid')
  @OrganizationPermission(PermissionKeys.AGENTS_WRITE)
  update(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('agent_uuid') agentUuid: string,
    @Body() dto: UpdateAgentDto,
  ) {
    return this.agents.update(userUuid, organizationUuid, agentUuid, dto);
  }

  @Delete(':agent_uuid')
  @OrganizationPermission(PermissionKeys.AGENTS_DELETE)
  remove(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('agent_uuid') agentUuid: string,
  ) {
    return this.agents.remove(userUuid, organizationUuid, agentUuid);
  }
}
