export type DocumentContentKind = 'text' | 'image' | 'table';

export interface AttachedDocumentMeta {
  uuid: string;
  filename: string;
  mimetype: string;
  suggestedTool: string;
}

export interface ParsedDocumentContent {
  uuid: string;
  filename: string;
  mimetype: string;
  kind: DocumentContentKind;
  text: string;
}

export interface DocumentReadToolResult {
  uuid: string;
  filename: string;
  mimetype: string;
  kind: DocumentContentKind;
  content: string;
  truncated: boolean;
}
