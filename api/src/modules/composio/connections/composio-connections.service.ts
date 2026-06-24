import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ComposioClientService } from '@/integrations/composio/composio-client.service';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  ComposioAccountStatus,
  ComposioConnectionTier,
  Prisma,
} from 'generated/prisma';
import { ComposioCallbackDto } from './dto/composio-callback.dto';
import { ConnectComposioDto } from './dto/connect-composio.dto';
import { OrgToolkitsService } from '../org-toolkits/org-toolkits.service';
import { resolveComposioAccountLabel } from '@/shared/services/ai/agents/tools/email-tool.utils';

type AuthUser = {
  uuid: string;
  organization_permissions?: string[];
};

@Injectable()
export class ComposioConnectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly composioClient: ComposioClientService,
    private readonly configService: ConfigService,
    private readonly orgToolkitsService: OrgToolkitsService,
  ) {}

  async connect(
    organizationUuid: string,
    user: AuthUser,
    dto: ConnectComposioDto,
  ) {
    const toolkit = await this.getEnabledToolkit(dto.toolkit_slug);
    const connectionTier = this.resolveConnectionTier(
      toolkit.connection_tiers,
      dto.connection_tier,
    );
    this.assertCanConnect(connectionTier, user);

    const composioUserId = this.buildComposioUserId(
      connectionTier,
      organizationUuid,
      user.uuid,
    );
    const composio = this.composioClient.getClient() as any;
    const authConfigId = await this.resolveAuthConfigId(toolkit);
    const callbackUrl = this.buildConnectCallbackUrl(toolkit.slug);
    const allowMultiple = this.supportsMultipleConnectionTiers(
      toolkit.connection_tiers,
    );

    if (!allowMultiple) {
      const existingAccount = await this.findActiveRemoteAccount(
        composioUserId,
        toolkit.slug,
      );

      if (existingAccount) {
        const mirrored = await this.upsertConnectedAccount(
          organizationUuid,
          user.uuid,
          toolkit,
          existingAccount,
          connectionTier,
          composioUserId,
        );
        await this.ensureOrgToolkitEnabled(organizationUuid, toolkit.slug);

        return {
          toolkit_slug: toolkit.slug,
          status: mirrored.status.toLowerCase(),
          connected_account_id: mirrored.composio_account_id,
        };
      }
    }

    const request = await composio.connectedAccounts.link(
      composioUserId,
      authConfigId,
      this.buildConnectLinkOptions(toolkit, callbackUrl),
    );
    const connectionRequestId = this.getConnectionRequestId(request);
    await this.audit(organizationUuid, user.uuid, {
      action: 'composio.connect_link_created',
      resourceType: 'composio_toolkit',
      resourceId: toolkit.slug,
      metadata: {
        toolkit_slug: toolkit.slug,
        connection_tier: connectionTier,
        auth_config_id: authConfigId,
        connection_request_id: connectionRequestId,
      },
    });

    return {
      redirect_url: request.redirectUrl ?? request.redirect_url,
      connection_request_id: connectionRequestId,
      toolkit_slug: toolkit.slug,
    };
  }

  async verifyCallback(
    organizationUuid: string,
    user: AuthUser,
    dto: ComposioCallbackDto,
  ) {
    const toolkit = await this.getEnabledToolkit(dto.toolkit_slug);
    const connectionTier = this.resolveConnectionTier(
      toolkit.connection_tiers,
      dto.connection_tier,
    );
    const composioUserId = this.buildComposioUserId(
      connectionTier,
      organizationUuid,
      user.uuid,
    );

    const composio = this.composioClient.getClient() as any;

    if (dto.connected_account_id) {
      try {
        const account = await composio.connectedAccounts.get(
          dto.connected_account_id,
        );
        const mirrored = await this.upsertConnectedAccount(
          organizationUuid,
          user.uuid,
          toolkit,
          account,
          connectionTier,
          composioUserId,
        );
        await this.ensureOrgToolkitEnabled(organizationUuid, toolkit.slug);
        await this.audit(organizationUuid, user.uuid, {
          action: 'composio.account_connected',
          resourceType: 'composio_account',
          resourceId: mirrored.composio_account_id,
          metadata: {
            toolkit_slug: toolkit.slug,
            status: mirrored.status,
          },
        });
        return {
          status: mirrored.status.toLowerCase(),
          connected_account_id: mirrored.composio_account_id,
          toolkit_slug: toolkit.slug,
        };
      } catch {
        // Fall back to wait/list below.
      }
    }

    if (dto.connection_request_id) {
      try {
        const account = await composio.connectedAccounts.waitForConnection(
          dto.connection_request_id,
          10_000,
        );
        const mirrored = await this.upsertConnectedAccount(
          organizationUuid,
          user.uuid,
          toolkit,
          account,
          connectionTier,
          composioUserId,
        );
        await this.ensureOrgToolkitEnabled(organizationUuid, toolkit.slug);
        await this.audit(organizationUuid, user.uuid, {
          action: 'composio.account_connected',
          resourceType: 'composio_account',
          resourceId: mirrored.composio_account_id,
          metadata: {
            toolkit_slug: toolkit.slug,
            status: mirrored.status,
          },
        });
        return {
          status: mirrored.status.toLowerCase(),
          connected_account_id: mirrored.composio_account_id,
          toolkit_slug: toolkit.slug,
        };
      } catch {
        // Fall back to listing below; OAuth providers sometimes complete before the request id is reusable.
      }
    }

    const accounts = await this.listRemoteAccounts(
      composioUserId,
      toolkit.slug,
    );
    const mirrored = await Promise.all(
      accounts.map((account) =>
        this.upsertConnectedAccount(
          organizationUuid,
          user.uuid,
          toolkit,
          account,
          connectionTier,
          composioUserId,
        ),
      ),
    );
    const active = mirrored.find(
      (account) => account.status === ComposioAccountStatus.ACTIVE,
    );
    const mirroredAccount = active ?? mirrored[0];

    if (mirroredAccount) {
      await this.ensureOrgToolkitEnabled(organizationUuid, toolkit.slug);
      await this.audit(organizationUuid, user.uuid, {
        action: 'composio.account_connected',
        resourceType: 'composio_account',
        resourceId: mirroredAccount.composio_account_id,
        metadata: {
          toolkit_slug: toolkit.slug,
          status: mirroredAccount.status,
        },
      });
    }

    return {
      status: active
        ? 'connected'
        : (mirrored[0]?.status?.toLowerCase() ?? 'pending'),
      connected_account_id: mirroredAccount?.composio_account_id,
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
            select: {
              uuid: true,
              slug: true,
              name: true,
              logo_url: true,
              connection_tiers: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
    };
  }

  async disconnect(
    organizationUuid: string,
    user: AuthUser,
    connectedAccountId: string,
  ) {
    const account = await this.prisma.composioConnectedAccount.findFirstOrThrow(
      {
        where: {
          composio_account_id: connectedAccountId,
          org_uuid: organizationUuid,
        },
        include: { toolkit: true },
      },
    );

    if (account.user_uuid && account.user_uuid !== user.uuid) {
      throw new ForbiddenException(
        'Cannot disconnect another user personal account',
      );
    }

    if (!account.user_uuid) {
      this.assertManagePermission(user);
    }

    await (this.composioClient.getClient() as any).connectedAccounts.delete(
      connectedAccountId,
    );
    await this.prisma.composioConnectedAccount.delete({
      where: { composio_account_id: connectedAccountId },
    });
    await this.audit(organizationUuid, user.uuid, {
      action: 'composio.account_disconnected',
      resourceType: 'composio_account',
      resourceId: connectedAccountId,
      metadata: {
        toolkit_slug: account.toolkit.slug,
        connection_tier: account.user_uuid
          ? ComposioConnectionTier.USER_PERSONAL
          : ComposioConnectionTier.ORG_SHARED,
      },
    });

    return { success: true };
  }

  async reconnect(
    organizationUuid: string,
    user: AuthUser,
    connectedAccountId: string,
  ) {
    const account = await this.prisma.composioConnectedAccount.findFirst({
      where: {
        composio_account_id: connectedAccountId,
        org_uuid: organizationUuid,
      },
      include: { toolkit: { select: { slug: true } } },
    });

    if (!account) {
      throw new NotFoundException('Connected account not found');
    }

    return this.connect(organizationUuid, user, {
      toolkit_slug: account.toolkit.slug,
      connection_tier: account.user_uuid
        ? ComposioConnectionTier.USER_PERSONAL
        : ComposioConnectionTier.ORG_SHARED,
    });
  }

  private async ensureOrgToolkitEnabled(
    organizationUuid: string,
    toolkitSlug: string,
  ): Promise<void> {
    await this.orgToolkitsService.enableToolkit(organizationUuid, toolkitSlug);
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

  private async resolveAuthConfigId(toolkit: {
    slug: string;
    auth_schemes: Prisma.JsonValue;
  }): Promise<string> {
    const composio = this.composioClient.getClient() as any;
    const configs = this.getListItems(
      await composio.authConfigs.list({ toolkit: toolkit.slug }),
    );
    const existing = this.pickAuthConfig(configs);

    if (existing) {
      return this.getAuthConfigId(existing)!;
    }

    try {
      const created = await composio.authConfigs.create(toolkit.slug, {
        type: 'use_composio_managed_auth',
        name: `${toolkit.slug} Composio auth`,
      });
      const authConfigId = this.getAuthConfigId(created);

      if (!authConfigId) {
        throw new BadRequestException(
          `Failed to resolve Composio auth config for toolkit "${toolkit.slug}"`,
        );
      }

      return authConfigId;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (this.isMissingManagedAuthConfigError(error)) {
        return this.createCustomAuthConfig(toolkit);
      }

      throw error;
    }
  }

  private async createCustomAuthConfig(toolkit: {
    slug: string;
    auth_schemes: Prisma.JsonValue;
  }): Promise<string> {
    const composio = this.composioClient.getClient() as any;
    const authScheme = this.resolveCustomAuthScheme(toolkit);

    if (!authScheme) {
      throw new BadRequestException(
        `Toolkit "${toolkit.slug}" does not support Composio-managed authentication and no supported custom auth scheme was found.`,
      );
    }

    const created = await composio.authConfigs.create(toolkit.slug, {
      type: 'use_custom_auth',
      name: `${toolkit.slug} user credentials`,
      authScheme,
      credentials: {},
    });
    const authConfigId = this.getAuthConfigId(created);

    if (!authConfigId) {
      throw new BadRequestException(
        `Failed to create custom auth config for toolkit "${toolkit.slug}"`,
      );
    }

    return authConfigId;
  }

  private resolveCustomAuthScheme(toolkit: {
    slug: string;
    auth_schemes: Prisma.JsonValue;
  }): string | undefined {
    const schemes = this.normalizeAuthSchemes(toolkit.auth_schemes);

    if (schemes.length > 0) {
      const nonOAuthScheme = schemes.find(
        (scheme) => !this.isOAuthAuthScheme(scheme),
      );

      if (nonOAuthScheme) {
        return nonOAuthScheme;
      }
    }

    return 'API_KEY';
  }

  private normalizeAuthSchemes(value: Prisma.JsonValue): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((scheme) => {
        if (typeof scheme === 'string') {
          return scheme.toUpperCase();
        }

        if (scheme && typeof scheme === 'object') {
          const authScheme =
            (scheme as { authScheme?: string; auth_scheme?: string })
              .authScheme ??
            (scheme as { authScheme?: string; auth_scheme?: string })
              .auth_scheme;

          return typeof authScheme === 'string'
            ? authScheme.toUpperCase()
            : undefined;
        }

        return undefined;
      })
      .filter((scheme): scheme is string => Boolean(scheme));
  }

  private isOAuthAuthScheme(authScheme: string): boolean {
    return authScheme.startsWith('OAUTH');
  }

  private pickAuthConfig(configs: any[]): any | undefined {
    const withId = configs.filter((config) => this.getAuthConfigId(config));

    if (withId.length === 0) {
      return undefined;
    }

    return (
      withId.find(
        (config) =>
          config.isComposioManaged === true ||
          config.is_composio_managed === true,
      ) ?? withId[0]
    );
  }

  private isMissingManagedAuthConfigError(error: unknown): boolean {
    const nestedError = (error as any)?.error?.error ?? (error as any)?.error;
    const slug = nestedError?.slug;

    if (slug === 'Auth_Config_DefaultAuthConfigNotFound') {
      return true;
    }

    const message =
      typeof nestedError?.message === 'string'
        ? nestedError.message
        : typeof (error as any)?.message === 'string'
          ? (error as any).message
          : '';

    return message.includes('Default auth config not found');
  }

  private buildConnectLinkOptions(
    toolkit: { connection_tiers: ComposioConnectionTier[] },
    callbackUrl?: string,
  ): Record<string, unknown> | undefined {
    const options: Record<string, unknown> = {};

    if (callbackUrl) {
      options.callbackUrl = callbackUrl;
    }

    if (this.supportsMultipleConnectionTiers(toolkit.connection_tiers)) {
      options.allowMultiple = true;
    }

    return Object.keys(options).length > 0 ? options : undefined;
  }

  private supportsMultipleConnectionTiers(
    connectionTiers: ComposioConnectionTier[],
  ): boolean {
    return (
      connectionTiers.includes(ComposioConnectionTier.ORG_SHARED) &&
      connectionTiers.includes(ComposioConnectionTier.USER_PERSONAL)
    );
  }

  private async findActiveRemoteAccount(
    composioUserId: string,
    toolkitSlug: string,
  ): Promise<any | undefined> {
    const accounts = await this.listRemoteAccounts(composioUserId, toolkitSlug);

    return accounts.find(
      (account) =>
        this.mapStatus(account.status) === ComposioAccountStatus.ACTIVE,
    );
  }

  private buildConnectCallbackUrl(toolkitSlug: string): string | undefined {
    const appUrl = this.configService.get<string>('APP_URL');
    if (!appUrl) {
      return undefined;
    }

    const callback = new URL('/dashboard/integrations/callback', appUrl);
    callback.searchParams.set('toolkit_slug', toolkitSlug);
    return callback.toString();
  }

  private getConnectionRequestId(request: any): string | undefined {
    return (
      request?.id ??
      request?.connectedAccountId ??
      request?.connected_account_id ??
      request?.nanoid
    );
  }

  private getAuthConfigId(config: any): string | undefined {
    const authConfigId = config?.id ?? config?.nanoid ?? config?.authConfigId;
    return typeof authConfigId === 'string' && authConfigId.length > 0
      ? authConfigId
      : undefined;
  }

  private getListItems(page: any): any[] {
    if (Array.isArray(page)) {
      return page;
    }

    const items = page?.items ?? page?.data ?? [];
    return Array.isArray(items) ? items : [];
  }

  private async listRemoteAccounts(
    composioUserId: string,
    toolkitSlug: string,
  ): Promise<any[]> {
    const page = await (
      this.composioClient.getClient() as any
    ).connectedAccounts.list({
      userIds: [composioUserId],
      toolkitSlugs: [toolkitSlug],
    });

    return Array.isArray(page?.items)
      ? page.items
      : Array.isArray(page?.data)
        ? page.data
        : [];
  }

  private async upsertConnectedAccount(
    organizationUuid: string,
    userUuid: string,
    toolkit: { uuid: string; slug: string },
    account: any,
    connectionTier: ComposioConnectionTier,
    fallbackComposioUserId: string,
  ) {
    const composioAccountId = account.id ?? account.nanoid ?? account.uuid;
    const composioUserId =
      this.resolveComposioUserIdFromAccount(account) ?? fallbackComposioUserId;

    return this.prisma.composioConnectedAccount.upsert({
      where: { composio_account_id: composioAccountId },
      create: {
        composio_account_id: composioAccountId,
        composio_user_id: composioUserId,
        org_uuid: organizationUuid,
        user_uuid:
          connectionTier === ComposioConnectionTier.USER_PERSONAL
            ? userUuid
            : null,
        toolkit_uuid: toolkit.uuid,
        status: this.mapStatus(account.status),
        account_label: resolveComposioAccountLabel(account),
        last_synced_at: new Date(),
      },
      update: {
        composio_user_id: composioUserId,
        user_uuid:
          connectionTier === ComposioConnectionTier.USER_PERSONAL
            ? userUuid
            : null,
        status: this.mapStatus(account.status),
        account_label: resolveComposioAccountLabel(account),
        last_synced_at: new Date(),
      },
    });
  }

  private resolveComposioUserIdFromAccount(account: any): string | undefined {
    const candidates = [
      account?.userId,
      account?.user_id,
      account?.clientUniqueUserId,
      account?.client_unique_user_id,
      account?.entityId,
      account?.entity_id,
      account?.memberEntityId,
      account?.member_entity_id,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.length > 0) {
        return candidate;
      }
    }

    return undefined;
  }

  private resolveConnectionTier(
    configuredTiers: ComposioConnectionTier[],
    requestedTier?: ComposioConnectionTier,
  ): ComposioConnectionTier {
    if (configuredTiers.length === 0) {
      throw new BadRequestException('Toolkit has no configured connection tiers');
    }

    if (requestedTier) {
      if (!configuredTiers.includes(requestedTier)) {
        throw new BadRequestException(
          'Requested connection tier is not enabled for this toolkit',
        );
      }

      return requestedTier;
    }

    if (configuredTiers.length === 1) {
      return configuredTiers[0];
    }

    throw new BadRequestException(
      'connection_tier is required when the toolkit supports multiple connection tiers',
    );
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

  private assertCanConnect(
    connectionTier: ComposioConnectionTier,
    user: AuthUser,
  ): void {
    if (connectionTier === ComposioConnectionTier.ORG_SHARED) {
      this.assertManagePermission(user);
    }
  }

  private assertManagePermission(user: AuthUser): void {
    if (!user.organization_permissions?.includes('org:integrations:manage')) {
      throw new ForbiddenException(
        'Missing organization integration management permission',
      );
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

  private async audit(
    organizationUuid: string,
    userUuid: string,
    event: {
      action: string;
      resourceType: string;
      resourceId?: string | null;
      metadata?: Record<string, unknown>;
    },
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          org_uuid: organizationUuid,
          user_uuid: userUuid,
          action: event.action,
          resource_type: event.resourceType,
          resource_id: event.resourceId,
          metadata: (event.metadata ?? {}) as Prisma.InputJsonValue,
        },
      });
    } catch {
      return;
    }
  }
}
