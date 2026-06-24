import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ComposioClientService } from '@/integrations/composio/composio-client.service';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  ComposioAccountStatus,
  ComposioConnectionTier,
} from 'generated/prisma';
import {
  inferConnectionTierFromAccount,
  normalizeToolkitConnectionTierMap,
  resolveToolkitConnectionTiers,
} from '@/shared/services/ai/agents/capabilities/toolkit-connection-tiers.utils';
import {
  allTieredToolkitsHaveConnectedAccounts,
  filterToolkitsForComposioUserId,
  isAccountTierCompatibleWithComposioUserId,
  mergeConnectionTierMaps,
  resolveComposioUserIdFromTierMap,
} from './composio-session-scope.utils';

@Injectable()
export class ComposioSessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly composioClient: ComposioClientService,
  ) {}

  async resolveSession(
    conversationUuid: string,
    organizationUuid: string,
    userUuid: string,
    toolkitSlugs?: string[],
    toolkitConnectionTiers?: Record<string, ComposioConnectionTier | string>,
  ) {
    const normalizedToolkitConnectionTiers = normalizeToolkitConnectionTierMap(
      toolkitConnectionTiers,
    );
    const conversation = await this.prisma.conversation.findFirstOrThrow({
      where: {
        uuid: conversationUuid,
        org_uuid: organizationUuid,
        user_uuid: userUuid,
      },
      select: { uuid: true, composio_session_id: true },
    });
    const enabledToolkitSlugs = await this.getEnabledToolkitSlugs(
      organizationUuid,
      toolkitSlugs,
    );
    const autoResolvedTierMap = (
      await this.resolveConnectionTierMap(
        organizationUuid,
        userUuid,
        enabledToolkitSlugs,
      )
    ).resolvedTierMap;
    const resolvedConnectionTiers = mergeConnectionTierMaps(
      autoResolvedTierMap,
      normalizedToolkitConnectionTiers,
    );
    const orgSharedOnly = await this.areToolkitsOrgSharedOnly(
      enabledToolkitSlugs,
    );
    const composioUserId = resolveComposioUserIdFromTierMap(
      organizationUuid,
      userUuid,
      enabledToolkitSlugs,
      resolvedConnectionTiers,
      orgSharedOnly,
    );
    const sessionToolkitSlugs = filterToolkitsForComposioUserId(
      enabledToolkitSlugs,
      resolvedConnectionTiers,
      composioUserId,
    );
    const enabledTools = await this.getEnabledToolsByToolkit(
      organizationUuid,
      sessionToolkitSlugs,
    );
    const connectedAccounts = await this.getConnectedAccountConfig(
      organizationUuid,
      userUuid,
      composioUserId,
      sessionToolkitSlugs,
      resolvedConnectionTiers,
    );
    const sessionConfig = this.buildSessionConfig(
      sessionToolkitSlugs,
      enabledTools,
      connectedAccounts,
      allTieredToolkitsHaveConnectedAccounts(
        sessionToolkitSlugs,
        connectedAccounts,
      ),
    );
    const client = this.composioClient.getClient() as any;

    if (composioUserId.startsWith('org:') && conversation.composio_session_id) {
      const existingSession = await client.use(conversation.composio_session_id);
      try {
        await existingSession.update(sessionConfig);
        return existingSession;
      } catch (error) {
        if (!this.isInvalidConnectedAccountError(error)) {
          throw error;
        }
      }

      await this.clearConversationSession(conversation.uuid);
      conversation.composio_session_id = null;
    }

    if (conversation.composio_session_id) {
      const session = await client.use(conversation.composio_session_id);
      try {
        await session.update(sessionConfig);
        return session;
      } catch (error) {
        if (!this.isInvalidConnectedAccountError(error)) {
          throw error;
        }

        await this.clearConversationSession(conversation.uuid);
        conversation.composio_session_id = null;
      }
    }

    const session = await client.create(composioUserId, sessionConfig);
    const sessionId = session.sessionId ?? session.id;

    await this.prisma.conversation.update({
      where: { uuid: conversation.uuid },
      data: { composio_session_id: sessionId },
    });

    return session;
  }

  async getEnabledToolkitSlugs(
    organizationUuid: string,
    toolkitSlugs?: string[],
  ): Promise<string[]> {
    const enabledToolkits =
      await this.prisma.organisationEnabledToolkit.findMany({
        where: {
          org_uuid: organizationUuid,
          is_enabled: true,
          toolkit: {
            is_enabled: true,
            ...(toolkitSlugs !== undefined ? { slug: { in: toolkitSlugs } } : {}),
          },
        },
        select: { toolkit: { select: { slug: true } } },
        orderBy: { created_at: 'asc' },
      });

    return enabledToolkits.map((enabledToolkit) => enabledToolkit.toolkit.slug);
  }

  private areToolkitsOrgSharedOnly(toolkitSlugs: string[]): Promise<boolean> {
    if (toolkitSlugs.length === 0) {
      return Promise.resolve(false);
    }

    return this.prisma.composioToolkit
      .findMany({
        where: { slug: { in: toolkitSlugs }, is_enabled: true },
        select: { connection_tiers: true },
      })
      .then(
        (toolkits) =>
          toolkits.length > 0 &&
          toolkits.every(
            (toolkit) =>
              toolkit.connection_tiers.includes(
                ComposioConnectionTier.ORG_SHARED,
              ) &&
              !toolkit.connection_tiers.includes(
                ComposioConnectionTier.USER_PERSONAL,
              ),
          ),
      );
  }

  private buildSessionConfig(
    toolkitSlugs: string[],
    enabledTools: Record<string, string[]>,
    connectedAccounts: Record<string, string>,
    allRequiredToolkitsConnected: boolean,
  ) {
    const callbackUrl = this.configService.get<string>('APP_URL')
      ? `${this.configService.get<string>('APP_URL')}/dashboard/integrations/callback`
      : undefined;

    return {
      toolkits: { enable: toolkitSlugs },
      tools: enabledTools,
      connectedAccounts,
      manageConnections: {
        enable: !allRequiredToolkitsConnected,
        ...(callbackUrl ? { callbackUrl } : {}),
      },
    };
  }

  private async getEnabledToolsByToolkit(
    organizationUuid: string,
    toolkitSlugs: string[],
  ): Promise<Record<string, string[]>> {
    if (toolkitSlugs.length === 0) {
      return {};
    }

    const enabledToolkits =
      await this.prisma.organisationEnabledToolkit.findMany({
        where: {
          org_uuid: organizationUuid,
          is_enabled: true,
          toolkit: { is_enabled: true, slug: { in: toolkitSlugs } },
        },
        include: {
          toolkit: {
            select: {
              slug: true,
              tools: {
                where: { is_enabled: true },
                include: {
                  permissions: {
                    where: { org_uuid: organizationUuid },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });

    return enabledToolkits.reduce<Record<string, string[]>>(
      (result, enabledToolkit) => {
        const toolSlugs = enabledToolkit.toolkit.tools
          .filter((tool) => tool.permissions[0]?.enabled ?? true)
          .map((tool) => tool.slug);

        if (toolSlugs.length > 0) {
          result[enabledToolkit.toolkit.slug] = toolSlugs;
        }

        return result;
      },
      {},
    );
  }

  private isInvalidConnectedAccountError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return (
      message.includes('ToolRouterV2_InvalidConnectedAccountIds') ||
      message.includes('Could not find connected account')
    );
  }

  private async getConnectedAccountConfig(
    organizationUuid: string,
    userUuid: string,
    composioUserId: string,
    toolkitSlugs: string[],
    toolkitConnectionTiers?: Record<string, ComposioConnectionTier>,
  ): Promise<Record<string, string>> {
    if (toolkitSlugs.length === 0) {
      return {};
    }

    const toolkits = await this.prisma.composioToolkit.findMany({
      where: { slug: { in: toolkitSlugs } },
      select: { uuid: true, slug: true },
    });
    const toolkitUuids = toolkits.map((toolkit) => toolkit.uuid);

    const accounts = await this.prisma.composioConnectedAccount.findMany({
      where: {
        org_uuid: organizationUuid,
        toolkit_uuid: { in: toolkitUuids },
        status: ComposioAccountStatus.ACTIVE,
        OR: [{ user_uuid: userUuid }, { user_uuid: null }],
      },
      include: {
        toolkit: { select: { slug: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    const result: Record<string, string> = {};

    for (const account of accounts) {
      const toolkitSlug = account.toolkit.slug;
      const preferredTier = toolkitConnectionTiers?.[toolkitSlug];

      if (preferredTier) {
        const accountTier = account.user_uuid
          ? ComposioConnectionTier.USER_PERSONAL
          : ComposioConnectionTier.ORG_SHARED;

        if (accountTier !== preferredTier || result[toolkitSlug]) {
          continue;
        }
      }

      if (
        !isAccountTierCompatibleWithComposioUserId(account, composioUserId)
      ) {
        continue;
      }

      if (account.user_uuid && account.user_uuid !== userUuid) {
        continue;
      }

      if (!result[toolkitSlug]) {
        result[toolkitSlug] = account.composio_account_id;
      }
    }

    return result;
  }

  private async clearConversationSession(conversationUuid: string) {
    await this.prisma.conversation.update({
      where: { uuid: conversationUuid },
      data: { composio_session_id: null },
    });
  }

  private async resolveConnectionTierMap(
    organizationUuid: string,
    userUuid: string,
    toolkitSlugs: string[],
  ) {
    if (toolkitSlugs.length === 0) {
      return { resolvedTierMap: {} as Record<string, ComposioConnectionTier> };
    }

    const toolkits = await this.prisma.composioToolkit.findMany({
      where: {
        slug: { in: toolkitSlugs },
        is_enabled: true,
      },
      select: {
        slug: true,
        name: true,
        connected_accounts: {
          where: {
            org_uuid: organizationUuid,
            status: ComposioAccountStatus.ACTIVE,
            OR: [{ user_uuid: userUuid }, { user_uuid: null }],
          },
          select: { user_uuid: true },
        },
      },
    });

    const connectedTiersBySlug = new Map<string, Set<ComposioConnectionTier>>();
    const toolkitNamesBySlug = new Map<string, string>();

    for (const toolkit of toolkits) {
      toolkitNamesBySlug.set(toolkit.slug, toolkit.name);
      const tiers = new Set<ComposioConnectionTier>();

      for (const account of toolkit.connected_accounts ?? []) {
        tiers.add(inferConnectionTierFromAccount(account));
      }

      if (tiers.size > 0) {
        connectedTiersBySlug.set(toolkit.slug, tiers);
      }
    }

    return resolveToolkitConnectionTiers(
      toolkitSlugs,
      connectedTiersBySlug,
      toolkitNamesBySlug,
      {},
    );
  }
}
