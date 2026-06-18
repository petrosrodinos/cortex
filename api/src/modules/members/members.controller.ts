import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersService } from './members.service';

@Controller('organizations/:organization_uuid/members')
@UseGuards(JwtGuard)
export class MembersController {
  constructor(private readonly members_service: MembersService) {}

  @Get()
  async findAll(@CurrentUser('uuid') user_uuid: string, @Param('organization_uuid') organization_uuid: string) {
    try {
      return await this.members_service.findAll(user_uuid, organization_uuid);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async invite(@CurrentUser('uuid') user_uuid: string, @Param('organization_uuid') organization_uuid: string, @Body() dto: InviteMemberDto) {
    try {
      return await this.members_service.invite(user_uuid, organization_uuid, dto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':organization_member_uuid/invitation-url')
  async getInvitationUrl(
    @CurrentUser('uuid') user_uuid: string,
    @Param('organization_uuid') organization_uuid: string,
    @Param('organization_member_uuid') organization_member_uuid: string,
  ) {
    try {
      return await this.members_service.getInvitationUrl(user_uuid, organization_uuid, organization_member_uuid);
    } catch (error) {
      throw error;
    }
  }

  @Post(':organization_member_uuid/resend-invitation')
  async resendInvitation(
    @CurrentUser('uuid') user_uuid: string,
    @Param('organization_uuid') organization_uuid: string,
    @Param('organization_member_uuid') organization_member_uuid: string,
  ) {
    try {
      return await this.members_service.resendInvitation(user_uuid, organization_uuid, organization_member_uuid);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':organization_member_uuid')
  async update(
    @CurrentUser('uuid') user_uuid: string,
    @Param('organization_uuid') organization_uuid: string,
    @Param('organization_member_uuid') organization_member_uuid: string,
    @Body() dto: UpdateMemberDto,
  ) {
    try {
      return await this.members_service.update(user_uuid, organization_uuid, organization_member_uuid, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':organization_member_uuid')
  async remove(
    @CurrentUser('uuid') user_uuid: string,
    @Param('organization_uuid') organization_uuid: string,
    @Param('organization_member_uuid') organization_member_uuid: string,
  ) {
    try {
      return await this.members_service.remove(user_uuid, organization_uuid, organization_member_uuid);
    } catch (error) {
      throw error;
    }
  }
}
