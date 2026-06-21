import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
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
  listAgentTools(@Param('organization_uuid') organizationUuid: string) {
    return this.capabilities.listEnabledAgentTools(organizationUuid);
  }

  @Get()
  findAll(@CurrentUser('uuid') userUuid: string, @Param('organization_uuid') organizationUuid: string) {
    return this.conversations.findAll(userUuid, organizationUuid);
  }

  @Post()
  create(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversations.create(userUuid, organizationUuid, dto);
  }

  @Get(':conversation_uuid')
  findOne(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('conversation_uuid') conversationUuid: string,
  ) {
    return this.conversations.findOne(userUuid, organizationUuid, conversationUuid);
  }

  @Patch(':conversation_uuid')
  update(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('conversation_uuid') conversationUuid: string,
    @Body() dto: UpdateConversationDto,
  ) {
    return this.conversations.update(userUuid, organizationUuid, conversationUuid, dto);
  }

  @Delete(':conversation_uuid')
  delete(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('conversation_uuid') conversationUuid: string,
  ) {
    return this.conversations.delete(userUuid, organizationUuid, conversationUuid);
  }

  @Get(':conversation_uuid/messages')
  findMessages(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('conversation_uuid') conversationUuid: string,
  ) {
    return this.messages.findAll(userUuid, organizationUuid, conversationUuid);
  }

  @Post(':conversation_uuid/messages')
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
  findAll(@CurrentUser('uuid') userUuid: string, @Param('organization_uuid') organizationUuid: string) {
    return this.executions.findAll(userUuid, organizationUuid);
  }

  @Get(':execution_uuid')
  findOne(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('execution_uuid') executionUuid: string,
  ) {
    return this.executions.findOne(userUuid, organizationUuid, executionUuid);
  }

  @Post(':execution_uuid/approve')
  approve(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('execution_uuid') executionUuid: string,
  ) {
    return this.executions.approve(userUuid, organizationUuid, executionUuid);
  }

  @Post(':execution_uuid/reject')
  reject(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Param('execution_uuid') executionUuid: string,
  ) {
    return this.executions.reject(userUuid, organizationUuid, executionUuid);
  }
}
