import { Injectable } from '@nestjs/common';
import mammoth from 'mammoth';
import type { DocumentParseContext, DocumentParser } from '../document-parser.interface';

@Injectable()
export class WordDocumentParser implements DocumentParser {
  readonly kind = 'word' as const;
  readonly toolName = 'document__read_word';
  readonly contentKind = 'text' as const;
  readonly description =
    'Extract text from an attached Word document (.docx or .doc). Pass the document_uuid from document__list.';

  matches(mimetype: string, filename: string): boolean {
    const normalized = mimetype.toLowerCase();
    const extension = filename.toLowerCase().split('.').pop() ?? '';
    return (
      normalized.includes('wordprocessingml') ||
      normalized === 'application/msword' ||
      extension === 'docx' ||
      extension === 'doc'
    );
  }

  async parse(buffer: Buffer, _context: DocumentParseContext): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }
}
