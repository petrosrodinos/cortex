import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ToolCallStatus } from 'generated/prisma';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import type { AgentProgressScope } from '../progress/agent-progress-scope';
import { ExecutionToolIdempotencyService } from '../tools/dispatch/execution-tool-idempotency.service';
import { DocumentBoardToolsService } from './document-board-tools.service';

export interface DocumentBoardToolsFactoryContext {
  organizationUuid: string;
  userUuid: string;
  executionUuid: string;
  progress?: AgentProgressScope;
}

const BOARD_LOOKUP_SCHEMA = {
  type: 'object',
  properties: {
    board_uuid: {
      type: 'string',
      description: 'Document board UUID from document_board__list_boards',
    },
    board_name: {
      type: 'string',
      description:
        'Board name or partial name (case-insensitive). Use when the user refers to a board by name, e.g. "subscriptions".',
    },
  },
  additionalProperties: false,
} as const;

@Injectable()
export class DocumentBoardToolsFactory {
  constructor(
    private readonly documentBoardTools: DocumentBoardToolsService,
    private readonly prisma: PrismaService,
    private readonly idempotency: ExecutionToolIdempotencyService,
  ) {}

  buildTools(context: DocumentBoardToolsFactoryContext): ToolSet {
    const toolContext = {
      organizationUuid: context.organizationUuid,
      userUuid: context.userUuid,
    };

    return {
      document_board__list_boards: tool({
        description:
          'List all document boards in the organization with document counts. Use when the user asks what boards exist, what documents are on boards, or before creating or uploading to a board.',
        inputSchema: jsonSchema({
          type: 'object',
          properties: {},
          additionalProperties: false,
        }),
        execute: async () =>
          this.runTool(context, 'document_board__list_boards', {}, async () =>
            this.documentBoardTools.listBoards(toolContext),
          ),
      }),
      document_board__get_board: tool({
        description:
          'Get one document board and every document on it. Use when the user asks what documents are on a specific board. Identify the board with board_uuid or board_name.',
        inputSchema: jsonSchema({
          ...BOARD_LOOKUP_SCHEMA,
          minProperties: 1,
        }),
        execute: async (input: { board_uuid?: string; board_name?: string }) =>
          this.runTool(context, 'document_board__get_board', input, async () =>
            this.documentBoardTools.getBoard(toolContext, input),
          ),
      }),
      document_board__create_board: tool({
        description:
          'Create a new document board. Provide a short descriptive name. If the user did not give a name, infer one from conversation context or ask them. When they say "create a board for the subscriptions document", name the board after that topic (e.g. "Subscriptions") without asking.',
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Board display name',
            },
            description: {
              type: 'string',
              description: 'Optional board description',
            },
          },
          required: ['name'],
          additionalProperties: false,
        }),
        execute: async (input: { name: string; description?: string }) =>
          this.runTool(context, 'document_board__create_board', input, async () =>
            this.documentBoardTools.createBoard(toolContext, input),
          ),
      }),
      document_board__add_document: tool({
        description:
          'Add a generated or uploaded document to a document board. Use document_uuid from the most recent output__create_* tool result or generatedDocuments metadata when the user says "upload it to the board" without naming a file. Identify the board with board_uuid or board_name (e.g. "subscriptions"). Set title from context when obvious; otherwise ask or derive from the filename.',
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            ...BOARD_LOOKUP_SCHEMA.properties,
            document_uuid: {
              type: 'string',
              description:
                'Document UUID from output__create_* tools, generatedDocuments metadata, or document__list',
            },
            title: {
              type: 'string',
              description:
                'Optional display title on the board. Defaults to the document filename.',
            },
          },
          required: ['document_uuid'],
          additionalProperties: false,
        }),
        execute: async (input: {
          board_uuid?: string;
          board_name?: string;
          document_uuid: string;
          title?: string;
        }) =>
          this.runTool(context, 'document_board__add_document', input, async () =>
            this.documentBoardTools.addDocument(toolContext, input),
          ),
      }),
    };
  }

  private async runTool<T>(
    context: DocumentBoardToolsFactoryContext,
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
        error instanceof Error ? error.message : 'Document board tool failed';
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
