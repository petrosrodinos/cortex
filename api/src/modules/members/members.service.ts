import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { CreateJwtService } from '@/shared/utils/jwt/jwt.service';
import { AuthRoles } from '@/modules/auth/interfaces/auth.interface';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AppUrls } from '@/shared/config/app-urls';
import { MemberInvitationMailService } from './services/member-invitation-mail.service';
import { OrganizationMemberStatus } from 'generated/prisma';

const INVITATION_TOKEN_TYPE = 'organization_invitation';

@Injectable()
export class MembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations_service: OrganizationsService,
    private readonly jwt_service: CreateJwtService,
    private readonly member_invitation_mail_service: MemberInvitationMailService,
    private readonly config_service: ConfigService,
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
      const normalized_email = dto.email.trim().toLowerCase();
      const inviter = await this.prisma.user.findUnique({ where: { uuid: user_uuid } });

      if (!inviter) {
        throw new NotFoundException('Inviting user not found');
      }

      if (inviter.email === normalized_email) {
        throw new BadRequestException('You cannot invite yourself');
      }

      let user = await this.prisma.user.findUnique({ where: { email: normalized_email } });
      const has_registered_account = Boolean(user?.password);

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: normalized_email,
            password: '',
            role: AuthRoles.USER,
          },
        });
      }

      const member = await this.prisma.organizationMember.upsert({
        where: {
          org_uuid_user_uuid: {
            org_uuid: organization.uuid,
            user_uuid: user.uuid,
          },
        },
        create: {
          org_uuid: organization.uuid,
          user_uuid: user.uuid,
          role_uuid: role.uuid,
          status: has_registered_account ? OrganizationMemberStatus.ACTIVE : OrganizationMemberStatus.INVITED,
          joined_at: has_registered_account ? new Date() : null,
        },
        update: {
          role_uuid: role.uuid,
          status: has_registered_account ? OrganizationMemberStatus.ACTIVE : OrganizationMemberStatus.INVITED,
          joined_at: has_registered_account ? new Date() : null,
        },
        include: { role: true, user: true },
      });

      if (!has_registered_account) {
        await this.sendInvitationEmail(user_uuid, organization, member, user);
      }

      return member;
    } catch (error) {
      this.handleError(error);
    }
  }

  async resendInvitation(user_uuid: string, organization_uuid: string, organization_member_uuid: string) {
    try {
      const { organization, member } = await this.requirePendingInvitationMember(
        user_uuid,
        organization_uuid,
        organization_member_uuid,
      );

      await this.sendInvitationEmail(user_uuid, organization, member, member.user);

      return member;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getInvitationUrl(user_uuid: string, organization_uuid: string, organization_member_uuid: string) {
    try {
      const { organization, member } = await this.requirePendingInvitationMember(
        user_uuid,
        organization_uuid,
        organization_member_uuid,
      );

      const invitation_token = await this.createInvitationToken(organization, member, member.user);

      return { invitation_url: AppUrls.invitationSignUp(invitation_token) };
    } catch (error) {
      this.handleError(error);
    }
  }

  private async sendInvitationEmail(
    inviter_user_uuid: string,
    organization: { uuid: string; name: string },
    member: { uuid: string },
    invited_user: { uuid: string; email: string },
  ) {
    const inviter = await this.prisma.user.findUnique({ where: { uuid: inviter_user_uuid } });

    if (!inviter) {
      throw new NotFoundException('Inviting user not found');
    }

    const invitation_token = await this.createInvitationToken(organization, member, invited_user);

    await this.member_invitation_mail_service.sendInvitationEmail({
      to: invited_user.email,
      organization_name: organization.name,
      inviter_email: inviter.email,
      invitation_token,
    });
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

  private async requirePendingInvitationMember(
    user_uuid: string,
    organization_uuid: string,
    organization_member_uuid: string,
  ) {
    await this.requireManager(user_uuid, organization_uuid);
    const organization = await this.getOrganization(organization_uuid);
    const member = await this.prisma.organizationMember.findFirst({
      where: { uuid: organization_member_uuid, org_uuid: organization.uuid },
      include: { role: true, user: true },
    });

    if (!member) {
      throw new NotFoundException('Member not found in this organization');
    }

    if (member.status !== OrganizationMemberStatus.INVITED) {
      throw new BadRequestException('Only invited members have an invitation link');
    }

    if (member.user.password) {
      throw new BadRequestException('This member already has an account');
    }

    return { organization, member };
  }

  private async createInvitationToken(
    organization: { uuid: string },
    member: { uuid: string },
    invited_user: { uuid: string; email: string },
  ) {
    return this.jwt_service.signToken(
      {
        type: INVITATION_TOKEN_TYPE,
        member_uuid: member.uuid,
        user_uuid: invited_user.uuid,
        email: invited_user.email,
        organization_uuid: organization.uuid,
      },
      this.config_service.get<string>('JWT_INVITATION_EXPIRATION_TIME') ?? '7d',
    );
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
