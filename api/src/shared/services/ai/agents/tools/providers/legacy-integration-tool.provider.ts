import { Injectable } from '@nestjs/common';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { DATABASE_PROVIDERS } from '@/modules/integrations/databases/database-integration.types';
import { IntegrationRegistry } from '@/modules/integrations/framework/registry/integration-registry.service';
import { IntegrationProvider, IntegrationStatus } from 'generated/prisma';
import type {
  AgentToolProvider,
  AgentToolProviderContext,
} from '../core/tool-provider.interface';
import { ToolDispatcherService } from '../dispatch/tool-dispatcher.service';
import { appendEmailSendToolDescription } from '../email-tool.utils';

const AGENT_HIDDEN_INTEGRATION_TOOL_KEYS = new Set([
  'send_html_email',
  'send_bulk_email',
  'send_email_with_attachments',
]);

const EMAIL_SEND_ACTION_KEYS = new Set(['send_email', 'send_message']);

@Injectable()
export class LegacyIntegrationToolProvider implements AgentToolProvider {
  readonly name = 'legacy-integrations';

  constructor(
    private readonly registry: IntegrationRegistry,
    private readonly prisma: PrismaService,
    private readonly dispatcher: ToolDispatcherService,
  ) {}

  async buildTools(context: AgentToolProviderContext): Promise<ToolSet> {
    const aiTools = await this.registry.getAllTools(
      context.organizationUuid,
      context.integrationUuids,
    );
    const approvalMap = await this.loadApprovalMap(context.organizationUuid);
    const tools: ToolSet = {};

    for (const aiTool of aiTools) {
      const name = aiTool.function.name;
      if (this.isHiddenFromAgent(name)) {
        continue;
      }

      const actionKey = this.extractActionKey(name);
      const parameters =
        actionKey && EMAIL_SEND_ACTION_KEYS.has(actionKey)
          ? this.enhanceEmailToolParameters(
              aiTool.function.parameters,
              actionKey,
            )
          : (aiTool.function.parameters ?? {
              type: 'object',
              properties: {},
            });
      const description =
        actionKey && EMAIL_SEND_ACTION_KEYS.has(actionKey)
          ? appendEmailSendToolDescription(
              `${aiTool.function.description} Use the to field for any recipient email address. Optional attachment_document_uuids accepts document UUIDs from output__create_* tools; attachments are added automatically at send time.`,
            )
          : aiTool.function.description;

      tools[name] = tool({
        description,
        inputSchema: jsonSchema(parameters),
        needsApproval: approvalMap.get(name) ?? false,
        execute: async (input) => {
          const callId = context.progress?.toolStart(name, input);
          const started = Date.now();
          const result = await this.dispatcher.dispatch(
            context.organizationUuid,
            context.userUuid,
            name,
            input as Record<string, unknown>,
            context.executionUuid,
            context.userPermissions,
            callId,
            context.integrationUuids,
          );

          if (callId) {
            context.progress?.toolComplete(callId, {
              toolName: name,
              result: result.result ?? result.error,
              durationMs: Date.now() - started,
              success: result.success,
            });
          }

          if (!result.success) {
            throw new Error(result.error ?? 'Tool execution failed');
          }

          return result.result;
        },
      });
    }

    return tools;
  }

  private isHiddenFromAgent(toolName: string) {
    return AGENT_HIDDEN_INTEGRATION_TOOL_KEYS.has(
      this.extractActionKey(toolName),
    );
  }

  private enhanceEmailToolParameters(
    parameters: Record<string, unknown> | undefined,
    actionKey: string,
  ) {
    const base =
      parameters && typeof parameters === 'object'
        ? parameters
        : { type: 'object', properties: {} };
    const properties =
      base.properties && typeof base.properties === 'object'
        ? { ...(base.properties as Record<string, unknown>) }
        : {};

    if (actionKey === 'send_email') {
      properties.attachment_document_uuids = {
        type: 'array',
        items: { type: 'string' },
        description:
          'Optional document UUIDs from output__create_* tools to attach to the email',
      };
    }

    return {
      ...base,
      properties,
    };
  }

  private extractActionKey(toolName: string) {
    if (toolName.startsWith('db__')) {
      return toolName.replace('db__', '');
    }

    const namespacedMatch = toolName.match(/^[^_]+_[^_]+__(.+)$/);
    if (namespacedMatch) {
      return namespacedMatch[1];
    }

    const parts = toolName.split('__');
    return parts.length > 1 ? parts.slice(1).join('__') : toolName;
  }

  private async loadApprovalMap(organizationUuid: string) {
    const actions = await this.prisma.integrationAction.findMany({
      where: {
        requires_approval: true,
        integration: {
          org_uuid: organizationUuid,
          status: IntegrationStatus.ACTIVE,
        },
      },
      include: { integration: true },
    });

    const map = new Map<string, boolean>();

    for (const action of actions) {
      const provider = action.integration.provider.toLowerCase();
      map.set(`${provider}__${action.key}`, true);

      if (action.integration.provider === IntegrationProvider.OPENAPI) {
        map.set(
          `openapi_${action.integration.uuid.slice(0, 8)}__${action.key}`,
          true,
        );
      }

      if (action.integration.provider === IntegrationProvider.MCP) {
        map.set(
          `mcp_${action.integration.uuid.slice(0, 8)}__${action.key}`,
          true,
        );
      }

      if (
        DATABASE_PROVIDERS.includes(
          action.integration.provider as (typeof DATABASE_PROVIDERS)[number],
        )
      ) {
        map.set(`db__${action.key}`, true);
      }
    }

    return map;
  }
}
