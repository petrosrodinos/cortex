import { Injectable } from '@nestjs/common';
import { jsonSchema, tool } from 'ai';
import type { ToolSet } from 'ai';
import type { AgentProgressScope } from '../progress/agent-progress-scope';
import { DocumentReaderService } from './document-reader.service';
import { DocumentParserRegistry } from './document-parser.registry';

export interface DocumentToolsContext {
  organizationUuid: string;
  documentUuids: string[];
  progress?: AgentProgressScope;
}

@Injectable()
export class DocumentToolsFactory {
  constructor(
    private readonly documentReader: DocumentReaderService,
    private readonly registry: DocumentParserRegistry,
  ) {}

  async buildTools(context: DocumentToolsContext): Promise<ToolSet> {
    if (context.documentUuids.length === 0) {
      return {};
    }

    const tools: ToolSet = {};
    const allowedUuids = new Set(context.documentUuids);
    const metadata = await this.documentReader.getAttachedMetadata(context.documentUuids);
    const { progress } = context;

    tools.document__list = tool({
      description:
        'List documents attached to the current chat message. Returns uuid, filename, mimetype, and the recommended read tool for each file.',
      inputSchema: jsonSchema({ type: 'object', properties: {}, additionalProperties: false }),
      execute: async () =>
        progress?.trackTool('document__list', {}, async () => ({ documents: metadata })) ?? {
          documents: metadata,
        },
    });

    for (const parser of this.registry.getAll()) {
      tools[parser.toolName] = tool({
        description: parser.description,
        inputSchema: jsonSchema({
          type: 'object',
          properties: {
            document_uuid: {
              type: 'string',
              description: 'UUID of the attached document to read (from document__list)',
            },
          },
          required: ['document_uuid'],
        }),
        execute: async (input: { document_uuid: string }) => {
          const { document_uuid: documentUuid } = input;

          if (!allowedUuids.has(documentUuid)) {
            const error = { error: 'Document is not attached to this message' };
            const callId = progress?.toolStart(parser.toolName, { documentUuid });
            if (callId) {
              progress?.toolComplete(callId, {
                toolName: parser.toolName,
                result: error,
                durationMs: 0,
                success: false,
              });
            }
            return error;
          }

          return (
            progress?.trackTool(parser.toolName, { documentUuid }, async () =>
              this.documentReader.readDocument(documentUuid, context.organizationUuid, parser.kind),
            ) ??
            this.documentReader.readDocument(documentUuid, context.organizationUuid, parser.kind)
          );
        },
      });
    }

    return tools;
  }
}
