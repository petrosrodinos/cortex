import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ToolCallStatus } from 'generated/prisma';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import type { AgentProgressScope } from '../progress/agent-progress-scope';
import { ExecutionToolIdempotencyService } from '../tools/dispatch/execution-tool-idempotency.service';
import { OrganizationToolsService } from './organization-tools.service';

export interface OrganizationToolsFactoryContext {
  organizationUuid: string;
  userUuid: string;
  executionUuid: string;
  userPermissions: string[];
  progress?: AgentProgressScope;
}

@Injectable()
export class OrganizationToolsFactory {
  constructor(
    private readonly organizationTools: OrganizationToolsService,
    private readonly prisma: PrismaService,
    private readonly idempotency: ExecutionToolIdempotencyService,
  ) {}

  buildTools(context: OrganizationToolsFactoryContext): ToolSet {
    const toolContext = {
      organizationUuid: context.organizationUuid,
      userUuid: context.userUuid,
      userPermissions: context.userPermissions,
    };

    return {
      organization__get_account: tool({
        description:
          'Get the current organization account profile, including name, slug, logo, member count, and the authenticated user role and email.',
        inputSchema: jsonSchema({ type: 'object', properties: {}, additionalProperties: false }),
        execute: async () =>
          this.runTool(context, 'organization__get_account', {}, async () =>
            this.organizationTools.getAccount(toolContext),
          ),
      }),
      organization__list_members: tool({
        description:
          'List organization team members with optional email search and status filter. Returns member UUID, role, status, and user email.',
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            search: {
              type: 'string',
              description: 'Optional partial email search',
            },
            status: {
              type: 'string',
              enum: ['INVITED', 'ACTIVE', 'SUSPENDED'],
              description: 'Optional member status filter',
            },
          },
          additionalProperties: false,
        }),
        execute: async (input: { search?: string; status?: 'INVITED' | 'ACTIVE' | 'SUSPENDED' }) =>
          this.runTool(context, 'organization__list_members', input, async () =>
            this.organizationTools.listMembers(toolContext, input),
          ),
      }),
      organization__get_member: tool({
        description:
          'Get one organization team member by member_uuid or email. Use when you need to confirm a team member recipient email address.',
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            member_uuid: {
              type: 'string',
              description: 'Organization member UUID',
            },
            email: {
              type: 'string',
              description: 'Member account email address',
            },
          },
          additionalProperties: false,
        }),
        execute: async (input: { member_uuid?: string; email?: string }) =>
          this.runTool(context, 'organization__get_member', input, async () =>
            this.organizationTools.getMember(toolContext, input),
          ),
      }),
    };
  }

  private async runTool<T>(
    context: OrganizationToolsFactoryContext,
    toolName: string,
    input: Record<string, unknown>,
    handler: () => Promise<T>,
  ) {
    const { progress, executionUuid } = context;
    const callId = progress?.toolStart(toolName, input);
    const started = Date.now();

    const cached = await this.idempotency.getCachedResult(executionUuid, toolName, input);
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
      const message = error instanceof Error ? error.message : 'Organization tool execution failed';
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
