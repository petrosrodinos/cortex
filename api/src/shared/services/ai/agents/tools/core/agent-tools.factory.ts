import { Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { UnifiedToolRegistry } from './unified-tool-registry.service';
import type { AgentProgressScope } from '../../progress/agent-progress-scope';

@Injectable()
export class AgentToolsFactory {
  constructor(private readonly registry: UnifiedToolRegistry) {}

  buildTools(
    organizationUuid: string,
    userUuid: string,
    conversationUuid: string,
    executionUuid: string,
    userPermissions: string[],
    options?: {
      documentUuids?: string[];
      integrationUuids?: string[];
      toolkitSlugs?: string[];
      userMessage?: string;
      progress?: AgentProgressScope;
    },
  ): Promise<ToolSet> {
    return this.registry.buildTools({
      organizationUuid,
      userUuid,
      conversationUuid,
      executionUuid,
      userPermissions,
      documentUuids: options?.documentUuids ?? [],
      integrationUuids: options?.integrationUuids,
      toolkitSlugs: options?.toolkitSlugs,
      userMessage: options?.userMessage,
      progress: options?.progress,
    });
  }
}
