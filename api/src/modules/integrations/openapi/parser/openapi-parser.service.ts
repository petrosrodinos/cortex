import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import SwaggerParser from '@apidevtools/swagger-parser';
import { convertObj } from 'swagger2openapi';
import { ParsedOperation, ParsedOperationParameter, ParsedSpec } from '../types/openapi.types';

const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options']);

export function resolveOpenApiServerUrl(serverUrl: string, specUrl?: string | null) {
  const trimmed = serverUrl.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/+$/g, '');
  }

  if (!specUrl) {
    throw new BadRequestException(
      'OpenAPI server URL is relative but no spec URL was provided to resolve it against',
    );
  }

  try {
    return new URL(trimmed, specUrl).href.replace(/\/+$/g, '');
  } catch {
    throw new BadRequestException('OpenAPI server URL could not be resolved');
  }
}

@Injectable()
export class OpenApiParserService {
  async parse(input: { specUrl?: string; rawJson?: Record<string, any> | string }): Promise<ParsedSpec> {
    const rawSpec = await this.loadRawSpec(input);
    const normalized = await this.normalizeSpec(rawSpec);
    const dereferenced = (await SwaggerParser.dereference(normalized as any)) as Record<string, any>;
    const operations = this.extractOperations(dereferenced);

    return {
      baseUrl: this.extractBaseUrl(dereferenced, input.specUrl),
      specJson: dereferenced,
      operations,
      securitySchemes: dereferenced.components?.securitySchemes ?? {},
    };
  }

  private async loadRawSpec(input: { specUrl?: string; rawJson?: Record<string, any> | string }) {
    if (input.specUrl) {
      const response = await axios.get(input.specUrl, { timeout: 10_000 });
      return response.data;
    }

    if (typeof input.rawJson === 'string') {
      try {
        return JSON.parse(input.rawJson);
      } catch {
        throw new BadRequestException('OpenAPI JSON is not valid JSON');
      }
    }

    if (input.rawJson && typeof input.rawJson === 'object') {
      return input.rawJson;
    }

    throw new BadRequestException('Provide either specUrl or rawJson');
  }

  private async normalizeSpec(rawSpec: Record<string, any>) {
    if (rawSpec.openapi?.startsWith?.('3.')) {
      return rawSpec;
    }

    if (rawSpec.swagger === '2.0') {
      const result = await convertObj(rawSpec, { patch: true, warnOnly: true });
      return result.openapi;
    }

    throw new BadRequestException('Only OpenAPI 3.x and Swagger 2.x specs are supported');
  }

  private extractBaseUrl(spec: Record<string, any>, specUrl?: string) {
    const serverUrl = spec.servers?.find?.((server: any) => typeof server?.url === 'string')?.url;

    if (!serverUrl) {
      throw new BadRequestException('OpenAPI spec must define at least one server URL');
    }

    return resolveOpenApiServerUrl(serverUrl, specUrl);
  }

  private extractOperations(spec: Record<string, any>): ParsedOperation[] {
    const operations: ParsedOperation[] = [];

    for (const [path, pathItem] of Object.entries<Record<string, any>>(spec.paths ?? {})) {
      const pathParameters = this.normalizeParameters(pathItem.parameters ?? []);

      for (const [method, operation] of Object.entries<Record<string, any>>(pathItem)) {
        if (!HTTP_METHODS.has(method)) {
          continue;
        }

        const operationParameters = this.normalizeParameters(operation.parameters ?? []);
        const parameters = [...pathParameters, ...operationParameters];

        operations.push({
          operationId: operation.operationId || operationIdFromMethodAndPath(method, path),
          method: method.toUpperCase(),
          path,
          summary: operation.summary,
          description: operation.description,
          parameters,
          requestBody: this.extractRequestBodySchema(operation.requestBody),
          security: operation.security ?? spec.security,
        });
      }
    }

    return operations;
  }

  private normalizeParameters(parameters: any[]): ParsedOperationParameter[] {
    return parameters.map((parameter) => ({
      name: parameter.name,
      in: parameter.in,
      required: Boolean(parameter.required || parameter.in === 'path'),
      schema: parameter.schema ?? {},
      description: parameter.description,
    }));
  }

  private extractRequestBodySchema(requestBody: any) {
    const content = requestBody?.content;
    const json = content?.['application/json'] ?? content?.['application/*+json'];
    const firstContent = json ?? Object.values(content ?? {})[0] as any;
    return firstContent?.schema;
  }
}

export function operationIdFromMethodAndPath(method: string, path: string) {
  const cleanedPath = path
    .replace(/[{}]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return `${method.toLowerCase()}_${cleanedPath}`.replace(/_+/g, '_');
}
