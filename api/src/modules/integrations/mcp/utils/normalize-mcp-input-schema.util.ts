import { JsonSchemaObject } from '../types/mcp.types';

const INVALID_OBJECT_TYPES = new Set(['none', 'null', 'undefined']);

function extractRawSchema(schema: unknown): Record<string, unknown> {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    return {};
  }

  const raw = schema as Record<string, unknown>;

  if (
    raw.jsonSchema &&
    typeof raw.jsonSchema === 'object' &&
    !Array.isArray(raw.jsonSchema)
  ) {
    return raw.jsonSchema as Record<string, unknown>;
  }

  return raw;
}

function normalizeProperties(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function hasValidObjectType(type: unknown) {
  if (typeof type !== 'string') {
    return false;
  }

  return !INVALID_OBJECT_TYPES.has(type.toLowerCase());
}

export function normalizeMcpInputSchema(schema: unknown): JsonSchemaObject {
  const raw = extractRawSchema(schema);
  const properties = normalizeProperties(raw.properties);
  const required = Array.isArray(raw.required)
    ? raw.required.filter((entry): entry is string => typeof entry === 'string')
    : undefined;

  const normalized: JsonSchemaObject = {
    type: 'object',
    properties,
    additionalProperties: raw.additionalProperties ?? false,
  };

  if (required?.length) {
    normalized.required = required;
  }

  if (typeof raw.description === 'string') {
    normalized.description = raw.description;
  }

  if (!hasValidObjectType(raw.type) && Object.keys(properties).length === 0) {
    return normalized;
  }

  return normalized;
}
