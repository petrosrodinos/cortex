import { Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { CapabilitiesToolsFactory } from '../../capabilities/capabilities-tools.factory';
import type {
  AgentToolProvider,
  AgentToolProviderContext,
} from '../core/tool-provider.interface';

@Injectable()
export class CapabilitiesToolProvider implements AgentToolProvider {
  readonly name = 'capabilities';

  constructor(
    private readonly capabilitiesToolsFactory: CapabilitiesToolsFactory,
  ) {}

  buildTools(context: AgentToolProviderContext): ToolSet {
    return this.capabilitiesToolsFactory.buildTools({
      organizationUuid: context.organizationUuid,
      userUuid: context.userUuid,
      executionUuid: context.executionUuid,
      integrationUuids: context.integrationUuids,
      toolkitSlugs: context.toolkitSlugs,
      toolkitConnectionTiers: context.toolkitConnectionTiers,
      progress: context.progress,
    });
  }
}
