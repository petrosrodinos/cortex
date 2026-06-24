import { Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { DocumentBoardToolsFactory } from '../../document-boards/document-board-tools.factory';
import type {
  AgentToolProvider,
  AgentToolProviderContext,
} from '../core/tool-provider.interface';

@Injectable()
export class DocumentBoardToolProvider implements AgentToolProvider {
  readonly name = 'document-boards';

  constructor(
    private readonly documentBoardToolsFactory: DocumentBoardToolsFactory,
  ) {}

  buildTools(context: AgentToolProviderContext): ToolSet {
    return this.documentBoardToolsFactory.buildTools({
      organizationUuid: context.organizationUuid,
      userUuid: context.userUuid,
      executionUuid: context.executionUuid,
      progress: context.progress,
    });
  }
}
