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
import { WidgetGeneratorService } from '../widget/widget-generator.service';
import type { WidgetGenerateParams } from '../widget/widget.types';
import { ExecutionToolIdempotencyService } from '../../tools/dispatch/execution-tool-idempotency.service';
import type { AgentProgressScope } from '../../progress/agent-progress-scope';

export interface OutputToolsContext {
  organizationUuid: string;
  userUuid: string;
  executionUuid: string;
  userMessage?: string;
  progress?: AgentProgressScope;
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

const WIDGET_TOOL_SCHEMA = jsonSchema({
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'Widget title shown at the top (e.g. "Monthly Sales Simulator")',
    },
    data: {
      description:
        'Full structured dataset from integration/database tools. Include every record and field needed — not samples. Available in js as WIDGET_DATA.',
    },
    html: {
      type: 'string',
      description:
        'Body HTML only (no html/head/body tags). Build a complete UI: header, metric cards, controls the user asked for, tables/charts, and result panels. Use semantic structure and descriptive labels.',
    },
    css: {
      type: 'string',
      description:
        'Styles for layout and polish: card grid, spacing, slider styling, tables, emphasis states, responsive widths. Platform base typography is applied automatically.',
    },
    js: {
      type: 'string',
      description:
        'Interactivity: MUST read WIDGET_DATA and build every row, checkbox, and control in DOM on init. Use renderTableRows(selector, widgetRecords(), buildRow) for tables. Never assume rows already exist in html. Wire change handlers to recalculate totals live.',
    },
  },
  required: ['title', 'html', 'css', 'js', 'data'],
});

const OUTPUT_FORMAT_PATTERNS: Array<{ toolName: string; patterns: RegExp[] }> = [
  {
    toolName: 'output__create_excel',
    patterns: [/\bexcel\b/i, /\bxlsx\b/i, /\bspreadsheet\b/i, /\bworkbook\b/i],
  },
  {
    toolName: 'output__create_pdf',
    patterns: [/\bpdf\b/i],
  },
  {
    toolName: 'output__create_word',
    patterns: [/\bword\b/i, /\bdocx\b/i],
  },
  {
    toolName: 'output__create_image',
    patterns: [/\bimage\b/i, /\bpicture\b/i, /\bphoto\b/i, /\billustration\b/i, /\bgraphic\b/i, /\bportrait\b/i],
  },
  {
    toolName: 'output__create_widget',
    patterns: [
      /\bwidget\b/i,
      /\binteractive\b/i,
      /\bdashboard\b/i,
      /\bslider\b/i,
      /\bcalculator\b/i,
      /\bsimulator\b/i,
      /\bmake it into a widget\b/i,
      /\bturn (?:it|that|this) into\b/i,
    ],
  },
];

export function getRequestedOutputToolNames(userMessage?: string): Set<string> | null {
  if (!userMessage?.trim()) {
    return null;
  }

  const requested = OUTPUT_FORMAT_PATTERNS.flatMap(({ toolName, patterns }) =>
    patterns.some((pattern) => pattern.test(userMessage)) ? [toolName] : [],
  );

  return requested.length > 0 ? new Set(requested) : null;
}

export function isExportFollowUpRequest(userMessage?: string): boolean {
  if (!getRequestedOutputToolNames(userMessage)) {
    return false;
  }

  const normalized = userMessage?.trim() ?? '';
  return /\b(it|that|this|above|previous|same|the list|the table|the data|the members?|the report)\b/i.test(normalized);
}

const EXPORT_FROM_CONVERSATION_GUIDANCE =
  'When the user asks to export or convert content already shown in this conversation, extract the relevant rows or sections from the most recent assistant reply or tool results and call this tool immediately. Re-run the same lookup tools if needed. Never ask the user to re-enter data that is already visible in the chat history.';

const WIDGET_CREATION_GUIDANCE =
  'Create a rich interactive widget that fully matches the user request. Step 1: fetch real data with integration, database, document, or code_interpreter tools unless the conversation already has the full dataset. Step 2: call this tool with title, data (full records), html (shell layout with empty tbody/containers — close all tags), css (polished card layout), and js that builds all rows and controls from WIDGET_DATA on init using renderTableRows/widgetRecords/formatWidgetCurrency/formatWidgetDate helpers. Never use placeholder data, empty tables with only headers, or js that only attaches listeners to elements that were never created.';

