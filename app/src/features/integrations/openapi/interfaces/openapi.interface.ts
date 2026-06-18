export const OpenApiAuthTypes = {
  NONE: 'NONE',
  API_KEY: 'API_KEY',
  BEARER: 'BEARER',
  OAUTH2: 'OAUTH2',
  CUSTOM_HEADERS: 'CUSTOM_HEADERS',
} as const;

export type OpenApiAuthType = (typeof OpenApiAuthTypes)[keyof typeof OpenApiAuthTypes];

export interface GeneratedOpenApiTool {
  key: string;
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  operation: Record<string, unknown>;
}

export interface OpenApiIntegrationDetails {
  uuid: string;
  integration_uuid: string;
  spec_url?: string | null;
  spec_json?: Record<string, unknown>;
  base_url: string;
  auth_type: OpenApiAuthType;
  generated_tools: GeneratedOpenApiTool[];
  created_at?: string;
  updated_at?: string;
}

export interface ParseOpenApiSpecDto {
  specUrl?: string;
  rawJson?: string | Record<string, unknown>;
}

export interface ParseOpenApiSpecResponse {
  baseUrl: string;
  operationsCount: number;
  securitySchemes: Record<string, unknown>;
  inferredAuthType: OpenApiAuthType;
}

export interface CreateOpenApiIntegrationDto {
  name: string;
  description?: string;
  specUrl?: string;
  rawJson?: string | Record<string, unknown>;
  authType?: OpenApiAuthType;
  authConfig?: Record<string, unknown>;
  credentials?: Record<string, unknown>;
}
