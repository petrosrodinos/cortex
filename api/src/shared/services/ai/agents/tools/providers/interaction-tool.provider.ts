import { Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { InteractionToolsFactory } from '../../interaction/interaction-tools.factory';
import type {
  AgentToolProvider,
  AgentToolProviderContext,
} from '../core/tool-provider.interface';

@Injectable()
export class InteractionToolProvider implements AgentToolProvider {
  readonly name = 'interaction';

  constructor(private readonly interactionToolsFactory: InteractionToolsFactory) {}

  buildTools(context: AgentToolProviderContext): ToolSet {
    return this.interactionToolsFactory.buildTools({
      executionUuid: context.executionUuid,
      progress: context.progress,
    });
  }
}
