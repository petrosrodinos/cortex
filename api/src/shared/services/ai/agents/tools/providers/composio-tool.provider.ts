import { ForbiddenException, BadRequestException, Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ComposioSessionService } from '@/modules/composio/sessions/composio-session.service';
import { ComposioClientService } from '@/integrations/composio/composio-client.service';
import {
  ComposioAccountStatus,
  ComposioConnectionTier,
  ToolCallStatus,
} from 'generated/prisma';
import { toJsonValue } from '@/shared/utils/json-value.utils';
import type {
  AgentToolProvider,
  AgentToolProviderContext,
} from '../core/tool-provider.interface';
import {
  appendEmailSendToolDescription,
  applyDefaultEmailSender,
  buildMissingTransactionalSenderError,
  enrichEmailSenderConfigError,
  extractEmailToolkitSlugFromToolName,
  extractSenderEmailFromToolInput,
  isEmailSendToolName,
  isTransactionalEmailToolkitSlug,
  resolveConnectedTransactionalSenderEmail,
  stripPersonalEmailFromSenderFields,
} from '../email-tool.utils';

type ExecutableTool = {
  description?: string;
  execute?: (input: unknown, options?: unknown) => Promise<unknown> | unknown;
  needsApproval?: boolean;
};

@Injectable()
export class ComposioToolProvider implements AgentToolProvider {
  readonly name = 'composio';

  constructor(
    private readonly prisma: PrismaService,
    private readonly sessions: ComposioSessionService,
    private readonly composioClient: ComposioClientService,
  ) {}

  async buildTools(context: AgentToolProviderContext): Promise<ToolSet> {
    const enabledTools = await this.loadEnabledTools(context);
    const enabledToolkitSlugs = await this.sessions.getEnabledToolkitSlugs(
      context.organizationUuid,
      context.toolkitSlugs,
    );

    if (enabledToolkitSlugs.length === 0 && enabledTools.size === 0) {
      return {};
    }

    const session = await this.sessions.resolveSession(
      context.conversationUuid,
      context.organizationUuid,
      context.userUuid,
      context.toolkitSlugs,
      context.toolkitConnectionTiers,
    );
    const sessionId = session.sessionId ?? session.id;
    const rawTools = (await session.tools()) as ToolSet;
    const tools: ToolSet = {};

    for (const [toolName, rawTool] of Object.entries(rawTools)) {
      if (this.isMetaTool(toolName)) {
        tools[toolName] = this.wrapTool(
          toolName,
          rawTool as ExecutableTool,
          context,
          sessionId,
          { requiresApproval: false },
        );
        continue;
      }

      const permission = enabledTools.get(this.normalizeToolSlug(toolName));
      if (!permission) {
        continue;
      }

      if (
        permission.requiredPermissionKey &&
        !context.userPermissions.includes(permission.requiredPermissionKey)
      ) {
        continue;
      }

      tools[toolName] = this.wrapTool(
        toolName,
        rawTool as ExecutableTool,
        context,
        sessionId,
        {
          requiresApproval: permission.requiresApproval,
          requiredPermissionKey: permission.requiredPermissionKey,
        },
      );
    }

    return tools;
  }

  private isMetaTool(toolName: string) {
    return toolName.toUpperCase().startsWith('COMPOSIO_');
  }

  private wrapTool(
    toolName: string,
    executable: ExecutableTool,
    context: AgentToolProviderContext,
    sessionId: string,
    permission: {
      requiresApproval: boolean;
      requiredPermissionKey?: string;
    },
  ): ToolSet[string] {
    const description = isEmailSendToolName(toolName)
      ? appendEmailSendToolDescription(executable.description)
      : executable.description;

    return {
      ...(executable as object),
      ...(description !== undefined ? { description } : {}),
      needsApproval: permission.requiresApproval,
      execute: async (input: unknown, options?: unknown) => {
        if (
          permission.requiredPermissionKey &&
          !context.userPermissions.includes(permission.requiredPermissionKey)
        ) {
          throw new ForbiddenException(
            `Missing permission for tool ${toolName}`,
          );
        }

        const callId = context.progress?.toolStart(toolName, input);
        const started = Date.now();
        let preparedInput: Record<string, unknown> =
          typeof input === 'object' && input !== null && !Array.isArray(input)
            ? { ...(input as Record<string, unknown>) }
            : {};

        try {
          preparedInput = await this.prepareEmailSendInput(
            context,
            toolName,
            input,
          );

          const result = executable.execute
            ? await executable.execute(preparedInput, options)
            : undefined;
          const serializedResult = toJsonValue(result);
          const durationMs = Date.now() - started;

          await this.prisma.toolCall.create({
            data: {
              ...(callId ? { uuid: callId } : {}),
              execution_uuid: context.executionUuid,
              provider_type: 'COMPOSIO',
              composio_tool_slug: toolName,
              composio_session_id: sessionId,
              tool_name: toolName,
              input: preparedInput as object,
              output: serializedResult as object,
              status: ToolCallStatus.SUCCESS,
              duration_ms: durationMs,
            },
          });

          if (callId) {
            context.progress?.toolComplete(callId, {
              toolName,
              result: serializedResult,
              durationMs,
              success: true,
            });
          }

          return result;
        } catch (error) {
          const durationMs = Date.now() - started;
          let message: string;

          if (error instanceof BadRequestException) {
            const response = error.getResponse();
            message =
              typeof response === 'string'
                ? response
                : error instanceof Error
                  ? error.message
                  : 'Composio tool failed';
          } else {
            message = enrichEmailSenderConfigError(
              toolName,
              error instanceof Error ? error.message : 'Composio tool failed',
            );
          }

          await this.prisma.toolCall.create({
            data: {
              ...(callId ? { uuid: callId } : {}),
              execution_uuid: context.executionUuid,
              provider_type: 'COMPOSIO',
              composio_tool_slug: toolName,
              composio_session_id: sessionId,
              tool_name: toolName,
              input: preparedInput as object,
              output: { error: message },
              status: ToolCallStatus.FAILED,
              error: message,
              duration_ms: durationMs,
            },
          });

          if (callId) {
            context.progress?.toolComplete(callId, {
              toolName,
              result: message,
              durationMs,
              success: false,
            });
          }

          throw error;
        }
      },
    } as ToolSet[string];
  }

