import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ToolCallStatus } from 'generated/prisma';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import { ImageGeneratorService, type GeneratedImageResult } from './image-generator.service';

export interface OutputToolsContext {
  organizationUuid: string;
  userUuid: string;
  executionUuid: string;
  onToolEvent?: (event: 'start' | 'complete', payload: Record<string, unknown>) => void;
}

@Injectable()
export class OutputToolsFactory {
  constructor(
    private readonly imageGenerator: ImageGeneratorService,
    private readonly prisma: PrismaService,
  ) {}

  buildTools(context: OutputToolsContext): ToolSet {
    const { organizationUuid, userUuid, executionUuid, onToolEvent } = context;

    return {
      output__create_image: tool({
        description:
          'Generate an AI image from a text prompt using OpenAI image models. Use when the user asks to create, draw, generate, or design an image, illustration, photo, portrait, or graphic. Call this tool at most once per user request.',
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'Detailed description of the image to generate',
            },
            size: {
              type: 'string',
              enum: ['1024x1024', '1536x1024', '1024x1536', '1792x1024', '1024x1792'],
              description: 'Output dimensions. Default 1024x1024.',
            },
            quality: {
              type: 'string',
              enum: ['standard', 'hd'],
              description: 'Image quality (dall-e-3 only). Default standard.',
            },
            style: {
              type: 'string',
              enum: ['vivid', 'natural'],
              description: 'Image style (dall-e-3 only). Default vivid.',
            },
          },
          required: ['prompt'],
        }),
        execute: async (input: {
          prompt: string;
          size?: '1024x1024' | '1536x1024' | '1024x1536' | '1792x1024' | '1024x1792';
          quality?: 'standard' | 'hd';
          style?: 'vivid' | 'natural';
        }) => {
          onToolEvent?.('start', { toolName: 'output__create_image', input });
          const started = Date.now();

          try {
            const cached = await this.getCachedImageResult(executionUuid);
            if (cached) {
              onToolEvent?.('complete', {
                toolName: 'output__create_image',
                result: cached,
                durationMs: Date.now() - started,
                success: true,
              });
              return cached;
            }

            const result = await this.imageGenerator.generate(organizationUuid, userUuid, input);
            await this.prisma.toolCall.create({
              data: {
                execution_uuid: executionUuid,
                tool_name: 'output__create_image',
                input: input as object,
                output: result as object,
                status: ToolCallStatus.SUCCESS,
                duration_ms: Date.now() - started,
              },
            });
            onToolEvent?.('complete', {
              toolName: 'output__create_image',
              result,
              durationMs: Date.now() - started,
              success: true,
            });
            return result;
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Image generation failed';
            const failure = { error: message };
            await this.prisma.toolCall.create({
              data: {
                execution_uuid: executionUuid,
                tool_name: 'output__create_image',
                input: input as object,
                output: failure as object,
                status: ToolCallStatus.FAILED,
                error: message,
                duration_ms: Date.now() - started,
              },
            });
            onToolEvent?.('complete', {
              toolName: 'output__create_image',
              result: failure,
              durationMs: Date.now() - started,
              success: false,
            });
            return failure;
          }
        },
      }),
    };
  }

  private async getCachedImageResult(executionUuid: string): Promise<GeneratedImageResult | null> {
    const priorCall = await this.prisma.toolCall.findFirst({
      where: {
        execution_uuid: executionUuid,
        tool_name: 'output__create_image',
        status: ToolCallStatus.SUCCESS,
      },
      orderBy: { created_at: 'asc' },
    });

    if (!priorCall?.output || typeof priorCall.output !== 'object') {
      return null;
    }

    const output = priorCall.output as Record<string, unknown>;
    if (typeof output.file_url !== 'string') {
      return null;
    }

    return output as unknown as GeneratedImageResult;
  }
}
