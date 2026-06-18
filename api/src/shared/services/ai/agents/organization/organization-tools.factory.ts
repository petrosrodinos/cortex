import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ToolCallStatus } from 'generated/prisma';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import { ExecutionToolIdempotencyService } from '../tools/execution-tool-idempotency.service';
import { OrganizationToolsService } from './organization-tools.service';

export interface OrganizationToolsFactoryContext {
  organizationUuid: string;
  userUuid: string;
  executionUuid: string;
  userPermissions: string[];
  onToolEvent?: (event: 'start' | 'complete', payload: Record<string, unknown>) => void;
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
          'Get the current organization account profile, including name, slug, logo, member count, and the requesting user role.',
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
          'Get one organization team member by member_uuid or email. Use before sending email when you need to confirm the recipient.',
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
      organization__send_member_email: tool({
        description:
          'Send an email to an organization team member using the organization email integration (SendGrid, Resend, SMTP, or Gmail). Provide member_uuid or email plus subject and body.',
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
            subject: {
              type: 'string',
              description: 'Email subject line',
            },
            body: {
              type: 'string',
              description: 'Email body (plain text or HTML)',
            },
            cc: {
              type: 'string',
              description: 'Optional comma-separated CC recipients',
            },
            bcc: {
              type: 'string',
              description: 'Optional comma-separated BCC recipients',
            },
            reply_to: {
              type: 'string',
              description: 'Optional reply-to email address',
            },
          },
          required: ['subject', 'body'],
          additionalProperties: false,
        }),
        needsApproval: true,
        execute: async (input: {
          member_uuid?: string;
          email?: string;
          subject: string;
          body: string;
          cc?: string;
          bcc?: string;
          reply_to?: string;
        }) =>
          this.runTool(context, 'organization__send_member_email', input, async () =>
            this.organizationTools.sendMemberEmail(toolContext, input),
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
    context.onToolEvent?.('start', { toolName, input });
    const started = Date.now();

    const cached = await this.idempotency.getCachedResult(context.executionUuid, toolName, input);
    if (cached) {
      context.onToolEvent?.('complete', {
        toolName,
        result: cached,
        durationMs: Date.now() - started,
        success: true,
        cached: true,
      });
      return cached as T;
    }

    try {
      const result = await handler();
      await this.prisma.toolCall.create({
        data: {
          execution_uuid: context.executionUuid,
          tool_name: toolName,
          input: input as object,
          output: result as object,
          status: ToolCallStatus.SUCCESS,
          duration_ms: Date.now() - started,
        },
      });
      context.onToolEvent?.('complete', {
        toolName,
        result,
        durationMs: Date.now() - started,
        success: true,
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Organization tool execution failed';
      const failure = { error: message };
      await this.prisma.toolCall.create({
        data: {
          execution_uuid: context.executionUuid,
          tool_name: toolName,
          input: input as object,
          output: failure as object,
          status: ToolCallStatus.FAILED,
          error: message,
          duration_ms: Date.now() - started,
        },
      });
      context.onToolEvent?.('complete', {
        toolName,
        result: failure,
        durationMs: Date.now() - started,
        success: false,
      });
      return failure;
    }
  }
}
