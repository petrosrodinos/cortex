import { Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { OrganizationToolsFactory } from '../organization/organization-tools.factory';
import type {
  AgentToolProvider,
  AgentToolProviderContext,
} from './tool-provider.interface';

@Injectable()
export class OrganizationToolProvider implements AgentToolProvider {
  readonly name = 'organization';

  constructor(
    private readonly organizationToolsFactory: OrganizationToolsFactory,
  ) {}

  buildTools(context: AgentToolProviderContext): ToolSet {
    return this.organizationToolsFactory.buildTools({
      organizationUuid: context.organizationUuid,
      userUuid: context.userUuid,
      executionUuid: context.executionUuid,
      userPermissions: context.userPermissions,
      progress: context.progress,
    });
  }
}
