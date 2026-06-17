import { Injectable } from '@nestjs/common';
import { McpClientFactory } from '../client/mcp-client.factory';
import {
  buildMcpToolName,
  DiscoveredMcpTool,
  JsonSchemaObject,
  MCP_TOOL_LIMIT,
  McpConnectionConfig,
  McpDiscoveryResult,
} from '../types/mcp.types';

@Injectable()
export class McpToolDiscoveryService {
  constructor(private readonly clientFactory: McpClientFactory) {}

  async discoverTools(config: McpConnectionConfig, integrationUuid?: string): Promise<McpDiscoveryResult> {
    const client = await this.clientFactory.createClient(config);

    try {
      const toolSet = await client.tools();
      const serverName = client.serverInfo?.name;
      const entries = Object.entries(toolSet).slice(0, MCP_TOOL_LIMIT);

      const tools = entries.map(([serverToolName, tool]) => {
        const parameters =
          (tool as { parameters?: JsonSchemaObject }).parameters ??
          (tool as { inputSchema?: JsonSchemaObject }).inputSchema ??
          { type: 'object', properties: {} };

        return {
          name: integrationUuid ? buildMcpToolName(integrationUuid, serverToolName) : serverToolName,
          serverToolName,
          description: tool.description ?? serverToolName,
          parameters,
        } satisfies DiscoveredMcpTool;
      });

      return { serverName, tools };
    } finally {
      await client.close();
    }
  }
}
