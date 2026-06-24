import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationMemberStatus, IntegrationStatus } from 'generated/prisma';
import { AgentActorService } from '../actor/agent-actor.service';
import { OrganizationRoleTypes } from '@/modules/roles/permissions';

export interface OrganizationToolsContext {
  organizationUuid: string;
  userUuid: string;
  userPermissions: string[];
}

@Injectable()
export class OrganizationToolsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly agentActor: AgentActorService,
  ) {}

  async getAccount(context: OrganizationToolsContext) {
    const actor = await this.agentActor.resolve(context.userUuid, context.organizationUuid);
    this.assertPermission({ role: { name: actor.roleName } }, 'org:read', context.userPermissions);

    const organization = await this.prisma.organization.findUnique({
      where: { uuid: context.organizationUuid },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const [memberCount, activeIntegrationCount] = await Promise.all([
      this.prisma.organizationMember.count({
        where: { org_uuid: context.organizationUuid, status: OrganizationMemberStatus.ACTIVE },
      }),
      this.prisma.integration.count({
        where: { org_uuid: context.organizationUuid, status: IntegrationStatus.ACTIVE },
      }),
    ]);

    return {
      uuid: organization.uuid,
      name: organization.name,
      slug: organization.slug,
      logo_url: organization.logo_url,
      created_at: organization.created_at,
      updated_at: organization.updated_at,
      active_member_count: memberCount,
      active_integration_count: activeIntegrationCount,
      current_user: {
        member_uuid: actor.memberUuid,
        email: actor.email,
        role: actor.roleName,
      },
    };
  }

  async listMembers(
    context: OrganizationToolsContext,
    input: { search?: string; status?: OrganizationMemberStatus },
  ) {
    const membership = await this.requireActiveMembership(context);
    this.assertPermission(membership, 'org:members:read', context.userPermissions);

    const members = await this.prisma.organizationMember.findMany({
      where: {
        org_uuid: context.organizationUuid,
        ...(input.status ? { status: input.status } : {}),
        ...(input.search
          ? {
              user: {
                email: { contains: input.search, mode: 'insensitive' },
              },
            }
          : {}),
      },
      include: {
        role: true,
        user: { select: { uuid: true, email: true } },
      },
      orderBy: { invited_at: 'desc' },
    });

    return {
      members: members.map((member) => this.serializeMember(member)),
    };
  }

  async getMember(context: OrganizationToolsContext, input: { member_uuid?: string; email?: string }) {
    const membership = await this.requireActiveMembership(context);
    this.assertPermission(membership, 'org:members:read', context.userPermissions);

    if (!input.member_uuid && !input.email) {
      throw new BadRequestException('Provide member_uuid or email');
    }

    const member = await this.prisma.organizationMember.findFirst({
      where: {
        org_uuid: context.organizationUuid,
        ...(input.member_uuid ? { uuid: input.member_uuid } : {}),
        ...(input.email
          ? {
              user: {
                email: input.email.trim().toLowerCase(),
              },
            }
          : {}),
      },
      include: {
        role: true,
        user: { select: { uuid: true, email: true } },
      },
    });

    if (!member) {
      throw new NotFoundException('Organization member not found');
    }

    return { member: this.serializeMember(member) };
  }

  private async requireActiveMembership(context: OrganizationToolsContext) {
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        user_uuid: context.userUuid,
        org_uuid: context.organizationUuid,
        status: OrganizationMemberStatus.ACTIVE,
      },
      include: {
        role: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    return membership;
  }

  private assertPermission(
    membership: { role: { name: string } },
    permissionKey: string,
    userPermissions: string[],
  ) {
    if (membership.role.name === OrganizationRoleTypes.OWNER || userPermissions.includes(permissionKey)) {
      return;
    }

    throw new ForbiddenException(`Missing permission: ${permissionKey}`);
  }

  private serializeMember(member: {
    uuid: string;
    status: OrganizationMemberStatus;
    invited_at: Date;
    joined_at: Date | null;
    role?: { uuid: string; name: string } | null;
    user?: { uuid: string; email: string } | null;
  }) {
    return {
      member_uuid: member.uuid,
      status: member.status,
      invited_at: member.invited_at,
      joined_at: member.joined_at,
      role: member.role
        ? {
            uuid: member.role.uuid,
            name: member.role.name,
          }
        : null,
      user: member.user
        ? {
            uuid: member.user.uuid,
            email: member.user.email,
          }
        : null,
    };
  }
}