@Injectable()
export class OutputToolsFactory {
  constructor(
    private readonly imageGenerator: ImageGeneratorService,
    private readonly wordGenerator: WordGeneratorService,
    private readonly pdfGenerator: PdfGeneratorService,
    private readonly excelGenerator: ExcelGeneratorService,
    private readonly widgetGenerator: WidgetGeneratorService,
    private readonly prisma: PrismaService,
    private readonly idempotency: ExecutionToolIdempotencyService,
  ) {}

  buildTools(context: OutputToolsContext): ToolSet {
    const { organizationUuid, userUuid, executionUuid, progress } = context;
    const requestedOutputTools = getRequestedOutputToolNames(context.userMessage);

    const tools: ToolSet = {
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
            progress,
            run: () => this.imageGenerator.generate(organizationUuid, userUuid, input),
          });
        },
      }),

      output__create_word: tool({
        description:
          `Create a Word (.docx) document from structured content. Use when the user asks to create, export, or generate a Word document or .docx file. ${EXPORT_FROM_CONVERSATION_GUIDANCE}`,
        inputSchema: DOCUMENT_TOOL_SCHEMA,
        execute: async (input: DocxGenerateParams) => {
          return this.executeSideEffectTool({
            toolName: 'output__create_word',
            input,
            executionUuid,
            progress,
            run: () => this.wordGenerator.generate(organizationUuid, userUuid, input),
          });
        },
      }),

      output__create_pdf: tool({
        description:
          `Create a PDF document from structured content. Use when the user asks to create, export, or generate a PDF file or report. ${EXPORT_FROM_CONVERSATION_GUIDANCE}`,
        inputSchema: DOCUMENT_TOOL_SCHEMA,
        execute: async (input: DocxGenerateParams) => {
          return this.executeSideEffectTool({
            toolName: 'output__create_pdf',
            input,
            executionUuid,
            progress,
            run: () => this.pdfGenerator.generate(organizationUuid, userUuid, input),
          });
        },
      }),

      output__create_excel: tool({
        description:
          `Create an Excel (.xlsx) spreadsheet from structured data. Use when the user asks to create, export, or generate a spreadsheet, Excel file, or .xlsx workbook. ${EXPORT_FROM_CONVERSATION_GUIDANCE}`,
        inputSchema: EXCEL_TOOL_SCHEMA,
        execute: async (input: ExcelGenerateParams) => {
          return this.executeSideEffectTool({
            toolName: 'output__create_excel',
            input,
            executionUuid,
            progress,
            run: () => this.excelGenerator.generate(organizationUuid, userUuid, input),
          });
        },
      }),

      output__create_widget: tool({
        description: `Create an interactive HTML/CSS/JavaScript widget rendered inline in chat. Use for sliders, toggles, calculators, simulators, and mini-dashboards — not for static PDF/Excel exports. ${WIDGET_CREATION_GUIDANCE} ${EXPORT_FROM_CONVERSATION_GUIDANCE} The platform applies Inter and modern base typography automatically. Do not paste raw HTML in the chat reply.`,
        inputSchema: WIDGET_TOOL_SCHEMA,
        execute: async (input: WidgetGenerateParams) => {
          return this.executeSideEffectTool({
            toolName: 'output__create_widget',
            input,
            executionUuid,
            progress,
            run: () => this.widgetGenerator.generate(organizationUuid, userUuid, input),
          });
        },
      }),
    };

    if (!requestedOutputTools) {
      return tools;
    }

    return Object.fromEntries(
      Object.entries(tools).filter(([toolName]) => requestedOutputTools.has(toolName)),
    ) as ToolSet;
  }

  private async executeSideEffectTool<T extends object>(options: {
    toolName: string;
    input: T;
    executionUuid: string;
    progress?: AgentProgressScope;
    run: () => Promise<GeneratedImageResult | GeneratedFileResult>;
  }) {
    const { toolName, input, executionUuid, progress, run } = options;
    const callId = progress?.toolStart(toolName, input);
    const started = Date.now();

    try {
      const cached = await this.idempotency.getCachedResult<GeneratedImageResult | GeneratedFileResult>(
        executionUuid,
        toolName,
        input as Record<string, unknown>,
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
        return cached;
      }

      const result = await run();
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
      const message = error instanceof Error ? error.message : `${toolName} failed`;
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
      return failure;
    }
  }
}
