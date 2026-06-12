import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { OrganizationMemberStatus } from 'generated/prisma';

@Injectable()
export class MembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations_service: OrganizationsService,
  ) {}

  async findAll(user_uuid: string, organization_uuid: string) {
    try {
      await this.organizations_service.requireActiveMember(user_uuid, organization_uuid);

      return await this.prisma.organizationMember.findMany({
        where: { organization: { uuid: organization_uuid } },
        include: { role: true, user: true },
        orderBy: { invited_at: 'desc' },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async invite(user_uuid: string, organization_uuid: string, dto: InviteMemberDto) {
    try {
      await this.requireManager(user_uuid, organization_uuid);
      const organization = await this.getOrganization(organization_uuid);
      const role = await this.getOrganizationRole(organization.uuid, dto.organization_role_uuid);
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

      if (!user) {
        throw new NotFoundException('User must register before they can be invited');
      }

      return await this.prisma.organizationMember.create({
        data: {
          org_uuid: organization.uuid,
          user_uuid: user.uuid,
          role_uuid: role.uuid,
          status: OrganizationMemberStatus.INVITED,
        },
        include: { role: true, user: true },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(user_uuid: string, organization_uuid: string, organization_member_uuid: string, dto: UpdateMemberDto) {
    try {
      await this.requireManager(user_uuid, organization_uuid);
      const organization = await this.getOrganization(organization_uuid);
      const member = await this.getOrganizationMember(organization.uuid, organization_member_uuid);
      const data: any = {};

      if (dto.organization_role_uuid) {
        const role = await this.getOrganizationRole(organization.uuid, dto.organization_role_uuid);
        data.role_uuid = role.uuid;
      }

      if (dto.status) {
        data.status = dto.status;
        data.joined_at = dto.status === OrganizationMemberStatus.ACTIVE ? new Date() : undefined;
      }

      if (Object.keys(data).length === 0) {
        throw new BadRequestException('No member updates provided');
      }

      return await this.prisma.organizationMember.update({
        where: { uuid: member.uuid },
        data,
        include: { role: true, user: true },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(user_uuid: string, organization_uuid: string, organization_member_uuid: string) {
    try {
      await this.requireManager(user_uuid, organization_uuid);
      const organization = await this.getOrganization(organization_uuid);
      const member = await this.getOrganizationMember(organization.uuid, organization_member_uuid);

      if (member.role?.name === 'Owner') {
        throw new ForbiddenException('Organization owners cannot be removed');
      }

      return await this.prisma.organizationMember.delete({
        where: { uuid: member.uuid },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private async requireManager(user_uuid: string, organization_uuid: string) {
    try {
      const membership = await this.organizations_service.requireActiveMember(user_uuid, organization_uuid);
      const permissions = membership.role.permissions?.map((role_permission) => role_permission.permission.key) ?? [];

      if (membership.role.name !== 'Owner' && !permissions.includes('org:members:update')) {
        throw new ForbiddenException('Missing organization member permission');
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private async getOrganization(organization_uuid: string) {
    try {
      const organization = await this.prisma.organization.findUnique({ where: { uuid: organization_uuid } });

      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      return organization;
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

  private async getOrganizationMember(organization_uuid: string, organization_member_uuid: string) {
    try {
      const member = await this.prisma.organizationMember.findFirst({
        where: { uuid: organization_member_uuid, org_uuid: organization_uuid },
        include: { role: true },
      });

      if (!member) {
        throw new NotFoundException('Member not found in this organization');
      }

      return member;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof HttpException) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unexpected member error';
    throw new BadRequestException(message);
  }
}
