import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { IntegrationRegistry } from '@/modules/integrations/framework/registry/integration-registry.service';
import { IntegrationProvider, IntegrationStatus, OrganizationMemberStatus } from 'generated/prisma';

const EMAIL_PROVIDER_ACTIONS: Array<{ provider: IntegrationProvider; actionKey: string }> = [
  { provider: IntegrationProvider.SENDGRID, actionKey: 'send_email' },
  { provider: IntegrationProvider.RESEND, actionKey: 'send_email' },
  { provider: IntegrationProvider.SMTP, actionKey: 'send_email' },
  { provider: IntegrationProvider.GMAIL, actionKey: 'send_message' },
];

export interface OrganizationToolsContext {
  organizationUuid: string;
  userUuid: string;
  userPermissions: string[];
}

@Injectable()
export class OrganizationToolsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly integrationRegistry: IntegrationRegistry,
  ) {}

  async getAccount(context: OrganizationToolsContext) {
    const membership = await this.requireActiveMembership(context);
    this.assertPermission(membership, 'org:read', context.userPermissions);

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
        member_uuid: membership.uuid,
        role: membership.role.name,
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

  async sendMemberEmail(
    context: OrganizationToolsContext,
    input: {
      member_uuid?: string;
      email?: string;
      subject: string;
      body: string;
      cc?: string;
      bcc?: string;
      reply_to?: string;
    },
  ) {
    const membership = await this.requireActiveMembership(context);
    this.assertPermission(membership, 'org:members:read', context.userPermissions);

    const member = await this.resolveMember(context.organizationUuid, input.member_uuid, input.email);

    if (member.status !== OrganizationMemberStatus.ACTIVE) {
      throw new BadRequestException('Email can only be sent to active organization members');
    }

    const recipientEmail = member.user?.email;
    if (!recipientEmail) {
      throw new NotFoundException('Member email is unavailable');
    }

    const emailRoute = await this.resolveEmailIntegration(context.organizationUuid);
    const payload = {
      to: recipientEmail,
      subject: input.subject,
      body: input.body,
      cc: input.cc,
      bcc: input.bcc,
      replyTo: input.reply_to,
    };

    const result = await this.integrationRegistry.executeTool(
      context.organizationUuid,
      emailRoute.toolName,
      payload,
    );

    return {
      recipient: {
        member_uuid: member.uuid,
        email: recipientEmail,
        role: member.role?.name,
      },
      provider: emailRoute.provider,
      result,
    };
  }

  private async resolveMember(organizationUuid: string, memberUuid?: string, email?: string) {
    if (!memberUuid && !email) {
      throw new BadRequestException('Provide member_uuid or email');
    }

    const member = await this.prisma.organizationMember.findFirst({
      where: {
        org_uuid: organizationUuid,
        ...(memberUuid ? { uuid: memberUuid } : {}),
        ...(email
          ? {
              user: {
                email: email.trim().toLowerCase(),
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

    return member;
  }

  private async resolveEmailIntegration(organizationUuid: string) {
    for (const route of EMAIL_PROVIDER_ACTIONS) {
      const integration = await this.prisma.integration.findFirst({
        where: {
          org_uuid: organizationUuid,
          provider: route.provider,
          status: IntegrationStatus.ACTIVE,
          actions: {
            some: {
              key: route.actionKey,
              enabled: true,
            },
          },
        },
      });

      if (integration) {
        return {
          provider: route.provider,
          toolName: `${route.provider.toLowerCase()}__${route.actionKey}`,
        };
      }
    }

    throw new NotFoundException(
      'No active email integration is configured. Connect SendGrid, Resend, SMTP, or Gmail to send emails.',
    );
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
    if (membership.role.name === 'Owner' || userPermissions.includes(permissionKey)) {
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