import { BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { Integration, IntegrationProvider } from 'generated/prisma';
import { AiTool, IntegrationActionSeed } from '../framework/ai-tool.interface';
import { BaseIntegration } from '../framework/base-integration';

export type SaasActionDefinition = IntegrationActionSeed & {
  parameters: Record<string, any>;
  schema: z.ZodTypeAny;
};

export abstract class SaasIntegration extends BaseIntegration {
  abstract provider: IntegrationProvider;
  protected abstract readonly actions: SaasActionDefinition[];

  protected constructor(prisma: PrismaService, encryption_service: EncryptionService) {
    super(prisma, encryption_service);
  }

  defaultActions(): IntegrationActionSeed[] {
    return this.actions.map(({ key, label, description, enabled, required_permission_key }) => ({
      key,
      label,
      description,
      enabled,
      required_permission_key,
    }));
  }

  buildToolDefinitions(): AiTool[] {
    return this.getTools();
  }

  getTools(_integration?: Integration): AiTool[] {
    return this.actions.map((action) => ({
      type: 'function',
      function: {
        name: this.toolName(action.key),
        description: action.description,
        parameters: action.parameters,
      },
    }));
  }

  async executeTool(toolName: string, input: Record<string, any>, integration: Integration): Promise<any> {
    try {
      await this.validateAction(integration, toolName);
      const action = this.getAction(this.resolveActionKey(toolName));
      const validated_input = action.schema.parse(input ?? {});
      const config = this.decryptConfig(integration);

      return await this.executeValidatedTool(action.key, validated_input, config);
    } catch (error) {
      return this.toSafeError(error);
    }
  }

  async testConnection(config: Record<string, any>): Promise<boolean> {
    return this.requiredConfigKeys().every((key) => Boolean(config?.[key]));
  }

  protected abstract executeValidatedTool(
    actionKey: string,
    input: Record<string, any>,
    config: Record<string, any>,
  ): Promise<any>;

  protected requiredConfigKeys(): string[] {
    return [];
  }

  protected toolName(key: string) {
    return `${this.provider.toLowerCase()}__${key}`;
  }

  protected resolveActionKey(toolName: string) {
    const prefix = `${this.provider.toLowerCase()}__`;
    return toolName.startsWith(prefix) ? toolName.slice(prefix.length) : toolName;
  }

  protected getAction(key: string) {
    const action = this.actions.find((item) => item.key === key);

    if (!action) {
      throw new BadRequestException(`Unsupported ${this.provider} action: ${key}`);
    }

    return action;
  }

  protected jsonSchema(properties: Record<string, any> = {}, required: string[] = []) {
    return {
      type: 'object',
      properties,
      required,
      additionalProperties: false,
    };
  }

  protected async axiosRequest(config: Parameters<typeof axios.request>[0]) {
    const response = await axios.request(config);
    return { success: true, data: response.data };
  }

  protected toSafeError(error: unknown) {
    const any_error = error as any;
    const retry_after = any_error?.response?.headers?.['retry-after'] ?? any_error?.retryAfter;
    const status = any_error?.status ?? any_error?.response?.status;

    if (status === 429 || retry_after) {
      return {
        success: false,
        error: 'rate_limited',
        retryAfter: retry_after ? Number(retry_after) : undefined,
      };
    }

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: 'Integration tool execution failed' };
  }
}

export const emptySchema = z.object({}).passthrough();
export const optionalString = z.string().optional();
export const optionalNumber = z.coerce.number().optional();

export async function loadRuntimePackage<T = any>(packageName: string): Promise<T> {
  const importer = new Function('packageName', 'return import(packageName)');
  return (await importer(packageName)) as T;
}
