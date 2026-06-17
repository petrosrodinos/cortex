import { Injectable } from '@nestjs/common';
import type { DocumentParseContext, DocumentParser } from '../document-parser.interface';

@Injectable()
export class CsvDocumentParser implements DocumentParser {
  readonly kind = 'csv' as const;
  readonly toolName = 'document__read_csv';
  readonly contentKind = 'table' as const;
  readonly description =
    'Read an attached CSV file as raw tabular text. Pass the document_uuid from document__list.';

  matches(mimetype: string, filename: string): boolean {
    const normalized = mimetype.toLowerCase();
    const extension = filename.toLowerCase().split('.').pop() ?? '';
    return normalized === 'text/csv' || extension === 'csv';
  }

  async parse(buffer: Buffer, _context: DocumentParseContext): Promise<string> {
    return buffer.toString('utf-8').trim();
  }
}
