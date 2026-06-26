import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { Integration, IntegrationProvider, OpenApiAuthType } from 'generated/prisma';
import { AiTool, IntegrationActionSeed } from '../../framework/interfaces/ai-tool.interface';
import { BaseIntegration } from '../../framework/base/base-integration';
import { OpenApiAuthConfig, OpenApiAuthService } from '../auth/openapi-auth.service';
import { resolveOpenApiServerUrl } from '../parser/openapi-parser.service';
import { GeneratedOpenApiTool, ParsedOperation } from '../types/openapi.types';

type OpenApiIntegrationRecord = {
  integration_uuid: string;
  spec_url?: string | null;
  base_url: string;
  auth_type: OpenApiAuthType;
  auth_config: string;
  generated_tools: GeneratedOpenApiTool[];
};

@Injectable()
export class OpenApiIntegration extends BaseIntegration {
  readonly provider = IntegrationProvider.OPENAPI;

  constructor(
    prisma: PrismaService,
    encryptionService: EncryptionService,
    private readonly authService: OpenApiAuthService,
  ) {
    super(prisma, encryptionService);
  }

  defaultActions(): IntegrationActionSeed[] {
    return [];
  }

  buildToolDefinitions(integration: Integration): AiTool[] {
    return this.getTools(integration);
  }

  getTools(integration: Integration & { openapi?: { generated_tools?: any } | null }): AiTool[] {
    const generatedTools = (integration.openapi?.generated_tools ?? []) as GeneratedOpenApiTool[];

    return generatedTools.map((tool) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));
  }

  async testConnection(config: Record<string, any>): Promise<boolean> {
    return Boolean(config?.specUrl || config?.rawJson);
  }

  async executeTool(toolName: string, input: Record<string, any>, integration: Integration): Promise<any> {
    try {
      await this.validateAction(integration, toolName);
      const openapi = await this.requireOpenApiIntegration(integration.uuid);
      const tool = openapi.generated_tools.find((generatedTool) => generatedTool.name === toolName);

      if (!tool) {
        throw new BadRequestException('Generated OpenAPI tool was not found');
      }

      const authConfig = JSON.parse(this.encryption_service.decrypt(openapi.auth_config)) as OpenApiAuthConfig;
      const credentials = this.decryptConfig(integration);
      const auth = this.operationRequiresAuth(tool.operation)
        ? this.authService.buildRequestAuth(authConfig, credentials)
        : { headers: {}, params: {} };
      const baseUrl = resolveOpenApiServerUrl(openapi.base_url, openapi.spec_url);
      const request = this.buildRequest(baseUrl, tool, input ?? {}, auth);
      const response = await axios.request({ ...request, timeout: 15_000 });

      return { success: true, status: response.status, data: response.data };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }

      return { success: false, error: 'OpenAPI tool execution failed' };
    }
  }

  protected resolveActionKey(toolName: string) {
    const [, key] = toolName.split('__');
    return key || toolName;
  }

  private operationRequiresAuth(operation: ParsedOperation) {
    return Array.isArray(operation.security) && operation.security.length > 0;
  }

  private async requireOpenApiIntegration(integrationUuid: string): Promise<OpenApiIntegrationRecord> {
    const openapi = await this.prisma.openApiIntegration.findUnique({
      where: { integration_uuid: integrationUuid },
    });

    if (!openapi) {
      throw new BadRequestException('OpenAPI integration configuration was not found');
    }

    return openapi as unknown as OpenApiIntegrationRecord;
  }

  private buildRequest(
    baseUrl: string,
    tool: GeneratedOpenApiTool,
    input: Record<string, any>,
    auth: { headers: Record<string, string>; params: Record<string, string> },
  ) {
    const operation = tool.operation;
    const pathParamNames = new Set(operation.parameters.filter((parameter) => parameter.in === 'path').map((parameter) => parameter.name));
    const queryParamNames = new Set(operation.parameters.filter((parameter) => parameter.in === 'query').map((parameter) => parameter.name));
    let path = operation.path;

    for (const name of pathParamNames) {
      if (input[name] === undefined || input[name] === null) {
        throw new BadRequestException(`Path parameter ${name} is required`);
      }

      path = path.replace(`{${name}}`, encodeURIComponent(String(input[name])));
    }

    const queryParams: Record<string, any> = { ...auth.params };

    for (const name of queryParamNames) {
      if (input[name] !== undefined) {
        queryParams[name] = input[name];
      }
    }

    return {
      method: operation.method,
      url: joinUrl(baseUrl, path),
      headers: auth.headers,
      params: queryParams,
      data: input.body,
    };
  }
}

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/g, '')}/${path.replace(/^\/+/g, '')}`;
}
