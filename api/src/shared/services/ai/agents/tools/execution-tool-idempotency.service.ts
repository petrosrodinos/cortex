import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ToolCallStatus } from 'generated/prisma';
import { createHash } from 'node:crypto';

const SIDE_EFFECT_TOOL_PATTERN =
  /^(output__create_image|output__create_word|output__create_pdf|organization__send_member_email|.+__(send_email|send_message|send_html_email|send_bulk_email|send_email_with_attachments))$/;

@Injectable()
export class ExecutionToolIdempotencyService {
  constructor(private readonly prisma: PrismaService) {}

  isSideEffectTool(toolName: string) {
    return SIDE_EFFECT_TOOL_PATTERN.test(toolName);
  }

  async getCachedResult<T = unknown>(
    executionUuid: string,
    toolName: string,
    input?: Record<string, unknown>,
  ): Promise<T | null> {
    if (!this.isSideEffectTool(toolName)) {
      return null;
    }

    const inputHash = input ? this.hashInput(input) : null;
    const priorCalls = await this.prisma.toolCall.findMany({
      where: {
        execution_uuid: executionUuid,
        tool_name: toolName,
        status: ToolCallStatus.SUCCESS,
      },
      orderBy: { created_at: 'asc' },
    });

    for (const priorCall of priorCalls) {
      if (inputHash && !this.matchesInputHash(priorCall.input, inputHash)) {
        continue;
      }

      if (!priorCall.output || typeof priorCall.output !== 'object') {
        continue;
      }

      const output = priorCall.output as Record<string, unknown>;
      if ('error' in output) {
        continue;
      }

      return priorCall.output as T;
    }

    return null;
  }

  private hashInput(input: Record<string, unknown>) {
    return createHash('sha256').update(JSON.stringify(this.stableValue(input))).digest('hex');
  }

  private matchesInputHash(storedInput: unknown, inputHash: string) {
    if (!storedInput || typeof storedInput !== 'object') {
      return false;
    }

    return this.hashInput(storedInput as Record<string, unknown>) === inputHash;
  }

  private stableValue(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.stableValue(item));
    }

    if (value && typeof value === 'object') {
      return Object.keys(value as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, key) => {
          acc[key] = this.stableValue((value as Record<string, unknown>)[key]);
          return acc;
        }, {});
    }

    return value;
  }
}
