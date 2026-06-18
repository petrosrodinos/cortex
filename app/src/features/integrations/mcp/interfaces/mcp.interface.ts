export const McpTransportTypes = {
  HTTP: 'HTTP',
  SSE: 'SSE',
} as const;

export type McpTransportType = (typeof McpTransportTypes)[keyof typeof McpTransportTypes];

export const McpAuthTypes = {
  NONE: 'NONE',
  BEARER: 'BEARER',
  CUSTOM_HEADERS: 'CUSTOM_HEADERS',
  OAUTH: 'OAUTH',
} as const;

export type McpAuthType = (typeof McpAuthTypes)[keyof typeof McpAuthTypes];

export interface DiscoveredMcpTool {
  name: string;
  serverToolName: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface McpIntegrationDetails {
  uuid: string;
  integration_uuid: string;
  server_url: string;
  transport_type: McpTransportType;
  auth_type: McpAuthType;
  server_name?: string | null;
  discovered_tools: DiscoveredMcpTool[];
  last_tool_sync?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMcpIntegrationDto {
  name: string;
  description?: string;
  serverUrl: string;
  transportType?: McpTransportType;
  authType?: McpAuthType;
  authConfig?: Record<string, unknown>;
  credentials?: Record<string, unknown>;
}

export interface TestMcpConnectionDto {
  serverUrl: string;
  transportType?: McpTransportType;
  authType?: McpAuthType;
  authConfig?: Record<string, unknown>;
  credentials?: Record<string, unknown>;
}

export interface TestMcpConnectionResponse {
  success: boolean;
  serverName?: string;
  toolCount?: number;
  error?: string;
}
