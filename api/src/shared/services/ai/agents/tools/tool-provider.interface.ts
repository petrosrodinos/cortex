import type { ToolSet } from 'ai';
import type { AgentProgressScope } from '../progress/agent-progress-scope';

export interface AgentToolProviderContext {
  organizationUuid: string;
  userUuid: string;
  conversationUuid: string;
  executionUuid: string;
  userPermissions: string[];
  documentUuids: string[];
  integrationUuids?: string[];
  toolkitSlugs?: string[];
  userMessage?: string;
  progress?: AgentProgressScope;
}

export interface AgentToolProvider {
  readonly name: string;
  buildTools(context: AgentToolProviderContext): Promise<ToolSet> | ToolSet;
}
