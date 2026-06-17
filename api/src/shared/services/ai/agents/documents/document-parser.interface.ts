import type { DocumentContentKind } from './document-content.types';

export type DocumentParserKind = 'pdf' | 'word' | 'excel' | 'csv' | 'text' | 'image';

export interface DocumentParseContext {
  organizationUuid: string;
  mimetype: string;
  filename: string;
}

export interface DocumentParser {
  readonly kind: DocumentParserKind;
  readonly toolName: string;
  readonly description: string;
  readonly contentKind: DocumentContentKind;
  matches(mimetype: string, filename: string): boolean;
  parse(buffer: Buffer, context: DocumentParseContext): Promise<string>;
}
