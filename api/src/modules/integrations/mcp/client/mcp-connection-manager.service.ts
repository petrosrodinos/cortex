import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { MCPClient } from '@ai-sdk/mcp';
import { McpConnectionConfig } from '../types/mcp.types';
import { McpClientFactory } from './mcp-client.factory';

@Injectable()
export class McpConnectionManagerService {
  constructor(private readonly clientFactory: McpClientFactory) {}

  async withClient<T>(
    config: McpConnectionConfig,
    handler: (client: MCPClient) => Promise<T>,
    onTokensRefreshed?: (credentials: McpConnectionConfig['credentials']) => Promise<void>,
  ): Promise<T> {
    const client = await this.clientFactory.createClient(config, onTokensRefreshed);

    try {
      return await handler(client);
    } finally {
      await client.close();
    }
  }

  createToolCallId() {
    return randomUUID();
  }
}
