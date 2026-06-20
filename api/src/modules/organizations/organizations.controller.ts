import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { OrganizationActiveMemberGuard } from '@/shared/guards/organization-active-member.guard';
import { OrganizationMatchGuard } from '@/shared/guards/organization-match.guard';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
@UseGuards(JwtGuard)
export class OrganizationsController {
  constructor(private readonly organizations_service: OrganizationsService) {}

  @Post()
  async create(@CurrentUser('uuid') user_uuid: string, @Body() dto: CreateOrganizationDto) {
    try {
      return await this.organizations_service.create(user_uuid, dto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@CurrentUser('uuid') user_uuid: string) {
    try {
      return await this.organizations_service.findAll(user_uuid);
    } catch (error) {
      throw error;
    }
  }

  @Get(':organization_uuid')
  @UseGuards(OrganizationMatchGuard, OrganizationActiveMemberGuard)
  async findOne(@CurrentUser('uuid') user_uuid: string, @Param('organization_uuid') organization_uuid: string) {
    try {
      return await this.organizations_service.findOne(user_uuid, organization_uuid);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':organization_uuid')
  @UseGuards(OrganizationMatchGuard, OrganizationActiveMemberGuard)
  async update(
    @CurrentUser('uuid') user_uuid: string,
    @Param('organization_uuid') organization_uuid: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    try {
      return await this.organizations_service.update(user_uuid, organization_uuid, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':organization_uuid')
  @UseGuards(OrganizationMatchGuard, OrganizationActiveMemberGuard)
  async delete(@CurrentUser('uuid') user_uuid: string, @Param('organization_uuid') organization_uuid: string) {
    try {
      return await this.organizations_service.delete(user_uuid, organization_uuid);
    } catch (error) {
      throw error;
    }
  }
}
