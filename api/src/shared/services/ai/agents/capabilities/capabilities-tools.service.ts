import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { getEffectiveDatabaseActionKeys } from '@/modules/integrations/databases/database-integration.types';
import {
  ComposioAccountStatus,
  ComposioConnectionTier,
  IntegrationStatus,
} from 'generated/prisma';
import type { AgentToolScope } from '../tools/core/agent-tool-scope.utils';
import {
  buildAgentCapabilitiesPromptBlock,
  type AgentCapabilitiesSnapshot,
} from './agent-capabilities-prompt.utils';
import {
  inferConnectionTierFromAccount,
  normalizeToolkitConnectionTierMap,
  resolveToolkitConnectionTiers,
  type ToolkitConnectionTierChoice,
  type ToolkitConnectionTierMap,
} from './toolkit-connection-tiers.utils';
import {
  filterToolkitsForComposioUserId,
  isToolkitConnectedForTier,
  resolveComposioUserIdFromTierMap,
} from '@/modules/composio/sessions/composio-session-scope.utils';

export interface CapabilitiesToolsContext {
  organizationUuid: string;
  userUuid?: string;
  integrationUuids?: string[];
  toolkitSlugs?: string[];
  toolkitConnectionTiers?: ToolkitConnectionTierMap;
}

export interface EnabledAgentIntegration {
  uuid: string;
  name: string;
  provider: string;
  actions: string[];
}

export interface EnabledAgentConnectedAccount {
  connection_tier: ComposioConnectionTier;
  account_label: string | null;
}

export interface EnabledAgentToolkit {
  uuid: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  tool_count: number;
  is_connected: boolean;
  connection_tiers: ComposioConnectionTier[];
  connected_accounts: EnabledAgentConnectedAccount[];
}

export interface EnabledAgentTools {
  integrations: EnabledAgentIntegration[];
  toolkits: EnabledAgentToolkit[];
}

@Injectable()
export class CapabilitiesToolsService {
  constructor(private readonly prisma: PrismaService) {}

  async listEnabledAgentTools(
    organizationUuid: string,
    userUuid: string,
  ): Promise<EnabledAgentTools> {
    const [integrationsResult, enabledToolkits] = await Promise.all([
      this.listIntegrations({ organizationUuid }),
      this.prisma.organisationEnabledToolkit.findMany({
        where: {
          org_uuid: organizationUuid,
          is_enabled: true,
          toolkit: {
            is_enabled: true,
            tools: { some: { is_enabled: true } },
          },
        },
        include: {
          toolkit: {
            select: {
              uuid: true,
              slug: true,
              name: true,
              description: true,
              logo_url: true,
              connection_tiers: true,
              connected_accounts: {
                where: {
                  org_uuid: organizationUuid,
                  status: ComposioAccountStatus.ACTIVE,
                  OR: [{ user_uuid: userUuid }, { user_uuid: null }],
                },
                select: {
                  user_uuid: true,
                  account_label: true,
                },
              },
              _count: {
                select: { tools: { where: { is_enabled: true } } },
              },
            },
          },
        },
        orderBy: { toolkit: { name: 'asc' } },
      }),
    ]);

    return {
      integrations: integrationsResult.integrations
        .filter((integration) => integration.actions.length > 0)
        .map(({ uuid, name, provider, actions }) => ({
          uuid,
          name,
          provider,
          actions,
        })),
      toolkits: enabledToolkits.map((entry) => ({
        uuid: entry.toolkit.uuid,
        slug: entry.toolkit.slug,
        name: entry.toolkit.name,
        description: entry.toolkit.description,
        logo_url: entry.toolkit.logo_url,
        tool_count: entry.toolkit._count.tools,
        is_connected: entry.toolkit.connected_accounts.length > 0,
        connection_tiers: entry.toolkit.connection_tiers,
        connected_accounts: entry.toolkit.connected_accounts.map((account) => ({
          connection_tier: inferConnectionTierFromAccount(account),
          account_label: account.account_label,
        })),
      })),
    };
  }

