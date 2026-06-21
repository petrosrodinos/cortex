import { Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { OutputToolsFactory } from '../../outputs/tools/output-tools.factory';
import type {
  AgentToolProvider,
  AgentToolProviderContext,
} from '../core/tool-provider.interface';

@Injectable()
export class OutputToolProvider implements AgentToolProvider {
  readonly name = 'outputs';

  constructor(private readonly outputToolsFactory: OutputToolsFactory) {}

  buildTools(context: AgentToolProviderContext): ToolSet {
    return this.outputToolsFactory.buildTools({
      organizationUuid: context.organizationUuid,
      userUuid: context.userUuid,
      executionUuid: context.executionUuid,
      userMessage: context.userMessage,
      progress: context.progress,
    });
  }
}
