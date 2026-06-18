import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ConversationsService } from './conversations.service';
import { MessagesService } from './messages.service';
import { ExecutionsService } from './executions.service';

@Controller('organizations/:organization_uuid/conversations')
@UseGuards(JwtGuard, OrganizationGuard)
export class ConversationsController {
  constructor(
    private readonly conversations: ConversationsService,
    private readonly messages: MessagesService,
  ) {}

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

@Controller('organizations/:organization_uuid/executions')
@UseGuards(JwtGuard, OrganizationGuard)
export class ExecutionsController {
  constructor(private readonly executions: ExecutionsService) {}

  @Get('usage')
  getUsage(@CurrentUser('uuid') userUuid: string, @Param('organization_uuid') organizationUuid: string) {
    return this.executions.getUsage(userUuid, organizationUuid);
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
