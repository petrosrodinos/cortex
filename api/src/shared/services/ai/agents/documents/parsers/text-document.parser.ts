import { Injectable } from '@nestjs/common';
import type { DocumentParseContext, DocumentParser } from '../document-parser.interface';

@Injectable()
export class TextDocumentParser implements DocumentParser {
  readonly kind = 'text' as const;
  readonly toolName = 'document__read_text';
  readonly contentKind = 'text' as const;
  readonly description =
    'Read an attached plain-text file (.txt, .md, .json, etc.). Pass the document_uuid from document__list.';

  matches(mimetype: string, filename: string): boolean {
    const normalized = mimetype.toLowerCase();
    if (normalized === 'text/csv') {
      return false;
    }

    if (normalized.startsWith('text/')) {
      return true;
    }

    const extension = filename.toLowerCase().split('.').pop() ?? '';
    return ['txt', 'md', 'json', 'xml', 'log'].includes(extension);
  }

  async parse(buffer: Buffer, _context: DocumentParseContext): Promise<string> {
    return buffer.toString('utf-8').trim();
  }
}
