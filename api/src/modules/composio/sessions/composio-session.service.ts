import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ComposioClientService } from '@/integrations/composio/composio-client.service';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import {
  ComposioAccountStatus,
  ComposioConnectionTier,
} from 'generated/prisma';

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
  ) {
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
    const enabledTools = await this.getEnabledToolsByToolkit(
      organizationUuid,
      enabledToolkitSlugs,
    );
    const sessionConfig = await this.buildSessionConfig(
      organizationUuid,
      userUuid,
      enabledToolkitSlugs,
      enabledTools,
    );
    const client = this.composioClient.getClient() as any;

    if (conversation.composio_session_id) {
      const session = await client.use(conversation.composio_session_id);
      await session.update(sessionConfig);
      return session;
    }

    const session = await client.create(`user:${userUuid}`, sessionConfig);
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
            ...(toolkitSlugs?.length ? { slug: { in: toolkitSlugs } } : {}),
          },
        },
        select: { toolkit: { select: { slug: true } } },
        orderBy: { created_at: 'asc' },
      });

    return enabledToolkits.map((enabledToolkit) => enabledToolkit.toolkit.slug);
  }

  private async buildSessionConfig(
    organizationUuid: string,
    userUuid: string,
    toolkitSlugs: string[],
    enabledTools: Record<string, string[]>,
  ) {
    const connectedAccounts = await this.getConnectedAccountConfig(
      organizationUuid,
      userUuid,
      toolkitSlugs,
    );
    const callbackUrl = this.configService.get<string>('APP_URL')
      ? `${this.configService.get<string>('APP_URL')}/dashboard/integrations/callback`
      : undefined;

    return {
      toolkits: { enable: toolkitSlugs },
      tools: enabledTools,
      connectedAccounts,
      manageConnections: {
        enable: true,
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

  private async getConnectedAccountConfig(
    organizationUuid: string,
    userUuid: string,
    toolkitSlugs: string[],
  ): Promise<Record<string, string | string[]>> {
    if (toolkitSlugs.length === 0) {
      return {};
    }

    const toolkits = await this.prisma.composioToolkit.findMany({
      where: { slug: { in: toolkitSlugs } },
      select: { uuid: true, slug: true, connection_tier: true },
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
        toolkit: { select: { slug: true, connection_tier: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    return accounts.reduce<Record<string, string | string[]>>(
      (result, account) => {
        const tier = account.toolkit.connection_tier;
        const toolkitSlug = account.toolkit.slug;

        if (
          tier === ComposioConnectionTier.USER_PERSONAL &&
          account.user_uuid !== userUuid
        ) {
          return result;
        }

        if (!result[toolkitSlug]) {
          result[toolkitSlug] = account.composio_account_id;
          return result;
        }

        const current = result[toolkitSlug];
        result[toolkitSlug] = Array.isArray(current)
          ? [...current, account.composio_account_id]
          : [current, account.composio_account_id];

        return result;
      },
      {},
    );
  }
}
