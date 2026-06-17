import { BadRequestException, Injectable } from '@nestjs/common';
import { GeneratedOpenApiTool, ParsedOperation, ParsedSpec } from './openapi.types';

const MAX_TOOLS_PER_SPEC = 100;

@Injectable()
export class ToolGeneratorService {
  generateTools(parsedSpec: ParsedSpec, integrationUuid: string): GeneratedOpenApiTool[] {
    if (parsedSpec.operations.length > MAX_TOOLS_PER_SPEC) {
      throw new BadRequestException('OpenAPI specs can generate at most 100 tools');
    }

    const prefix = `openapi_${integrationUuid.slice(0, 8)}__`;
    const usedNames = new Set<string>();

    return parsedSpec.operations.map((operation) => {
      const key = sanitizeOperationId(operation.operationId);
      const uniqueKey = uniqueName(key, usedNames);

      return {
        key: uniqueKey,
        name: `${prefix}${uniqueKey}`,
        description: buildDescription(operation),
        parameters: buildParameters(operation),
        operation: { ...operation, operationId: uniqueKey },
      };
    });
  }
}

function buildDescription(operation: ParsedOperation) {
  return [operation.summary, operation.description].filter(Boolean).join('\n\n') || `${operation.method} ${operation.path}`;
}

function buildParameters(operation: ParsedOperation) {
  const properties: Record<string, any> = {};
  const required = new Set<string>();

  for (const parameter of operation.parameters) {
    properties[parameter.name] = {
      ...normalizeJsonSchema(parameter.schema),
      description: parameter.description ?? `${capitalize(parameter.in)} parameter: ${parameter.name}`,
    };

    if (parameter.required) {
      required.add(parameter.name);
    }
  }

  if (operation.requestBody) {
    properties.body = normalizeJsonSchema(operation.requestBody);
    required.add('body');
  }

  return {
    type: 'object',
    properties,
    required: Array.from(required),
    additionalProperties: false,
  };
}

function normalizeJsonSchema(schema: Record<string, any>) {
  const copy = JSON.parse(JSON.stringify(schema ?? {}));

  if (!copy.type && copy.properties) {
    copy.type = 'object';
  }

  if (!copy.type) {
    copy.type = 'string';
  }

  return copy;
}

function sanitizeOperationId(operationId: string) {
  const sanitized = operationId
    .replace(/[^A-Za-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');

  return sanitized || 'call';
}

function uniqueName(name: string, usedNames: Set<string>) {
  let candidate = name;
  let suffix = 2;

  while (usedNames.has(candidate)) {
    candidate = `${name}_${suffix}`;
    suffix += 1;
  }

  usedNames.add(candidate);
  return candidate;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
