import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ToolCallStatus } from 'generated/prisma';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import type { AgentProgressScope } from '../progress/agent-progress-scope';
import {
  buildUserChoiceToolResult,
  INTERACTION_PRESENT_CHOICES_TOOL,
  parseUserChoiceRequest,
  validateUserChoiceSelection,
  type UserChoiceResponse,
} from './interaction-tools.types';

export interface InteractionToolsFactoryContext {
  executionUuid: string;
  progress?: AgentProgressScope;
}

@Injectable()
export class InteractionToolsFactory {
  constructor(private readonly prisma: PrismaService) {}

  buildTools(context: InteractionToolsFactoryContext): ToolSet {
    return {
      [INTERACTION_PRESENT_CHOICES_TOOL]: tool({
        description:
          'Present a structured choice menu to the user when multiple valid options exist and the next action depends on their selection. Fetch real options with integration tools first, then call this tool with those options. Use selection_mode single when exactly one choice is required, or multiple when the user may pick several.',
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'Short title shown above the choice menu',
            },
            description: {
              type: 'string',
              description: 'Optional helper text explaining why the user should choose',
            },
            selection_mode: {
              type: 'string',
              enum: ['single', 'multiple'],
              description:
                'Use single when exactly one option is required. Use multiple when the user may select more than one.',
            },
            options: {
              type: 'array',
              minItems: 2,
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Stable identifier returned after the user selects this option',
                  },
                  label: {
                    type: 'string',
                    description: 'Human-readable option label',
                  },
                  description: {
                    type: 'string',
                    description: 'Optional supporting detail for the option',
                  },
                },
                required: ['id', 'label'],
                additionalProperties: false,
              },
            },
          },
          required: ['prompt', 'selection_mode', 'options'],
          additionalProperties: false,
        }),
        needsApproval: true,
        execute: async (input) =>
          this.runPresentChoices(context, input as Record<string, unknown>),
      }),
    };
  }

  private async runPresentChoices(
    context: InteractionToolsFactoryContext,
    input: Record<string, unknown>,
  ) {
    const toolName = INTERACTION_PRESENT_CHOICES_TOOL;
    const callId = context.progress?.toolStart(toolName, input);
    const started = Date.now();

    try {
      const choiceRequest = parseUserChoiceRequest(input);
      if (!choiceRequest) {
        throw new BadRequestException('Invalid choice menu payload');
      }

      const execution = await this.prisma.agentExecution.findUnique({
        where: { uuid: context.executionUuid },
        select: { input: true },
      });
      const savedInput = (execution?.input ?? {}) as {
        userChoiceResponse?: UserChoiceResponse;
      };
      const selectedIds = savedInput.userChoiceResponse?.selected_ids;

      if (!selectedIds?.length) {
        throw new BadRequestException('User choice response is missing');
      }

      validateUserChoiceSelection(choiceRequest, selectedIds);
      const result = buildUserChoiceToolResult(choiceRequest, selectedIds);
      const durationMs = Date.now() - started;

      await this.prisma.toolCall.create({
        data: {
          ...(callId ? { uuid: callId } : {}),
          execution_uuid: context.executionUuid,
          tool_name: toolName,
          input: input as object,
          output: result as object,
          status: ToolCallStatus.SUCCESS,
          duration_ms: durationMs,
        },
      });

      if (callId) {
        context.progress?.toolComplete(callId, {
          toolName,
          result,
          durationMs,
          success: true,
        });
      }

      return result;
    } catch (error) {
      const durationMs = Date.now() - started;
      const message =
        error instanceof BadRequestException
          ? String(error.getResponse())
          : error instanceof Error
            ? error.message
            : 'Choice tool failed';
      const failure = { error: message };

      await this.prisma.toolCall.create({
        data: {
          ...(callId ? { uuid: callId } : {}),
          execution_uuid: context.executionUuid,
          tool_name: toolName,
          input: input as object,
          output: failure as object,
          status: ToolCallStatus.FAILED,
          error: message,
          duration_ms: durationMs,
        },
      });

      if (callId) {
        context.progress?.toolComplete(callId, {
          toolName,
          result: failure,
          durationMs,
          success: false,
        });
      }

      throw error;
    }
  }
}
