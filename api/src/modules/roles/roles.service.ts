import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { SetRolePermissionsDto } from './dto/set-role-permissions.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { OrganizationMemberStatus } from 'generated/prisma';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user_uuid: string, organization_uuid: string) {
    try {
      const organization = await this.requireActiveMember(user_uuid, organization_uuid);

      return await this.prisma.organizationRole.findMany({
        where: { org_uuid: organization.uuid },
        include: { permissions: { include: { permission: true } } },
        orderBy: [{ is_system: 'desc' }, { name: 'asc' }],
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async permissions() {
    try {
      return await this.prisma.permission.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] });
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(user_uuid: string, organization_uuid: string, dto: CreateRoleDto) {
    try {
      const organization = await this.requireRoleManager(user_uuid, organization_uuid);

      return await this.prisma.$transaction(async (tx) => {
        const role = await tx.organizationRole.create({
          data: {
            org_uuid: organization.uuid,
            name: dto.name,
            is_system: false,
          },
        });

        if (dto.permission_keys?.length) {
          await this.setPermissionsTx(tx, role.uuid, dto.permission_keys);
        }

        return tx.organizationRole.findUnique({
          where: { uuid: role.uuid },
          include: { permissions: { include: { permission: true } } },
        });
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(user_uuid: string, organization_uuid: string, organization_role_uuid: string, dto: UpdateRoleDto) {
    try {
      const organization = await this.requireRoleManager(user_uuid, organization_uuid);
      const role = await this.getOrganizationRole(organization.uuid, organization_role_uuid);

      if (role.is_system) {
        throw new BadRequestException('System roles cannot be updated');
      }

      return await this.prisma.organizationRole.update({
        where: { uuid: role.uuid },
        data: dto,
        include: { permissions: { include: { permission: true } } },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async setPermissions(user_uuid: string, organization_uuid: string, organization_role_uuid: string, dto: SetRolePermissionsDto) {
    try {
      const organization = await this.requireRoleManager(user_uuid, organization_uuid);
      const role = await this.getOrganizationRole(organization.uuid, organization_role_uuid);

      return await this.prisma.$transaction(async (tx) => {
        await this.setPermissionsTx(tx, role.uuid, dto.permission_keys);

        return tx.organizationRole.findUnique({
          where: { uuid: role.uuid },
          include: { permissions: { include: { permission: true } } },
        });
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(user_uuid: string, organization_uuid: string, organization_role_uuid: string) {
    try {
      const organization = await this.requireRoleManager(user_uuid, organization_uuid);
      const role = await this.getOrganizationRole(organization.uuid, organization_role_uuid);

      if (role.is_system) {
        throw new BadRequestException('System roles cannot be deleted');
      }

      return await this.prisma.organizationRole.delete({
        where: { uuid: role.uuid },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private async requireActiveMember(user_uuid: string, organization_uuid: string) {
    try {
      const membership = await this.prisma.organizationMember.findFirst({
        where: {
          user_uuid: user_uuid,
          status: OrganizationMemberStatus.ACTIVE,
          organization: { uuid: organization_uuid },
        },
        include: {
          organization: true,
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      });

      if (!membership) {
        throw new ForbiddenException('You are not a member of this organization');
      }

      return membership.organization;
    } catch (error) {
      this.handleError(error);
    }
  }

  private async requireRoleManager(user_uuid: string, organization_uuid: string) {
    try {
      const membership = await this.prisma.organizationMember.findFirst({
        where: {
          user_uuid: user_uuid,
          status: OrganizationMemberStatus.ACTIVE,
          organization: { uuid: organization_uuid },
        },
        include: {
          organization: true,
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      });

      if (!membership) {
        throw new ForbiddenException('You are not a member of this organization');
      }

      const permissions = membership.role.permissions?.map((role_permission) => role_permission.permission.key) ?? [];

      if (membership.role.name !== 'Owner' && !permissions.includes('org:roles:update')) {
        throw new ForbiddenException('Missing organization role permission');
      }

      return membership.organization;
    } catch (error) {
      this.handleError(error);
    }
  }

  private async getOrganizationRole(organization_uuid: string, organization_role_uuid: string) {
    try {
      const role = await this.prisma.organizationRole.findFirst({
        where: { uuid: organization_role_uuid, org_uuid: organization_uuid },
      });

      if (!role) {
        throw new NotFoundException('Role not found in this organization');
      }

      return role;
    } catch (error) {
      this.handleError(error);
    }
  }

  private async setPermissionsTx(tx: any, organization_role_uuid: string, permission_keys: string[]) {
    try {
      const permissions = await tx.permission.findMany({
        where: { key: { in: permission_keys } },
      });

      if (permissions.length !== permission_keys.length) {
        throw new BadRequestException('One or more permissions are invalid');
      }

      await tx.rolePermission.deleteMany({ where: { role_uuid: organization_role_uuid } });
      await tx.rolePermission.createMany({
        data: permissions.map((permission) => ({ role_uuid: organization_role_uuid, permission_uuid: permission.uuid })),
        skipDuplicates: true,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unexpected role error';
    throw new BadRequestException(message);
  }
}
