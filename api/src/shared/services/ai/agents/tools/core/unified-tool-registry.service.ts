import { Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { CapabilitiesToolProvider } from '../providers/capabilities-tool.provider';
import { ComposioToolProvider } from '../providers/composio-tool.provider';
import { DocumentToolProvider } from '../providers/document-tool.provider';
import { DocumentBoardToolProvider } from '../providers/document-board-tool.provider';
import { InteractionToolProvider } from '../providers/interaction-tool.provider';
import { LegacyIntegrationToolProvider } from '../providers/legacy-integration-tool.provider';
import { OrganizationToolProvider } from '../providers/organization-tool.provider';
import { OutputToolProvider } from '../providers/output-tool.provider';
import { SandboxToolProvider } from '../providers/sandbox-tool.provider';
import type {
  AgentToolProvider,
  AgentToolProviderContext,
} from './tool-provider.interface';

@Injectable()
export class UnifiedToolRegistry {
  private readonly providers: AgentToolProvider[];

  constructor(
    legacyIntegrations: LegacyIntegrationToolProvider,
    composio: ComposioToolProvider,
    capabilities: CapabilitiesToolProvider,
    sandbox: SandboxToolProvider,
    documents: DocumentToolProvider,
    documentBoards: DocumentBoardToolProvider,
    outputs: OutputToolProvider,
    organization: OrganizationToolProvider,
    interaction: InteractionToolProvider,
  ) {
    this.providers = [
      legacyIntegrations,
      composio,
      capabilities,
      sandbox,
      documents,
      documentBoards,
      outputs,
      organization,
      interaction,
    ];
  }

  async buildTools(context: AgentToolProviderContext): Promise<ToolSet> {
    const toolSets = await Promise.all(
      this.providers.map((provider) => provider.buildTools(context)),
    );

    return Object.assign({}, ...toolSets);
  }
}