  private async loadEnabledTools(context: AgentToolProviderContext) {
    const enabledToolkits =
      await this.prisma.organisationEnabledToolkit.findMany({
        where: {
          org_uuid: context.organizationUuid,
          is_enabled: true,
          toolkit: { is_enabled: true },
          ...(context.toolkitSlugs !== undefined
            ? {
                toolkit: {
                  is_enabled: true,
                  slug: { in: context.toolkitSlugs },
                },
              }
            : {}),
        },
        include: {
          toolkit: {
            include: {
              tools: {
                where: { is_enabled: true },
                include: {
                  permissions: {
                    where: { org_uuid: context.organizationUuid },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });

    const result = new Map<
      string,
      { requiresApproval: boolean; requiredPermissionKey?: string }
    >();

    for (const enabledToolkit of enabledToolkits) {
      for (const tool of enabledToolkit.toolkit.tools) {
        const permission = tool.permissions[0];
        if (permission?.enabled === false) {
          continue;
        }

        result.set(this.normalizeToolSlug(tool.slug), {
          requiresApproval: permission?.requires_approval ?? false,
          requiredPermissionKey:
            permission?.required_permission_key ?? undefined,
        });
      }
    }

    return result;
  }

  private normalizeToolSlug(slug: string) {
    return slug.replace(/[^a-z0-9]/gi, '').toLowerCase();
  }

  private async prepareEmailSendInput(
    context: AgentToolProviderContext,
    toolName: string,
    input: unknown,
  ): Promise<Record<string, unknown>> {
    if (!isEmailSendToolName(toolName)) {
      return typeof input === 'object' && input !== null && !Array.isArray(input)
        ? { ...(input as Record<string, unknown>) }
        : {};
    }

    const toolkitSlug = extractEmailToolkitSlugFromToolName(toolName);
    if (!toolkitSlug || !isTransactionalEmailToolkitSlug(toolkitSlug)) {
      return typeof input === 'object' && input !== null && !Array.isArray(input)
        ? { ...(input as Record<string, unknown>) }
        : {};
    }

    const baseInput =
      typeof input === 'object' && input !== null && !Array.isArray(input)
        ? { ...(input as Record<string, unknown>) }
        : {};
    const user = await this.prisma.user.findUnique({
      where: { uuid: context.userUuid },
      select: { email: true },
    });
    const withoutPersonalSender = stripPersonalEmailFromSenderFields(
      baseInput,
      user?.email,
    );
    const senderEmail = await this.resolveConnectedSenderEmail(
      context.organizationUuid,
      context.userUuid,
      toolkitSlug,
      context.toolkitConnectionTiers,
    );

    if (!senderEmail) {
      if (extractSenderEmailFromToolInput(withoutPersonalSender)) {
        return withoutPersonalSender;
      }

      throw new BadRequestException(
        buildMissingTransactionalSenderError(toolkitSlug),
      );
    }

    return applyDefaultEmailSender(withoutPersonalSender, senderEmail, {
      force: true,
    });
  }

  private async resolveConnectedSenderEmail(
    organizationUuid: string,
    userUuid: string,
    toolkitSlug: string,
    toolkitConnectionTiers?: Record<string, string>,
  ): Promise<string | null> {
    const toolkit = await this.prisma.composioToolkit.findFirst({
      where: { slug: toolkitSlug, is_enabled: true },
      select: { uuid: true },
    });

    if (!toolkit) {
      return null;
    }

    const preferredTier =
      toolkitConnectionTiers?.[toolkitSlug] ?? ComposioConnectionTier.ORG_SHARED;
    const accounts = await this.prisma.composioConnectedAccount.findMany({
      where: {
        org_uuid: organizationUuid,
        toolkit_uuid: toolkit.uuid,
        status: ComposioAccountStatus.ACTIVE,
        OR: [{ user_uuid: userUuid }, { user_uuid: null }],
      },
      select: {
        user_uuid: true,
        account_label: true,
        composio_account_id: true,
      },
      orderBy: { created_at: 'desc' },
    });

    const composio = this.composioClient.getClient() as {
      connectedAccounts?: { get: (id: string) => Promise<unknown> };
    };

    return resolveConnectedTransactionalSenderEmail(
      accounts,
      preferredTier as ComposioConnectionTier,
      composio.connectedAccounts
        ? (composioAccountId) =>
            composio.connectedAccounts!.get(composioAccountId)
        : undefined,
    );
  }
}
