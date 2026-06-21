import { Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { CapabilitiesToolProvider } from './capabilities-tool.provider';
import { ComposioToolProvider } from './composio-tool.provider';
import { DocumentToolProvider } from './document-tool.provider';
import { LegacyIntegrationToolProvider } from './legacy-integration-tool.provider';
import { OrganizationToolProvider } from './organization-tool.provider';
import { OutputToolProvider } from './output-tool.provider';
import { SandboxToolProvider } from './sandbox-tool.provider';
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
    outputs: OutputToolProvider,
    organization: OrganizationToolProvider,
  ) {
    this.providers = [
      legacyIntegrations,
      composio,
      capabilities,
      sandbox,
      documents,
      outputs,
      organization,
    ];
  }

  async buildTools(context: AgentToolProviderContext): Promise<ToolSet> {
    const toolSets = await Promise.all(
      this.providers.map((provider) => provider.buildTools(context)),
    );

    return Object.assign({}, ...toolSets);
  }
}
