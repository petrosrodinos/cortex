import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { IntegrationRegistry } from '@/modules/integrations/framework/registry/integration-registry.service';
import { DATABASE_PROVIDERS } from '@/modules/integrations/databases/database-integration.types';
import { IntegrationProvider, IntegrationStatus } from 'generated/prisma';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import { SandboxCodeService } from '../sandbox/sandbox-code.service';
import { CODE_INTERPRETER_DESCRIPTION } from '../sandbox/sandbox.config';
import { DocumentToolsFactory } from '../documents/document-tools.factory';
import { OutputToolsFactory } from '../outputs/tools/output-tools.factory';
import { OrganizationToolsFactory } from '../organization/organization-tools.factory';
import { ToolDispatcherService } from './tool-dispatcher.service';

const AGENT_HIDDEN_INTEGRATION_TOOL_KEYS = new Set([
  'send_html_email',
  'send_bulk_email',
  'send_email_with_attachments',
]);

const EMAIL_SEND_ACTION_KEYS = new Set(['send_email', 'send_message']);

@Injectable()
export class IntegrationToolsFactory {
  constructor(
    private readonly registry: IntegrationRegistry,
    private readonly prisma: PrismaService,
    private readonly dispatcher: ToolDispatcherService,
    private readonly sandboxCode: SandboxCodeService,
    private readonly documentToolsFactory: DocumentToolsFactory,
    private readonly outputToolsFactory: OutputToolsFactory,
    private readonly organizationToolsFactory: OrganizationToolsFactory,
  ) {}

  async buildTools(
    organizationUuid: string,
    userUuid: string,
    executionUuid: string,
    userPermissions: string[],
    options?: {
      documentUuids?: string[];
      integrationUuids?: string[];
      userMessage?: string;
      onToolEvent?: (event: 'start' | 'complete', payload: Record<string, unknown>) => void;
    },
  ): Promise<ToolSet> {
    const onToolEvent = options?.onToolEvent;
    const aiTools = await this.registry.getAllTools(organizationUuid, options?.integrationUuids);
    const approvalMap = await this.loadApprovalMap(organizationUuid);
    const tools: ToolSet = {};

    for (const aiTool of aiTools) {
      const name = aiTool.function.name;
      if (this.isHiddenFromAgent(name)) {
        continue;
      }

      const actionKey = this.extractActionKey(name);
      const parameters =
        actionKey && EMAIL_SEND_ACTION_KEYS.has(actionKey)
          ? this.enhanceEmailToolParameters(aiTool.function.parameters, actionKey)
          : (aiTool.function.parameters ?? { type: 'object', properties: {} });
      const description =
        actionKey && EMAIL_SEND_ACTION_KEYS.has(actionKey)
          ? `${aiTool.function.description} Use the to field for any recipient email address. Optional attachment_document_uuids accepts document UUIDs from output__create_* tools; attachments are added automatically at send time.`
          : aiTool.function.description;

      tools[name] = tool({
        description,
        inputSchema: jsonSchema(parameters),
        needsApproval: approvalMap.get(name) ?? false,
        execute: async (input) => {
          onToolEvent?.('start', { toolName: name, input });
          const started = Date.now();
          const result = await this.dispatcher.dispatch(
            organizationUuid,
            userUuid,
            name,
            input as Record<string, unknown>,
            executionUuid,
            userPermissions,
          );
          onToolEvent?.('complete', {
            toolName: name,
            result: result.result ?? result.error,
            durationMs: Date.now() - started,
            success: result.success,
          });

          if (!result.success) {
            throw new Error(result.error ?? 'Tool execution failed');
          }

          return result.result;
        },
      });
    }

    tools.code_interpreter = tool({
      description: CODE_INTERPRETER_DESCRIPTION,
      inputSchema: jsonSchema({
        type: 'object',
        properties: { code: { type: 'string' } },
        required: ['code'],
      }),
      execute: async (input: { code: string }) => {
        const { code } = input;
        onToolEvent?.('start', { toolName: 'code_interpreter', input: { code } });
        const started = Date.now();
        const output = await this.sandboxCode.runPython(executionUuid, code);
        onToolEvent?.('complete', {
          toolName: 'code_interpreter',
          result: output,
          durationMs: Date.now() - started,
          success: !output.stderr || output.exitCode === 0,
        });
        return output;
      },
    });

    const documentTools = await this.documentToolsFactory.buildTools({
      organizationUuid,
      documentUuids: options?.documentUuids ?? [],
      onToolEvent,
    });

    const outputTools = this.outputToolsFactory.buildTools({
      organizationUuid,
      userUuid,
      executionUuid,
      userMessage: options?.userMessage,
      onToolEvent,
    });

    const organizationTools = this.organizationToolsFactory.buildTools({
      organizationUuid,
      userUuid,
      executionUuid,
      userPermissions,
      onToolEvent,
    });

    return { ...tools, ...documentTools, ...outputTools, ...organizationTools };
  }

  private isHiddenFromAgent(toolName: string) {
    return AGENT_HIDDEN_INTEGRATION_TOOL_KEYS.has(this.extractActionKey(toolName));
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
        integration: { org_uuid: organizationUuid, status: IntegrationStatus.ACTIVE },
      },
      include: { integration: true },
    });

    const map = new Map<string, boolean>();

    for (const action of actions) {
      const provider = action.integration.provider.toLowerCase();
      map.set(`${provider}__${action.key}`, true);

      if (action.integration.provider === IntegrationProvider.OPENAPI) {
        map.set(`openapi_${action.integration.uuid.slice(0, 8)}__${action.key}`, true);
      }

      if (action.integration.provider === IntegrationProvider.MCP) {
        map.set(`mcp_${action.integration.uuid.slice(0, 8)}__${action.key}`, true);
      }

      if (DATABASE_PROVIDERS.includes(action.integration.provider as (typeof DATABASE_PROVIDERS)[number])) {
        map.set(`db__${action.key}`, true);
      }
    }

    return map;
  }
}

