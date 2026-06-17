import { Injectable } from '@nestjs/common';
import { McpAuthType } from 'generated/prisma';
import { createMCPClient, type MCPClient } from '@ai-sdk/mcp';
import { McpAuthService } from '../auth/mcp-auth.service';
import { McpConnectionConfig } from '../types/mcp.types';

@Injectable()
export class McpClientFactory {
  constructor(private readonly authService: McpAuthService) {}

  async createClient(
    config: McpConnectionConfig,
    onTokensRefreshed?: (credentials: McpConnectionConfig['credentials']) => Promise<void>,
  ): Promise<MCPClient> {
    let credentials = config.credentials;

    if (config.authType === McpAuthType.OAUTH) {
      credentials = await this.authService.refreshOAuthCredentialsIfNeeded(config.authConfig, credentials);

      if (credentials !== config.credentials) {
        await onTokensRefreshed?.(credentials);
      }
    }

    const transportAuth = this.authService.buildTransportAuth(
      config.authType,
      config.authConfig,
      credentials,
      onTokensRefreshed,
    );

    const transport =
      config.transportType === 'SSE'
        ? {
            type: 'sse' as const,
            url: config.serverUrl,
            headers: transportAuth.headers,
            authProvider: transportAuth.authProvider,
            redirect: 'error' as const,
          }
        : {
            type: 'http' as const,
            url: config.serverUrl,
            headers: transportAuth.headers,
            authProvider: transportAuth.authProvider,
            redirect: 'error' as const,
          };

    return await createMCPClient({ transport });
  }
}
