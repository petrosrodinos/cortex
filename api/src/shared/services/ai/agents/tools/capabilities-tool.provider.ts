import { Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { CapabilitiesToolsFactory } from '../capabilities/capabilities-tools.factory';
import type {
  AgentToolProvider,
  AgentToolProviderContext,
} from './tool-provider.interface';

@Injectable()
export class CapabilitiesToolProvider implements AgentToolProvider {
  readonly name = 'capabilities';

  constructor(
    private readonly capabilitiesToolsFactory: CapabilitiesToolsFactory,
  ) {}

  buildTools(context: AgentToolProviderContext): ToolSet {
    return this.capabilitiesToolsFactory.buildTools({
      organizationUuid: context.organizationUuid,
      executionUuid: context.executionUuid,
      integrationUuids: context.integrationUuids,
      toolkitSlugs: context.toolkitSlugs,
      progress: context.progress,
    });
  }
}
