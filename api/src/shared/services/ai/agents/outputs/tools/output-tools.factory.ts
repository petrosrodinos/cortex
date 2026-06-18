import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ToolCallStatus } from 'generated/prisma';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import { ExcelGeneratorService } from '../excel/excel-generator.service';
import type { ExcelGenerateParams } from '../excel/excel.types';
import { ImageGeneratorService } from '../image/image-generator.service';
import type { GeneratedImageResult } from '../image/image.types';
import { PdfGeneratorService } from '../pdf/pdf-generator.service';
import type { GeneratedFileResult } from '../shared/generated-file.types';
import type { DocxGenerateParams } from '../word/docx.types';
import { WordGeneratorService } from '../word/word-generator.service';
import { ExecutionToolIdempotencyService } from '../../tools/execution-tool-idempotency.service';

export interface OutputToolsContext {
  organizationUuid: string;
  userUuid: string;
  executionUuid: string;
  onToolEvent?: (event: 'start' | 'complete', payload: Record<string, unknown>) => void;
}

const DOCUMENT_TOOL_SCHEMA = jsonSchema({
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'Document title shown at the top of the file',
    },
    sections: {
      type: 'array',
      description: 'Document body sections with optional headings and paragraph text',
      items: {
        type: 'object',
        properties: {
          heading: { type: 'string' },
          body: { type: 'string' },
        },
        required: ['body'],
      },
    },
    tables: {
      type: 'array',
      description: 'Optional tables appended after sections',
      items: {
        type: 'object',
        properties: {
          headers: {
            type: 'array',
            items: { type: 'string' },
          },
          rows: {
            type: 'array',
            items: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        required: ['headers', 'rows'],
      },
    },
  },
  required: ['title', 'sections'],
});

const EXCEL_TOOL_SCHEMA = jsonSchema({
  type: 'object',
  properties: {
    sheets: {
      type: 'array',
      description: 'One or more spreadsheet sheets to include in the workbook',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Sheet tab name (max 31 characters)' },
          headers: {
            type: 'array',
            items: { type: 'string' },
          },
          rows: {
            type: 'array',
            items: {
              type: 'array',
              items: { type: ['string', 'number'] },
            },
          },
        },
        required: ['headers', 'rows'],
      },
    },
  },
  required: ['sheets'],
});

@Injectable()
export class OutputToolsFactory {
  constructor(
    private readonly imageGenerator: ImageGeneratorService,
    private readonly wordGenerator: WordGeneratorService,
    private readonly pdfGenerator: PdfGeneratorService,
    private readonly excelGenerator: ExcelGeneratorService,
    private readonly prisma: PrismaService,
    private readonly idempotency: ExecutionToolIdempotencyService,
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
          return this.executeSideEffectTool({
            toolName: 'output__create_image',
            input,
            executionUuid,
            onToolEvent,
            run: () => this.imageGenerator.generate(organizationUuid, userUuid, input),
          });
        },
      }),

      output__create_word: tool({
        description:
          'Create a Word (.docx) document from structured content. Use when the user asks to create, export, or generate a Word document or .docx file.',
        inputSchema: DOCUMENT_TOOL_SCHEMA,
        execute: async (input: DocxGenerateParams) => {
          return this.executeSideEffectTool({
            toolName: 'output__create_word',
            input,
            executionUuid,
            onToolEvent,
            run: () => this.wordGenerator.generate(organizationUuid, userUuid, input),
          });
        },
      }),

      output__create_pdf: tool({
        description:
          'Create a PDF document from structured content. Use when the user asks to create, export, or generate a PDF file or report.',
        inputSchema: DOCUMENT_TOOL_SCHEMA,
        execute: async (input: DocxGenerateParams) => {
          return this.executeSideEffectTool({
            toolName: 'output__create_pdf',
            input,
            executionUuid,
            onToolEvent,
            run: () => this.pdfGenerator.generate(organizationUuid, userUuid, input),
          });
        },
      }),

      output__create_excel: tool({
        description:
          'Create an Excel (.xlsx) spreadsheet from structured data. Use when the user asks to create, export, or generate a spreadsheet, Excel file, or .xlsx workbook.',
        inputSchema: EXCEL_TOOL_SCHEMA,
        execute: async (input: ExcelGenerateParams) => {
          return this.executeSideEffectTool({
            toolName: 'output__create_excel',
            input,
            executionUuid,
            onToolEvent,
            run: () => this.excelGenerator.generate(organizationUuid, userUuid, input),
          });
        },
      }),
    };
  }

  private async executeSideEffectTool<T extends object>(options: {
    toolName: string;
    input: T;
    executionUuid: string;
    onToolEvent?: OutputToolsContext['onToolEvent'];
    run: () => Promise<GeneratedImageResult | GeneratedFileResult>;
  }) {
    const { toolName, input, executionUuid, onToolEvent, run } = options;
    onToolEvent?.('start', { toolName, input });
    const started = Date.now();

    try {
      const cached = await this.idempotency.getCachedResult<GeneratedImageResult | GeneratedFileResult>(
        executionUuid,
        toolName,
        input as Record<string, unknown>,
      );
      if (cached) {
        onToolEvent?.('complete', {
          toolName,
          result: cached,
          durationMs: Date.now() - started,
          success: true,
        });
        return cached;
      }

      const result = await run();
      await this.prisma.toolCall.create({
        data: {
          execution_uuid: executionUuid,
          tool_name: toolName,
          input: input as object,
          output: result as object,
          status: ToolCallStatus.SUCCESS,
          duration_ms: Date.now() - started,
        },
      });
      onToolEvent?.('complete', {
        toolName,
        result,
        durationMs: Date.now() - started,
        success: true,
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : `${toolName} failed`;
      const failure = { error: message };
      await this.prisma.toolCall.create({
        data: {
          execution_uuid: executionUuid,
          tool_name: toolName,
          input: input as object,
          output: failure as object,
          status: ToolCallStatus.FAILED,
          error: message,
          duration_ms: Date.now() - started,
        },
      });
      onToolEvent?.('complete', {
        toolName,
        result: failure,
        durationMs: Date.now() - started,
        success: false,
      });
      return failure;
    }
  }
}
