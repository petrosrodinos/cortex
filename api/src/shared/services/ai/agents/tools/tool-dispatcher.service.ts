import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { IntegrationRegistry } from '@/modules/integrations/framework/registry/integration-registry.service';
import { IntegrationProvider, IntegrationStatus, ToolCallStatus } from 'generated/prisma';
import { calculateAiCost } from '@/integrations/ai/utils/ai-cost';
import { AiProviders } from '@/integrations/ai/interfaces/ai.interface';
import { DATABASE_PROVIDERS } from '@/modules/integrations/databases/database-integration.types';
import { ExecutionToolIdempotencyService } from './execution-tool-idempotency.service';
import { EmailToolPreprocessorService } from './email-tool-preprocessor.service';

export interface ToolDispatchResult {
  success: boolean;
  result?: unknown;
  error?: string;
  durationMs: number;
  tokensUsed: number;
  costUsd: number;
}

@Injectable()
export class ToolDispatcherService {
  private readonly logger = new Logger(ToolDispatcherService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: IntegrationRegistry,
    private readonly idempotency: ExecutionToolIdempotencyService,
    private readonly emailToolPreprocessor: EmailToolPreprocessorService,
  ) {}

  async dispatch(
    organizationUuid: string,
    userUuid: string,
    toolName: string,
    input: Record<string, unknown>,
    executionUuid: string,
    userPermissions: string[] = [],
  ): Promise<ToolDispatchResult> {
    const started = Date.now();

    try {
      const prepared = await this.emailToolPreprocessor.prepare(userUuid, toolName, input);
      await this.assertToolAllowed(organizationUuid, prepared.toolName, userPermissions);

      const cached = await this.idempotency.getCachedResult(executionUuid, toolName, input);
      if (cached) {
        const durationMs = Date.now() - started;
        return { success: true, result: cached, durationMs, tokensUsed: 0, costUsd: 0 };
      }

      const integrationUuid = await this.resolveIntegrationUuid(organizationUuid, prepared.toolName);
      const result = await this.registry.executeTool(organizationUuid, prepared.toolName, prepared.input);
      const durationMs = Date.now() - started;
      const tokensUsed = 0;
      const costUsd = 0;

      await this.prisma.toolCall.create({
        data: {
          execution_uuid: executionUuid,
          integration_uuid: integrationUuid,
          tool_name: prepared.toolName,
          input: prepared.input as object,
          output: result as object,
          status: ToolCallStatus.SUCCESS,
          tokens_used: tokensUsed,
          cost_usd: costUsd,
          duration_ms: durationMs,
        },
      });

      return { success: true, result, durationMs, tokensUsed, costUsd };
    } catch (error) {
      const durationMs = Date.now() - started;
      const message = error instanceof Error ? error.message : 'Tool execution failed';

      await this.prisma.toolCall.create({
        data: {
          execution_uuid: executionUuid,
          tool_name: toolName,
          input: input as object,
          output: { error: message },
          status: ToolCallStatus.FAILED,
          error: message,
          duration_ms: durationMs,
        },
      });

      this.logger.warn(`Tool ${toolName} failed: ${message}`);
      return { success: false, error: message, durationMs, tokensUsed: 0, costUsd: 0 };
    }
  }

  recordStepUsage(
    executionUuid: string,
    toolName: string,
    usage: { inputTokens?: number; outputTokens?: number },
    modelId: string,
  ) {
    const cost = calculateAiCost({
      provider: AiProviders.openai,
      model: modelId,
      inputTokens: usage.inputTokens ?? 0,
      outputTokens: usage.outputTokens ?? 0,
    });

    return this.prisma.toolCall.create({
      data: {
        execution_uuid: executionUuid,
        tool_name: `${toolName}:llm-step`,
        input: usage as object,
        output: cost as object,
        status: ToolCallStatus.SUCCESS,
        tokens_used: cost.totalTokens,
        cost_usd: cost.totalCost,
        duration_ms: 0,
      },
    });
  }

  async syncExecutionUsageTotals(executionUuid: string) {
    const aggregate = await this.prisma.toolCall.aggregate({
      where: { execution_uuid: executionUuid },
      _sum: { tokens_used: true, cost_usd: true },
    });

    await this.prisma.agentExecution.update({
      where: { uuid: executionUuid },
      data: {
        tokens_used: aggregate._sum.tokens_used ?? 0,
        cost_usd: aggregate._sum.cost_usd ?? 0,
      },
    });

    return {
      tokensUsed: aggregate._sum.tokens_used ?? 0,
      costUsd: Number(aggregate._sum.cost_usd ?? 0),
    };
  }

  private async assertToolAllowed(organizationUuid: string, toolName: string, userPermissions: string[]) {
    const actionKey = this.extractActionKey(toolName);
    const provider = this.extractProvider(toolName);

    if (!actionKey) {
      return;
    }

    const integration = await this.prisma.integration.findFirst({
      where: {
        org_uuid: organizationUuid,
        status: IntegrationStatus.ACTIVE,
        ...(provider ? { provider } : {}),
      },
      include: {
        actions: {
          where: { key: actionKey, enabled: true },
        },
      },
    });

    const action = integration?.actions[0];
    if (!action) {
      throw new ForbiddenException(`Tool ${toolName} is not enabled`);
    }

    if (action.required_permission_key && !userPermissions.includes(action.required_permission_key)) {
      throw new ForbiddenException(`Missing permission for tool ${toolName}`);
    }
  }

  private async resolveIntegrationUuid(organizationUuid: string, toolName: string): Promise<string | undefined> {
    const provider = this.extractProvider(toolName);
    if (!provider) {
      return undefined;
    }

    const integration = await this.prisma.integration.findFirst({
      where: { org_uuid: organizationUuid, provider, status: IntegrationStatus.ACTIVE },
      select: { uuid: true },
    });

    return integration?.uuid;
  }

  private extractActionKey(toolName: string): string | null {
    if (toolName.startsWith('db__')) {
      return toolName.replace('db__', '');
    }

    const openapiMatch = toolName.match(/^openapi_[^_]+__(.+)$/);
    if (openapiMatch) {
      return openapiMatch[1];
    }

    const mcpMatch = toolName.match(/^mcp_[^_]+__(.+)$/);
    if (mcpMatch) {
      return mcpMatch[1];
    }

    const parts = toolName.split('__');
    return parts.length > 1 ? parts.slice(1).join('__') : null;
  }

  private extractProvider(toolName: string): IntegrationProvider | null {
    if (toolName.startsWith('db__')) {
      return DATABASE_PROVIDERS[0] ?? null;
    }

    if (toolName.startsWith('openapi_')) {
      return IntegrationProvider.OPENAPI;
    }

    if (toolName.startsWith('mcp_')) {
      return IntegrationProvider.MCP;
    }

    const [providerKey] = toolName.split('__');
    if (!providerKey || providerKey === toolName) {
      return null;
    }

    return providerKey.toUpperCase() as IntegrationProvider;
  }
}
