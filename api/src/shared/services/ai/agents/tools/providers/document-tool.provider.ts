import { Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { DocumentToolsFactory } from '../../documents/document-tools.factory';
import type {
  AgentToolProvider,
  AgentToolProviderContext,
} from '../core/tool-provider.interface';

@Injectable()
export class DocumentToolProvider implements AgentToolProvider {
  readonly name = 'documents';

  constructor(private readonly documentToolsFactory: DocumentToolsFactory) {}

  buildTools(context: AgentToolProviderContext): Promise<ToolSet> {
    return this.documentToolsFactory.buildTools({
      organizationUuid: context.organizationUuid,
      documentUuids: context.documentUuids,
      progress: context.progress,
    });
  }
}
