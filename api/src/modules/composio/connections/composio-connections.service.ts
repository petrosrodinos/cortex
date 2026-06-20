import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ComposioClientService } from '@/integrations/composio/composio-client.service';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ComposioAccountStatus, ComposioConnectionTier } from 'generated/prisma';
import { ComposioCallbackDto } from './dto/composio-callback.dto';
import { ConnectComposioDto } from './dto/connect-composio.dto';

type AuthUser = {
  uuid: string;
  organization_permissions?: string[];
};

@Injectable()
export class ComposioConnectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly composioClient: ComposioClientService,
  ) {}

  async connect(organizationUuid: string, user: AuthUser, dto: ConnectComposioDto) {
    const toolkit = await this.getEnabledToolkit(dto.toolkit_slug);
    this.assertCanConnect(toolkit.connection_tier, user);

    const composioUserId = this.buildComposioUserId(toolkit.connection_tier, organizationUuid, user.uuid);
    const request = await (this.composioClient.getClient() as any).toolkits.authorize(
      composioUserId,
      toolkit.slug,
    );

    return {
      redirect_url: request.redirectUrl ?? request.redirect_url,
      connection_request_id: request.id ?? request.nanoid ?? request.connectedAccountId,
      toolkit_slug: toolkit.slug,
    };
  }

  async verifyCallback(organizationUuid: string, user: AuthUser, dto: ComposioCallbackDto) {
    const toolkit = await this.getEnabledToolkit(dto.toolkit_slug);
    const composioUserId = this.buildComposioUserId(toolkit.connection_tier, organizationUuid, user.uuid);

    if (dto.connection_request_id) {
      try {
        const account = await (this.composioClient.getClient() as any).connectedAccounts.waitForConnection(
          dto.connection_request_id,
          10_000,
        );
        const mirrored = await this.upsertConnectedAccount(organizationUuid, user.uuid, toolkit, account);
        return { status: mirrored.status.toLowerCase(), connected_account_id: mirrored.composio_account_id };
      } catch {
        // Fall back to listing below; OAuth providers sometimes complete before the request id is reusable.
      }
    }

    const accounts = await this.listRemoteAccounts(composioUserId, toolkit.slug);
    const mirrored = await Promise.all(
      accounts.map((account) => this.upsertConnectedAccount(organizationUuid, user.uuid, toolkit, account)),
    );
    const active = mirrored.find((account) => account.status === ComposioAccountStatus.ACTIVE);

    return {
      status: active ? 'connected' : mirrored[0]?.status?.toLowerCase() ?? 'pending',
      connected_account_id: active?.composio_account_id ?? mirrored[0]?.composio_account_id,
      toolkit_slug: toolkit.slug,
    };
  }

  async listAccounts(organizationUuid: string, toolkitSlug?: string) {
    const toolkit = toolkitSlug
      ? await this.prisma.composioToolkit.findUniqueOrThrow({
          where: { slug: toolkitSlug },
          select: { uuid: true },
        })
      : null;

    return {
      data: await this.prisma.composioConnectedAccount.findMany({
        where: {
          org_uuid: organizationUuid,
          ...(toolkit ? { toolkit_uuid: toolkit.uuid } : {}),
        },
        include: {
          toolkit: {
            select: { uuid: true, slug: true, name: true, logo_url: true, connection_tier: true },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
    };
  }

  async disconnect(organizationUuid: string, user: AuthUser, connectedAccountId: string) {
    const account = await this.prisma.composioConnectedAccount.findFirstOrThrow({
      where: { composio_account_id: connectedAccountId, org_uuid: organizationUuid },
      include: { toolkit: true },
    });

    if (account.toolkit.connection_tier === ComposioConnectionTier.USER_PERSONAL && account.user_uuid !== user.uuid) {
      throw new ForbiddenException('Cannot disconnect another user personal account');
    }

    if (account.toolkit.connection_tier === ComposioConnectionTier.ORG_SHARED) {
      this.assertManagePermission(user);
    }

    await (this.composioClient.getClient() as any).connectedAccounts.delete(connectedAccountId);
    await this.prisma.composioConnectedAccount.delete({
      where: { composio_account_id: connectedAccountId },
    });

    return { success: true };
  }

  async reconnect(organizationUuid: string, user: AuthUser, connectedAccountId: string) {
    const account = await this.prisma.composioConnectedAccount.findFirst({
      where: { composio_account_id: connectedAccountId, org_uuid: organizationUuid },
      include: { toolkit: { select: { slug: true } } },
    });

    if (!account) {
      throw new NotFoundException('Connected account not found');
    }

    return this.connect(organizationUuid, user, { toolkit_slug: account.toolkit.slug });
  }

  private async getEnabledToolkit(toolkitSlug: string) {
    const toolkit = await this.prisma.composioToolkit.findUnique({
      where: { slug: toolkitSlug },
    });

    if (!toolkit || !toolkit.is_enabled) {
      throw new NotFoundException('Composio toolkit is not enabled');
    }

    return toolkit;
  }

  private async listRemoteAccounts(composioUserId: string, toolkitSlug: string): Promise<any[]> {
    const page = await (this.composioClient.getClient() as any).connectedAccounts.list({
      userIds: [composioUserId],
      toolkitSlugs: [toolkitSlug],
    });

    return Array.isArray(page?.items) ? page.items : Array.isArray(page?.data) ? page.data : [];
  }

  private async upsertConnectedAccount(
    organizationUuid: string,
    userUuid: string,
    toolkit: { uuid: string; slug: string },
    account: any,
  ) {
    const composioAccountId = account.id ?? account.nanoid ?? account.uuid;
    const composioUserId = account.userId ?? account.user_id ?? account.clientUniqueUserId;

    return this.prisma.composioConnectedAccount.upsert({
      where: { composio_account_id: composioAccountId },
      create: {
        composio_account_id: composioAccountId,
        composio_user_id: composioUserId,
        org_uuid: organizationUuid,
        user_uuid: composioUserId?.startsWith('user:') ? userUuid : null,
        toolkit_uuid: toolkit.uuid,
        status: this.mapStatus(account.status),
        account_label: account.name ?? account.label ?? account.email ?? account.status,
        last_synced_at: new Date(),
      },
      update: {
        composio_user_id: composioUserId,
        status: this.mapStatus(account.status),
        account_label: account.name ?? account.label ?? account.email ?? account.status,
        last_synced_at: new Date(),
      },
    });
  }

  private buildComposioUserId(
    connectionTier: ComposioConnectionTier,
    organizationUuid: string,
    userUuid: string,
  ): string {
    return connectionTier === ComposioConnectionTier.ORG_SHARED
      ? `org:${organizationUuid}`
      : `user:${userUuid}`;
  }

  private assertCanConnect(connectionTier: ComposioConnectionTier, user: AuthUser): void {
    if (connectionTier === ComposioConnectionTier.ORG_SHARED) {
      this.assertManagePermission(user);
    }
  }

  private assertManagePermission(user: AuthUser): void {
    if (!user.organization_permissions?.includes('org:integrations:manage')) {
      throw new ForbiddenException('Missing organization integration management permission');
    }
  }

  private mapStatus(status: string | undefined): ComposioAccountStatus {
    const normalized = status?.toUpperCase();

    if (normalized === 'ACTIVE') {
      return ComposioAccountStatus.ACTIVE;
    }

    if (normalized === 'EXPIRED') {
      return ComposioAccountStatus.EXPIRED;
    }

    if (normalized === 'INACTIVE' || normalized === 'DISABLED') {
      return ComposioAccountStatus.INACTIVE;
    }

    return ComposioAccountStatus.PENDING;
  }
}
