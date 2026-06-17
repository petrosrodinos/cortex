import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { IntegrationRegistry } from '@/modules/integrations/framework/registry/integration-registry.service';
import { DATABASE_PROVIDERS } from '@/modules/integrations/databases/database-integration.types';
import { IntegrationProvider, IntegrationStatus } from 'generated/prisma';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import { ToolDispatcherService } from './tool-dispatcher.service';

@Injectable()
export class IntegrationToolsFactory {
  constructor(
    private readonly registry: IntegrationRegistry,
    private readonly prisma: PrismaService,
    private readonly dispatcher: ToolDispatcherService,
  ) {}

  async buildTools(
    organizationUuid: string,
    userUuid: string,
    executionUuid: string,
    userPermissions: string[],
    onToolEvent?: (event: 'start' | 'complete', payload: Record<string, unknown>) => void,
  ): Promise<ToolSet> {
    const aiTools = await this.registry.getAllTools(organizationUuid);
    const approvalMap = await this.loadApprovalMap(organizationUuid);
    const tools: ToolSet = {};

    for (const aiTool of aiTools) {
      const name = aiTool.function.name;
      tools[name] = tool({
        description: aiTool.function.description,
        inputSchema: jsonSchema(aiTool.function.parameters ?? { type: 'object', properties: {} }),
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
            return { error: result.error };
          }

          return result.result;
        },
      });
    }

    const codeTool = {
      description: 'Execute Python code in a sandbox for data analysis, charts, and file generation.',
      inputSchema: jsonSchema({
        type: 'object',
        properties: { code: { type: 'string' } },
        required: ['code'],
      }),
      execute: async (input: { code: string }) => {
        const { code } = input;
        onToolEvent?.('start', { toolName: 'code_interpreter', input: { code } });
        const started = Date.now();
        const output = await this.runCodeInterpreter(code);
        onToolEvent?.('complete', {
          toolName: 'code_interpreter',
          result: output,
          durationMs: Date.now() - started,
          success: true,
        });
        return output;
      },
    };

    return { ...tools, code_interpreter: codeTool } as ToolSet;
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

  private async runCodeInterpreter(code: string) {
    try {
      const sandboxModule = await import('@openai/agents/sandbox');
      const SandboxAgent = sandboxModule.SandboxAgent ?? (sandboxModule as { default?: { SandboxAgent?: unknown } }).default?.SandboxAgent;
      if (!SandboxAgent || typeof SandboxAgent !== 'function') {
        throw new Error('Sandbox unavailable');
      }

      const agent = new (SandboxAgent as new () => { run: (input: string) => Promise<{ stdout?: string; stderr?: string; files?: string[] }> })();
      const result = await agent.run(code);
      return {
        stdout: result.stdout ?? '',
        stderr: result.stderr ?? '',
        files: result.files ?? [],
      };
    } catch {
      return {
        stdout: '',
        stderr: 'Code interpreter sandbox is not available in this environment.',
        files: [],
        note: 'Configure @openai/agents sandbox credentials to enable Python execution.',
        requested_code: code.slice(0, 500),
      };
    }
  }
}
