export type OpenApiParameterLocation = 'path' | 'query' | 'header' | 'cookie';

export interface ParsedOperationParameter {
  name: string;
  in: OpenApiParameterLocation;
  required: boolean;
  schema: Record<string, any>;
  description?: string;
}

export interface ParsedOperation {
  operationId: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  parameters: ParsedOperationParameter[];
  requestBody?: Record<string, any>;
  security?: Record<string, string[]>[];
}

export interface ParsedSpec {
  baseUrl: string;
  specJson: Record<string, any>;
  operations: ParsedOperation[];
  securitySchemes: Record<string, any>;
}

export interface GeneratedOpenApiTool {
  key: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  operation: ParsedOperation;
}
