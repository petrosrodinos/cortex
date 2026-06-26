import { Injectable } from '@nestjs/common';
import { McpClientFactory } from '../client/mcp-client.factory';
import {
  buildMcpToolName,
  DiscoveredMcpTool,
  MCP_TOOL_LIMIT,
  McpConnectionConfig,
  McpDiscoveryResult,
} from '../types/mcp.types';
import { normalizeMcpInputSchema } from '../utils/normalize-mcp-input-schema.util';

@Injectable()
export class McpToolDiscoveryService {
  constructor(private readonly clientFactory: McpClientFactory) {}

  async discoverTools(config: McpConnectionConfig, integrationUuid?: string): Promise<McpDiscoveryResult> {
    const client = await this.clientFactory.createClient(config);

    try {
      const toolList = await client.listTools();
      const serverName = client.serverInfo?.name;
      const entries = toolList.tools.slice(0, MCP_TOOL_LIMIT);

      const tools = entries.map((tool) => {
        const parameters = normalizeMcpInputSchema(tool.inputSchema);

        return {
          name: integrationUuid ? buildMcpToolName(integrationUuid, tool.name) : tool.name,
          serverToolName: tool.name,
          description: tool.description ?? tool.name,
          parameters,
        } satisfies DiscoveredMcpTool;
      });

      return { serverName, tools };
    } finally {
      await client.close();
    }
  }
}
