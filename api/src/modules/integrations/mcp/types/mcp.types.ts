import { McpAuthType, McpTransportType } from 'generated/prisma';

export const MCP_TOOL_LIMIT = 100;

export type JsonSchemaObject = Record<string, unknown>;

export interface DiscoveredMcpTool {
  name: string;
  serverToolName: string;
  description: string;
  parameters: JsonSchemaObject;
}

export interface McpAuthConfig {
  allowedAuthorizationServerOrigins?: string[];
}

export interface McpCredentials {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  headers?: Record<string, string>;
  clientId?: string;
  clientSecret?: string;
  tokenEndpoint?: string;
}

export interface McpConnectionConfig {
  serverUrl: string;
  transportType: McpTransportType;
  authType: McpAuthType;
  authConfig: McpAuthConfig;
  credentials: McpCredentials;
  integrationUuid?: string;
}

export interface McpDiscoveryResult {
  serverName?: string;
  tools: DiscoveredMcpTool[];
}

export interface McpTestConnectionResult {
  success: boolean;
  serverName?: string;
  toolCount?: number;
  error?: string;
}

export function buildMcpToolName(integrationUuid: string, serverToolName: string) {
  return `mcp_${integrationUuid.slice(0, 8)}__${serverToolName}`;
}
