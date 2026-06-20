import type { DatabaseIntegrationDetails } from '../../database/interfaces/database.interface';
import type { OpenApiIntegrationDetails } from '../../openapi/interfaces/openapi.interface';
import type { McpIntegrationDetails } from '../../mcp/interfaces/mcp.interface';

export const IntegrationProviders = {
  DATABASE_PG: 'DATABASE_PG',
  DATABASE_MYSQL: 'DATABASE_MYSQL',
  DATABASE_MONGO: 'DATABASE_MONGO',
  OPENAPI: 'OPENAPI',
  MCP: 'MCP',
} as const;

export type IntegrationProvider = (typeof IntegrationProviders)[keyof typeof IntegrationProviders];

export const IntegrationStatuses = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ERROR: 'ERROR',
} as const;

export type IntegrationStatus = (typeof IntegrationStatuses)[keyof typeof IntegrationStatuses];

export interface IntegrationAction {
  id: number;
  uuid: string;
  integration_uuid: string;
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  required_permission_key?: string | null;
}

export interface Integration {
  id: number;
  uuid: string;
  org_uuid: string;
  name: string;
  description?: string | null;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  metadata?: Record<string, unknown> | null;
  database?: DatabaseIntegrationDetails | null;
  openapi?: OpenApiIntegrationDetails | null;
  mcp?: McpIntegrationDetails | null;
  created_at: string;
  updated_at: string;
  actions?: IntegrationAction[];
}

export interface UpdateIntegrationDto {
  name?: string;
  description?: string | null;
  status?: IntegrationStatus;
  config?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ToggleIntegrationActionDto {
  enabled: boolean;
}

export interface TestIntegrationResponse {
  success: boolean;
}
