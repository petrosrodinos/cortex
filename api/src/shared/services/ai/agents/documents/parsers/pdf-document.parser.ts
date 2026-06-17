import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import type { DocumentParseContext, DocumentParser } from '../document-parser.interface';

@Injectable()
export class PdfDocumentParser implements DocumentParser {
  readonly kind = 'pdf' as const;
  readonly toolName = 'document__read_pdf';
  readonly contentKind = 'text' as const;
  readonly description =
    'Extract text from an attached PDF document. Pass the document_uuid from document__list.';

  matches(mimetype: string, filename: string): boolean {
    const normalized = mimetype.toLowerCase();
    const extension = filename.toLowerCase().split('.').pop() ?? '';
    return normalized === 'application/pdf' || extension === 'pdf';
  }

  async parse(buffer: Buffer, _context: DocumentParseContext): Promise<string> {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  }
}
