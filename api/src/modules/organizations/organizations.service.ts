import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  getInitialRolePermissionKeys,
  OrganizationRoleTypes,
  PermissionKeys,
  SYSTEM_ROLE_NAMES,
} from '@/modules/roles/permissions';
import { membershipHasPermission } from '@/shared/utils/organization-permission.utils';
import { OrganizationMemberStatus } from 'generated/prisma';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user_uuid: string, dto: CreateOrganizationDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
          data: {
            user_uuid,
            name: dto.name,
            logo_url: dto.logo_url,
            slug: await this.createUniqueSlug(dto.name, tx),
          },
        });

        await tx.organizationRole.createMany({
          data: SYSTEM_ROLE_NAMES.map((name) => ({
            org_uuid: organization.uuid,
            name,
            is_system: true,
          })),
        });

        const permissions = await tx.permission.findMany();
        const permissions_by_key = new Map(permissions.map((permission) => [permission.key, permission.uuid]));
        const roles = await tx.organizationRole.findMany({ where: { org_uuid: organization.uuid } });

        await tx.rolePermission.createMany({
          data: roles.flatMap((role) => {
            const permission_keys = getInitialRolePermissionKeys(
              role.name,
              permissions.map((permission) => permission.key),
            );

            return permission_keys
              .map((permission_key) => permissions_by_key.get(permission_key))
              .filter(Boolean)
              .map((permission_uuid) => ({ role_uuid: role.uuid, permission_uuid }));
          }),
          skipDuplicates: true,
        });

        const owner_role = await tx.organizationRole.findFirst({
          where: { org_uuid: organization.uuid, name: OrganizationRoleTypes.OWNER },
        });

        await tx.organizationMember.create({
          data: {
            org_uuid: organization.uuid,
            user_uuid: user_uuid,
            role_uuid: owner_role.uuid,
            status: OrganizationMemberStatus.ACTIVE,
            joined_at: new Date(),
          },
        });

        return organization;
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(user_uuid: string) {
    try {
      return await this.prisma.organization.findMany({
        where: {
          members: {
            some: {
              user_uuid: user_uuid,
              status: OrganizationMemberStatus.ACTIVE,
            },
          },
        },
        include: {
          members: {
            where: { user_uuid: user_uuid },
            include: { role: true },
          },
        },
        orderBy: { created_at: 'asc' },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(user_uuid: string, organization_uuid: string) {
    try {
      await this.requireActiveMember(user_uuid, organization_uuid);

      return await this.prisma.organization.findUnique({
        where: { uuid: organization_uuid },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(user_uuid: string, organization_uuid: string, dto: UpdateOrganizationDto) {
    try {
      const membership = await this.requireActiveMember(user_uuid, organization_uuid);
      this.requirePermissionOrOwner(membership, PermissionKeys.ORG_UPDATE);

      const data: UpdateOrganizationDto = { ...dto };

      if (dto.slug !== undefined) {
        const slug = this.normalizeSlug(dto.slug);

        if (slug.length < 2) {
          throw new BadRequestException('Slug must be at least 2 characters');
        }

        const existing = await this.prisma.organization.findFirst({
          where: {
            slug,
            NOT: { uuid: organization_uuid },
          },
        });

        if (existing) {
          throw new ConflictException('Organization slug is already taken');
        }

        data.slug = slug;
      }

      return await this.prisma.organization.update({
        where: { uuid: organization_uuid },
        data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(user_uuid: string, organization_uuid: string) {
    try {
      const membership = await this.requireActiveMember(user_uuid, organization_uuid);

      if (membership.role.name !== OrganizationRoleTypes.OWNER) {
        throw new ForbiddenException('Only organization owners can delete organizations');
      }

      const active_organization_count = await this.prisma.organization.count({
        where: {
          members: {
            some: {
              user_uuid: user_uuid,
              status: OrganizationMemberStatus.ACTIVE,
            },
          },
        },
      });

      if (active_organization_count <= 1) {
        throw new BadRequestException('You must keep at least one organization');
      }

      return await this.prisma.organization.delete({
        where: { uuid: organization_uuid },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async requireActiveMember(user_uuid: string, organization_uuid: string) {
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

      return membership;
    } catch (error) {
      this.handleError(error);
    }
  }

  hasPermission(membership: { role: { name: string; permissions?: Array<{ permission: { key: string } }> } }, permission_key: string) {
    return membershipHasPermission(membership, permission_key);
  }

  private requirePermissionOrOwner(membership: any, permission_key: string) {
    try {
      if (!this.hasPermission(membership, permission_key)) {
        throw new ForbiddenException('Missing organization permission');
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private normalizeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'organization';
  }

  private async createUniqueSlug(name: string, tx: any) {
    try {
      const base_slug = this.normalizeSlug(name);

      for (let attempt = 0; attempt < 10; attempt += 1) {
        const slug = attempt === 0 ? base_slug : `${base_slug}-${Math.random().toString(36).slice(2, 8)}`;
        const existing = await tx.organization.findFirst({ where: { slug } });

        if (!existing) {
          return slug;
        }
      }

      throw new NotFoundException('Unable to create a unique organization slug');
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unexpected organization error';
    throw new BadRequestException(message);
  }
}
