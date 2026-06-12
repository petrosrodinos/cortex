import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { SetRolePermissionsDto } from './dto/set-role-permissions.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller()
@UseGuards(JwtGuard)
export class RolesController {
  constructor(private readonly roles_service: RolesService) {}

  @Get('permissions')
  async permissions() {
    try {
      return await this.roles_service.permissions();
    } catch (error) {
      throw error;
    }
  }

  @Get('organizations/:organization_uuid/roles')
  async findAll(@CurrentUser('uuid') user_uuid: string, @Param('organization_uuid') organization_uuid: string) {
    try {
      return await this.roles_service.findAll(user_uuid, organization_uuid);
    } catch (error) {
      throw error;
    }
  }

  @Post('organizations/:organization_uuid/roles')
  async create(@CurrentUser('uuid') user_uuid: string, @Param('organization_uuid') organization_uuid: string, @Body() dto: CreateRoleDto) {
    try {
      return await this.roles_service.create(user_uuid, organization_uuid, dto);
    } catch (error) {
      throw error;
    }
  }

  @Patch('organizations/:organization_uuid/roles/:organization_role_uuid')
  async update(
    @CurrentUser('uuid') user_uuid: string,
    @Param('organization_uuid') organization_uuid: string,
    @Param('organization_role_uuid') organization_role_uuid: string,
    @Body() dto: UpdateRoleDto,
  ) {
    try {
      return await this.roles_service.update(user_uuid, organization_uuid, organization_role_uuid, dto);
    } catch (error) {
      throw error;
    }
  }

  @Put('organizations/:organization_uuid/roles/:organization_role_uuid/permissions')
  async setPermissions(
    @CurrentUser('uuid') user_uuid: string,
    @Param('organization_uuid') organization_uuid: string,
    @Param('organization_role_uuid') organization_role_uuid: string,
    @Body() dto: SetRolePermissionsDto,
  ) {
    try {
      return await this.roles_service.setPermissions(user_uuid, organization_uuid, organization_role_uuid, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete('organizations/:organization_uuid/roles/:organization_role_uuid')
  async delete(
    @CurrentUser('uuid') user_uuid: string,
    @Param('organization_uuid') organization_uuid: string,
    @Param('organization_role_uuid') organization_role_uuid: string,
  ) {
    try {
      return await this.roles_service.delete(user_uuid, organization_uuid, organization_role_uuid);
    } catch (error) {
      throw error;
    }
  }
}
