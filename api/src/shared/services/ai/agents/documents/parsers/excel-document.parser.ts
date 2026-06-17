import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import type { DocumentParseContext, DocumentParser } from '../document-parser.interface';

@Injectable()
export class ExcelDocumentParser implements DocumentParser {
  readonly kind = 'excel' as const;
  readonly toolName = 'document__read_excel';
  readonly contentKind = 'table' as const;
  readonly description =
    'Read an attached Excel spreadsheet (.xlsx or .xls) as structured sheet data. Pass the document_uuid from document__list.';

  matches(mimetype: string, filename: string): boolean {
    const normalized = mimetype.toLowerCase();
    const extension = filename.toLowerCase().split('.').pop() ?? '';
    return (
      normalized.includes('spreadsheetml') ||
      normalized === 'application/vnd.ms-excel' ||
      extension === 'xlsx' ||
      extension === 'xls'
    );
  }

  async parse(buffer: Buffer, _context: DocumentParseContext): Promise<string> {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sections: string[] = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
      sections.push(`### Sheet: ${sheetName}\n${JSON.stringify(rows, null, 2)}`);
    }

    return sections.join('\n\n');
  }
}
