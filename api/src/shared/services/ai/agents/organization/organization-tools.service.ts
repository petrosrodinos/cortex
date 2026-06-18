import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { IntegrationRegistry } from '@/modules/integrations/framework/registry/integration-registry.service';
import { IntegrationProvider, IntegrationStatus, OrganizationMemberStatus } from 'generated/prisma';
import { AgentActorService } from '../actor/agent-actor.service';

const EMAIL_PROVIDER_ACTIONS: Array<{
  provider: IntegrationProvider;
  actionKey: string;
  attachmentActionKey?: string;
}> = [
  {
    provider: IntegrationProvider.SENDGRID,
    actionKey: 'send_email',
    attachmentActionKey: 'send_email_with_attachments',
  },
  {
    provider: IntegrationProvider.RESEND,
    actionKey: 'send_email',
    attachmentActionKey: 'send_email_with_attachments',
  },
  {
    provider: IntegrationProvider.SMTP,
    actionKey: 'send_email',
    attachmentActionKey: 'send_email_with_attachments',
  },
  { provider: IntegrationProvider.GMAIL, actionKey: 'send_message' },
];

export interface OrganizationToolsContext {
  organizationUuid: string;
  userUuid: string;
  userPermissions: string[];
}

export type OrganizationEmailRecipientType = 'self' | 'member';

@Injectable()
export class OrganizationToolsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly integrationRegistry: IntegrationRegistry,
    private readonly gcs: GcsService,
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

  async sendEmail(
    context: OrganizationToolsContext,
    input: {
      recipient_type: OrganizationEmailRecipientType;
      member_uuid?: string;
      subject: string;
      body: string;
      cc?: string;
      bcc?: string;
      reply_to?: string;
      attachment_document_uuids?: string[];
    },
  ) {
    const membership = await this.requireActiveMembership(context);
    this.assertPermission(membership, 'org:members:read', context.userPermissions);

    const actor = await this.agentActor.resolve(context.userUuid, context.organizationUuid);
    const attachments = await this.loadAttachments(context.userUuid, input.attachment_document_uuids ?? []);

    let recipientEmail: string;
    let recipient: {
      type: OrganizationEmailRecipientType;
      member_uuid: string;
      email: string;
      role?: string | null;
    };

    if (input.recipient_type === 'self') {
      recipientEmail = actor.email;
      recipient = {
        type: 'self',
        member_uuid: actor.memberUuid,
        email: actor.email,
        role: actor.roleName,
      };
    } else {
      if (!input.member_uuid) {
        throw new BadRequestException('member_uuid is required when recipient_type is member');
      }

      const member = await this.resolveMember(context.organizationUuid, input.member_uuid);

      if (member.status !== OrganizationMemberStatus.ACTIVE) {
        throw new BadRequestException('Email can only be sent to active organization members');
      }

      const memberEmail = member.user?.email;
      if (!memberEmail) {
        throw new NotFoundException('Member email is unavailable');
      }

      recipientEmail = memberEmail;
      recipient = {
        type: 'member',
        member_uuid: member.uuid,
        email: memberEmail,
        role: member.role?.name ?? null,
      };
    }

    const emailRoute = await this.resolveEmailIntegration(context.organizationUuid, attachments.length > 0);
    const payload =
      attachments.length > 0
        ? {
            to: recipientEmail,
            subject: input.subject,
            body: input.body,
            cc: input.cc,
            bcc: input.bcc,
            replyTo: input.reply_to,
            attachments,
          }
        : {
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
      recipient,
      attachments: attachments.map((attachment) => attachment.filename),
      provider: emailRoute.provider,
      result,
    };
  }

  private async loadAttachments(userUuid: string, documentUuids: string[]) {
    if (!documentUuids.length) {
      return [] as Array<{ filename: string; content: string; encoding: 'base64' }>;
    }

    const uniqueUuids = [...new Set(documentUuids)];
    const documents = await this.prisma.document.findMany({
      where: {
        uuid: { in: uniqueUuids },
        user_uuid: userUuid,
      },
    });

    if (documents.length !== uniqueUuids.length) {
      throw new NotFoundException('One or more attachment documents were not found or are not accessible');
    }

    const attachments = await Promise.all(
      documents.map(async (document) => {
        const downloaded = await this.gcs.downloadImage({ filename: document.path });
        return {
          filename: document.filename,
          content: downloaded.buffer.toString('base64'),
          encoding: 'base64' as const,
        };
      }),
    );

    return attachments;
  }

  private async resolveMember(organizationUuid: string, memberUuid: string) {
    const member = await this.prisma.organizationMember.findFirst({
      where: {
        org_uuid: organizationUuid,
        uuid: memberUuid,
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

  private async resolveEmailIntegration(organizationUuid: string, withAttachments: boolean) {
    for (const route of EMAIL_PROVIDER_ACTIONS) {
      const actionKey =
        withAttachments && route.attachmentActionKey ? route.attachmentActionKey : route.actionKey;

      if (withAttachments && !route.attachmentActionKey) {
        continue;
      }

      const integration = await this.prisma.integration.findFirst({
        where: {
          org_uuid: organizationUuid,
          provider: route.provider,
          status: IntegrationStatus.ACTIVE,
          actions: {
            some: {
              key: actionKey,
              enabled: true,
            },
          },
        },
      });

      if (integration) {
        return {
          provider: route.provider,
          toolName: `${route.provider.toLowerCase()}__${actionKey}`,
        };
      }
    }

    if (withAttachments) {
      throw new NotFoundException(
        'No active email integration with attachment support is configured. Connect SendGrid, Resend, or SMTP.',
      );
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
