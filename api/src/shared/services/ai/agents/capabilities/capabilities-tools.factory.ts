import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ToolCallStatus } from 'generated/prisma';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import type { AgentProgressScope } from '../progress/agent-progress-scope';
import { ExecutionToolIdempotencyService } from '../tools/dispatch/execution-tool-idempotency.service';
import { CapabilitiesToolsService } from './capabilities-tools.service';
import { normalizeToolkitConnectionTierMap } from './toolkit-connection-tiers.utils';

export interface CapabilitiesToolsFactoryContext {
  organizationUuid: string;
  userUuid?: string;
  executionUuid: string;
  integrationUuids?: string[];
  toolkitSlugs?: string[];
  toolkitConnectionTiers?: Record<string, string>;
  progress?: AgentProgressScope;
}

@Injectable()
export class CapabilitiesToolsFactory {
  constructor(
    private readonly capabilities: CapabilitiesToolsService,
    private readonly prisma: PrismaService,
    private readonly idempotency: ExecutionToolIdempotencyService,
  ) {}

  buildTools(context: CapabilitiesToolsFactoryContext): ToolSet {
    const toolContext = {
      organizationUuid: context.organizationUuid,
      userUuid: context.userUuid,
      integrationUuids: context.integrationUuids,
      toolkitSlugs: context.toolkitSlugs,
      toolkitConnectionTiers: normalizeToolkitConnectionTierMap(
        context.toolkitConnectionTiers,
      ),
    };

    return {
      capabilities__list_integrations: tool({
        description:
          'List active system integrations (database, OpenAPI, MCP) with their enabled action keys. Use when the user asks what is connected, what integrations exist, or before choosing integration tools.',
        inputSchema: jsonSchema({
          type: 'object',
          properties: {},
          additionalProperties: false,
        }),
        execute: async () =>
          this.runTool(context, 'capabilities__list_integrations', {}, async () =>
            this.capabilities.listIntegrations(toolContext),
          ),
      }),
      capabilities__list_toolkits: tool({
        description:
          'List Composio toolkits enabled for this organization and whether each has an active connection. Use when the user asks what toolkits are enabled, what external apps are available, or what you can do.',
        inputSchema: jsonSchema({
          type: 'object',
          properties: {},
          additionalProperties: false,
        }),
        execute: async () =>
          this.runTool(context, 'capabilities__list_toolkits', {}, async () =>
            this.capabilities.listToolkits(toolContext),
          ),
      }),
      capabilities__get_database_schema: tool({
        description:
          'Load the cached database schema for a connected database integration. Call capabilities__list_integrations first to find integration UUIDs with has_database_schema=true.',
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            integration_uuid: {
              type: 'string',
              description: 'Integration UUID from capabilities__list_integrations',
            },
          },
          required: ['integration_uuid'],
          additionalProperties: false,
        }),
        execute: async (input: { integration_uuid: string }) =>
          this.runTool(
            context,
            'capabilities__get_database_schema',
            input,
            async () =>
              this.capabilities.getDatabaseSchema(
                toolContext,
                input.integration_uuid,
              ),
          ),
      }),
    };
  }

  private async runTool<T>(
    context: CapabilitiesToolsFactoryContext,
    toolName: string,
    input: Record<string, unknown>,
    handler: () => Promise<T>,
  ) {
    const { progress, executionUuid } = context;
    const callId = progress?.toolStart(toolName, input);
    const started = Date.now();

    const cached = await this.idempotency.getCachedResult(
      executionUuid,
      toolName,
      input,
    );
    if (cached) {
      if (callId) {
        progress?.toolComplete(callId, {
          toolName,
          result: cached,
          durationMs: Date.now() - started,
          success: true,
          cached: true,
        });
      }
      return cached as T;
    }

    try {
      const result = await handler();
      await this.prisma.toolCall.create({
        data: {
          ...(callId ? { uuid: callId } : {}),
          execution_uuid: executionUuid,
          tool_name: toolName,
          input: input as object,
          output: result as object,
          status: ToolCallStatus.SUCCESS,
          duration_ms: Date.now() - started,
        },
      });
      if (callId) {
        progress?.toolComplete(callId, {
          toolName,
          result,
          durationMs: Date.now() - started,
          success: true,
        });
      }
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Capabilities tool failed';
      const failure = { error: message };
      await this.prisma.toolCall.create({
        data: {
          ...(callId ? { uuid: callId } : {}),
          execution_uuid: executionUuid,
          tool_name: toolName,
          input: input as object,
          output: failure as object,
          status: ToolCallStatus.FAILED,
          error: message,
          duration_ms: Date.now() - started,
        },
      });
      if (callId) {
        progress?.toolComplete(callId, {
          toolName,
          result: failure,
          durationMs: Date.now() - started,
          success: false,
        });
      }
      throw error instanceof Error ? error : new Error(message);
    }
  }
}
