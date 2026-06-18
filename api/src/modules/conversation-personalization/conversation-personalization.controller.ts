import { Body, Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationGuard } from '@/shared/guards/organization.guard';
import { UpdateConversationPersonalizationDto } from './dto/update-conversation-personalization.dto';
import { ConversationPersonalizationService } from './conversation-personalization.service';

@ApiTags('Conversation Personalization')
@Controller('organizations/:organization_uuid/conversation-personalization')
@UseGuards(JwtGuard, OrganizationGuard)
export class ConversationPersonalizationController {
  constructor(private readonly service: ConversationPersonalizationService) {}

  @Get()
  @ApiOperation({ summary: 'Get conversation personalization for the current user' })
  get(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
  ) {
    return this.service.get(userUuid, organizationUuid);
  }

  @Patch()
  @ApiOperation({ summary: 'Update conversation personalization for the current user' })
  update(
    @CurrentUser('uuid') userUuid: string,
    @Param('organization_uuid') organizationUuid: string,
    @Body() dto: UpdateConversationPersonalizationDto,
  ) {
    return this.service.upsert(userUuid, organizationUuid, dto);
  }
}
