import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { Integration, IntegrationProvider } from 'generated/prisma';
import { AiTool } from '../../framework/interfaces/ai-tool.interface';
import { BaseIntegration } from '../../framework/base/base-integration';
import { McpConnectionManagerService } from '../client/mcp-connection-manager.service';
import { DiscoveredMcpTool, McpAuthConfig, McpConnectionConfig, McpCredentials } from '../types/mcp.types';
import { normalizeMcpInputSchema } from '../utils/normalize-mcp-input-schema.util';

type McpIntegrationRecord = {
  integration_uuid: string;
  server_url: string;
  transport_type: McpConnectionConfig['transportType'];
  auth_type: McpConnectionConfig['authType'];
  auth_config: string;
  discovered_tools: DiscoveredMcpTool[];
};

@Injectable()
export class McpIntegration extends BaseIntegration {
  readonly provider = IntegrationProvider.MCP;

  constructor(
    prisma: PrismaService,
    encryptionService: EncryptionService,
    private readonly connectionManager: McpConnectionManagerService,
  ) {
    super(prisma, encryptionService);
  }

  defaultActions() {
    return [];
  }

  buildToolDefinitions(integration: Integration): AiTool[] {
    return this.getTools(integration);
  }

  getTools(integration: Integration & { mcp?: { discovered_tools?: unknown } | null }): AiTool[] {
    const discoveredTools = (integration.mcp?.discovered_tools ?? []) as DiscoveredMcpTool[];

    return discoveredTools.map((tool) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: normalizeMcpInputSchema(tool.parameters),
      },
    }));
  }

  async testConnection(config: Record<string, any>): Promise<boolean> {
    const connectionConfig = this.toConnectionConfig(config);

    await this.connectionManager.withClient(connectionConfig, async (client) => {
      await client.tools();
    });

    return true;
  }

  async executeTool(toolName: string, input: Record<string, any>, integration: Integration): Promise<any> {
    try {
      await this.validateAction(integration, toolName);
      const mcp = await this.requireMcpIntegration(integration.uuid);
      const discoveredTool = (mcp.discovered_tools as DiscoveredMcpTool[]).find((tool) => tool.name === toolName);

      if (!discoveredTool) {
        throw new BadRequestException('Discovered MCP tool was not found');
      }

      const connectionConfig = this.buildConnectionConfig(integration, mcp);
      const toolCallId = this.connectionManager.createToolCallId();

      const result = await this.connectionManager.withClient(
        connectionConfig,
        async (client) => {
          const tools = await client.tools();
          const tool = tools[discoveredTool.serverToolName];

          if (!tool?.execute) {
            throw new BadRequestException(`MCP server does not expose tool ${discoveredTool.serverToolName}`);
          }

          return await tool.execute(input ?? {}, { messages: [], toolCallId });
        },
        async (credentials) => {
          await this.prisma.integration.update({
            where: { uuid: integration.uuid },
            data: {
              config: this.encryption_service.encrypt(JSON.stringify(credentials)),
            },
          });
        },
      );

      if (result && typeof result === 'object' && 'isError' in result && result.isError) {
        return {
          success: false,
          error: this.extractToolError(result),
        };
      }

      return { success: true, data: result };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }

      return { success: false, error: 'MCP tool execution failed' };
    }
  }

  protected resolveActionKey(toolName: string) {
    const [, key] = toolName.split('__');
    return key || toolName;
  }

  toConnectionConfig(config: Record<string, any>): McpConnectionConfig {
    return {
      serverUrl: String(config.serverUrl ?? ''),
      transportType: config.transportType ?? 'HTTP',
      authType: config.authType ?? 'NONE',
      authConfig: (config.authConfig ?? {}) as McpAuthConfig,
      credentials: (config.credentials ?? {}) as McpCredentials,
      integrationUuid: config.integrationUuid,
    };
  }

  private buildConnectionConfig(integration: Integration, mcp: McpIntegrationRecord): McpConnectionConfig {
    return {
      serverUrl: mcp.server_url,
      transportType: mcp.transport_type,
      authType: mcp.auth_type,
      authConfig: JSON.parse(this.encryption_service.decrypt(mcp.auth_config)) as McpAuthConfig,
      credentials: this.decryptConfig(integration),
      integrationUuid: integration.uuid,
    };
  }

  private async requireMcpIntegration(integrationUuid: string): Promise<McpIntegrationRecord> {
    const mcp = await this.prisma.mcpIntegration.findUnique({
      where: { integration_uuid: integrationUuid },
    });

    if (!mcp) {
      throw new BadRequestException('MCP integration configuration was not found');
    }

    return mcp as unknown as McpIntegrationRecord;
  }

  private extractToolError(result: Record<string, unknown>) {
    const content = result.content;

    if (Array.isArray(content)) {
      const textPart = content.find((part) => part && typeof part === 'object' && 'text' in part) as
        | { text?: string }
        | undefined;

      if (textPart?.text) {
        return textPart.text;
      }
    }

    return 'MCP tool returned an error';
  }
}