  async resolveToolkitConnectionAmbiguities(
    organizationUuid: string,
    userUuid: string,
    toolkitSlugs: string[],
    providedTiers?: ToolkitConnectionTierMap,
  ): Promise<{
    resolvedTierMap: Record<string, ComposioConnectionTier>;
    ambiguousChoices: ToolkitConnectionTierChoice[];
  }> {
    if (toolkitSlugs.length === 0) {
      return { resolvedTierMap: {}, ambiguousChoices: [] };
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

      for (const account of toolkit.connected_accounts) {
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
      providedTiers ?? {},
    );
  }

  async resolveAgentToolScope(
    organizationUuid: string,
    userUuid: string,
    integrationUuids?: string[],
    toolkitSlugs?: string[],
    providedTiers?: ToolkitConnectionTierMap,
  ): Promise<AgentToolScope> {
    const enabled = await this.listEnabledAgentTools(organizationUuid, userUuid);
    const enabledIntegrationUuids = new Set(
      enabled.integrations.map((integration) => integration.uuid),
    );
    const enabledToolkitSlugs = new Set(
      enabled.toolkits.map((toolkit) => toolkit.slug),
    );

    const resolvedIntegrationUuids = this.resolveScopedValues(
      integrationUuids,
      [...enabledIntegrationUuids],
      enabledIntegrationUuids,
    );
    const resolvedToolkitSlugs = this.resolveScopedValues(
      toolkitSlugs,
      [...enabledToolkitSlugs],
      enabledToolkitSlugs,
    );
    const scopedSlugs = resolvedToolkitSlugs ?? [];
    const { resolvedTierMap } = await this.resolveToolkitConnectionAmbiguities(
      organizationUuid,
      userUuid,
      scopedSlugs,
      providedTiers,
    );

    return {
      integrationUuids: resolvedIntegrationUuids,
      toolkitSlugs: resolvedToolkitSlugs,
      toolkitConnectionTiers:
        Object.keys(resolvedTierMap).length > 0 ? resolvedTierMap : undefined,
    };
  }

  async listIntegrations(context: CapabilitiesToolsContext) {
    const integrations = await this.prisma.integration.findMany({
      where: {
        org_uuid: context.organizationUuid,
        status: IntegrationStatus.ACTIVE,
        ...(context.integrationUuids !== undefined
          ? { uuid: { in: context.integrationUuids } }
          : {}),
      },
      include: {
        actions: { select: { key: true, enabled: true } },
        database: { select: { uuid: true, allowed_ops: true } },
      },
      orderBy: { name: 'asc' },
    });

    return {
      integrations: integrations.map((integration) => ({
        uuid: integration.uuid,
        name: integration.name,
        provider: integration.provider,
        actions: integration.database
          ? getEffectiveDatabaseActionKeys(integration.database.allowed_ops)
          : integration.actions
              .filter((action) => action.enabled)
              .map((action) => action.key),
        has_database_schema: Boolean(integration.database),
      })),
    };
  }

  async listToolkits(context: CapabilitiesToolsContext) {
    const enabled = await this.prisma.organisationEnabledToolkit.findMany({
      where: {
        org_uuid: context.organizationUuid,
        is_enabled: true,
        toolkit: {
          is_enabled: true,
          ...(context.toolkitSlugs !== undefined
            ? { slug: { in: context.toolkitSlugs } }
            : {}),
        },
      },
      include: {
        toolkit: {
          select: {
            slug: true,
            name: true,
            description: true,
            connection_tiers: true,
            connected_accounts: {
              where: {
                org_uuid: context.organizationUuid,
                status: ComposioAccountStatus.ACTIVE,
                ...(context.userUuid
                  ? {
                      OR: [
                        { user_uuid: context.userUuid },
                        { user_uuid: null },
                      ],
                    }
                  : {}),
              },
              select: {
                user_uuid: true,
              },
            },
          },
        },
      },
      orderBy: { toolkit: { name: 'asc' } },
    });

    const tierMap = context.toolkitConnectionTiers ?? {};
    const toolkitSlugs = enabled.map((entry) => entry.toolkit.slug);
    const orgSharedOnly = enabled.every(
      (entry) =>
        entry.toolkit.connection_tiers.includes(
          ComposioConnectionTier.ORG_SHARED,
        ) &&
        !entry.toolkit.connection_tiers.includes(
          ComposioConnectionTier.USER_PERSONAL,
        ),
    );
    const composioUserId = context.userUuid
      ? resolveComposioUserIdFromTierMap(
          context.organizationUuid,
          context.userUuid,
          toolkitSlugs,
          tierMap,
          orgSharedOnly,
        )
      : null;
    const sessionToolkitSlugs =
      composioUserId && toolkitSlugs.length > 0
        ? filterToolkitsForComposioUserId(
            toolkitSlugs,
            tierMap,
            composioUserId,
          )
        : toolkitSlugs;
    const sessionToolkitSlugSet = new Set(sessionToolkitSlugs);

    return {
      toolkits: enabled.map((entry) => ({
        slug: entry.toolkit.slug,
        name: entry.toolkit.name,
        description: entry.toolkit.description,
        is_connected:
          sessionToolkitSlugSet.has(entry.toolkit.slug) &&
          isToolkitConnectedForTier(
            entry.toolkit.connected_accounts,
            tierMap[entry.toolkit.slug],
          ),
      })),
    };
  }

  async buildAgentCapabilitiesPrompt(
    context: CapabilitiesToolsContext,
  ): Promise<string> {
    const snapshot = await this.buildAgentCapabilitiesSnapshot(context);
    return buildAgentCapabilitiesPromptBlock(snapshot);
  }

  async buildAgentCapabilitiesSnapshot(
    context: CapabilitiesToolsContext,
  ): Promise<AgentCapabilitiesSnapshot> {
    const [integrationsResult, toolkitsResult] = await Promise.all([
      this.listIntegrations(context),
      this.listToolkits(context),
    ]);

    return {
      integrations: integrationsResult.integrations.map((integration) => ({
        uuid: integration.uuid,
        name: integration.name,
        provider: integration.provider,
        actions: integration.actions,
      })),
      toolkits: toolkitsResult.toolkits.map((toolkit) => ({
        slug: toolkit.slug,
        name: toolkit.name,
        is_connected: toolkit.is_connected,
      })),
    };
  }

  async getDatabaseSchema(
    context: CapabilitiesToolsContext,
    integrationUuid: string,
  ) {
    const integration = await this.prisma.integration.findFirst({
      where: {
        uuid: integrationUuid,
        org_uuid: context.organizationUuid,
        status: IntegrationStatus.ACTIVE,
      },
      include: { database: true },
    });

    if (!integration?.database?.schema_cache) {
      throw new NotFoundException(
        'Database schema not available for this integration',
      );
    }

    return {
      integration_uuid: integration.uuid,
      name: integration.name,
      schema: integration.database.schema_cache,
    };
  }

  private resolveScopedValues(
    requested: string[] | undefined,
    allEnabled: string[],
    enabledSet: Set<string>,
  ): string[] | undefined {
    if (requested === undefined) {
      return allEnabled.length > 0 ? allEnabled : undefined;
    }

    if (requested.length === 0) {
      return [];
    }

    const scoped = requested.filter((value) => enabledSet.has(value));
    return scoped.length > 0 ? scoped : [];
  }
}
