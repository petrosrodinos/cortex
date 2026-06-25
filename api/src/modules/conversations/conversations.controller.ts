import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { OrganizationPermission } from '@/shared/decorators/organization-permission.decorator';
import { PermissionKeys } from '@/modules/roles/permissions';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ResolveConnectionTiersDto } from './dto/resolve-connection-tiers.dto';
import { ResolveUserChoiceDto } from './dto/resolve-user-choice.dto';
import { UsageQuerySchema, type UsageQueryType } from './dto/usage-query.schema';
import { ConversationsService } from './conversations.service';
import { MessagesService } from './messages.service';
import { ExecutionsService } from './executions.service';
import { SuperAdminGuard } from '@/shared/guards/super-admin.guard';
import { CapabilitiesToolsService } from '@/shared/services/ai/agents/capabilities/capabilities-tools.service';

@Controller('organizations/:organization_uuid/conversations')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class ConversationsController {
  constructor(
    private readonly conversations: ConversationsService,
    private readonly messages: MessagesService,
    private readonly capabilities: CapabilitiesToolsService,
  ) {}

  @Get('agent-tools')
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_READ)
  listAgentTools(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
  ) {
    return this.capabilities.listEnabledAgentTools(organizationUuid, userUuid);
  }

  @Get()
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_READ)
  findAll(@CurrentUser('uuid') userUuid: string, @Param('organization_uuid') organizationUuid: string) {
    return this.conversations.findAll(userUuid, organizationUuid);
  }

  @Post()
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_WRITE)
  create(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversations.create(userUuid, organizationUuid, dto);
  }

  @Get(':conversation_uuid')
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_READ)
  findOne(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('conversation_uuid') conversationUuid: string,
  ) {
    return this.conversations.findOne(userUuid, organizationUuid, conversationUuid);
  }

  @Patch(':conversation_uuid')
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_WRITE)
  update(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('conversation_uuid') conversationUuid: string,
    @Body() dto: UpdateConversationDto,
  ) {
    return this.conversations.update(userUuid, organizationUuid, conversationUuid, dto);
  }

  @Delete(':conversation_uuid')
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_DELETE)
  delete(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('conversation_uuid') conversationUuid: string,
  ) {
    return this.conversations.delete(userUuid, organizationUuid, conversationUuid);
  }

  @Get(':conversation_uuid/documents')
  @OrganizationPermission(PermissionKeys.DOCUMENTS_READ)
  findDocuments(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('conversation_uuid') conversationUuid: string,
  ) {
    return this.messages.getConversationDocuments(userUuid, organizationUuid, conversationUuid);
  }

  @Get(':conversation_uuid/messages')
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_READ)
  findMessages(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('conversation_uuid') conversationUuid: string,
  ) {
    return this.messages.findAll(userUuid, organizationUuid, conversationUuid);
  }

  @Post(':conversation_uuid/messages')
  @OrganizationPermission(PermissionKeys.CONVERSATIONS_WRITE)
  sendMessage(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('conversation_uuid') conversationUuid: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messages.sendMessage(userUuid, organizationUuid, conversationUuid, dto);
  }
}

@Controller('organizations/:organization_uuid/conversations')
@UseGuards(JwtGuard, SuperAdminGuard)
export class ConversationSuperAdminController {
  constructor(private readonly messages: MessagesService) {}

  @Delete(':conversation_uuid/messages/:message_uuid')
  deleteMessage(
    @Param('organization_uuid') organizationUuid: string,
    @Param('conversation_uuid') conversationUuid: string,
    @Param('message_uuid') messageUuid: string,
  ) {
    return this.messages.deleteAsSuperAdmin(
      organizationUuid,
      conversationUuid,
      messageUuid,
    );
  }
}

@Controller('organizations/:organization_uuid/executions')
@UseGuards(
  JwtGuard,
  OrganizationMatchGuard,
  OrganizationActiveMemberGuard,
  OrganizationGuard,
)
export class ExecutionsController {
  constructor(private readonly executions: ExecutionsService) {}

  @Get('usage')
  getUsage(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Query(new ZodValidationPipe(UsageQuerySchema)) query: UsageQueryType,
  ) {
    return this.executions.getUsage(userUuid, organizationUuid, query);
  }

  @Get('usage/records')
  getUsageRecords(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Query(new ZodValidationPipe(UsageQuerySchema)) query: UsageQueryType,
  ) {
    return this.executions.getUsageRecords(userUuid, organizationUuid, query);
  }

  @Get()
  @OrganizationPermission(PermissionKeys.EXECUTIONS_READ)
  findAll(@CurrentUser('uuid') userUuid: string, @Param('organization_uuid') organizationUuid: string) {
    return this.executions.findAll(userUuid, organizationUuid);
  }

  @Get(':execution_uuid')
  @OrganizationPermission(PermissionKeys.EXECUTIONS_READ)
  findOne(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('execution_uuid') executionUuid: string,
  ) {
    return this.executions.findOne(userUuid, organizationUuid, executionUuid);
  }

  @Post(':execution_uuid/approve')
  @OrganizationPermission(PermissionKeys.EXECUTIONS_APPROVE)
  approve(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('execution_uuid') executionUuid: string,
  ) {
    return this.executions.approve(userUuid, organizationUuid, executionUuid);
  }

  @Post(':execution_uuid/reject')
  @OrganizationPermission(PermissionKeys.EXECUTIONS_APPROVE)
  reject(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('execution_uuid') executionUuid: string,
  ) {
    return this.executions.reject(userUuid, organizationUuid, executionUuid);
  }

  @Post(':execution_uuid/connection-tiers')
  @OrganizationPermission(PermissionKeys.EXECUTIONS_READ)
  resolveConnectionTiers(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('execution_uuid') executionUuid: string,
    @Body() dto: ResolveConnectionTiersDto,
  ) {
    return this.executions.resolveConnectionTiers(
      userUuid,
      organizationUuid,
      executionUuid,
      dto,
    );
  }

  @Post(':execution_uuid/choices')
  @OrganizationPermission(PermissionKeys.EXECUTIONS_READ)
  resolveUserChoice(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('execution_uuid') executionUuid: string,
    @Body() dto: ResolveUserChoiceDto,
  ) {
    return this.executions.resolveUserChoice(
      userUuid,
      organizationUuid,
      executionUuid,
      dto,
    );
  }

  @Post(':execution_uuid/choices/cancel')
  @OrganizationPermission(PermissionKeys.EXECUTIONS_READ)
  cancelUserChoice(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('execution_uuid') executionUuid: string,
  ) {
    return this.executions.cancelUserChoice(
      userUuid,
      organizationUuid,
      executionUuid,
    );
  }
}
