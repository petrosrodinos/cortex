import { Injectable } from '@nestjs/common';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import { CODE_INTERPRETER_DESCRIPTION } from '../sandbox/sandbox.config';
import { SandboxCodeService } from '../sandbox/sandbox-code.service';
import type {
  AgentToolProvider,
  AgentToolProviderContext,
} from './tool-provider.interface';

@Injectable()
export class SandboxToolProvider implements AgentToolProvider {
  readonly name = 'sandbox';

  constructor(private readonly sandboxCode: SandboxCodeService) {}

  buildTools(context: AgentToolProviderContext): ToolSet {
    return {
      code_interpreter: tool({
        description: CODE_INTERPRETER_DESCRIPTION,
        inputSchema: jsonSchema({
          type: 'object',
          properties: { code: { type: 'string' } },
          required: ['code'],
        }),
        execute: async (input: { code: string }) => {
          const { code } = input;
          return (
            context.progress?.trackTool(
              'code_interpreter',
              { code },
              async () => {
                const output = await this.sandboxCode.runPython(
                  context.executionUuid,
                  code,
                );
                if (output.stderr && output.exitCode !== 0) {
                  throw new Error(output.stderr);
                }
                return output;
              },
            ) ?? this.sandboxCode.runPython(context.executionUuid, code)
          );
        },
      }),
    };
  }
}
