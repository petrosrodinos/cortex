import { Injectable } from '@nestjs/common';
import type { DocumentParser, DocumentParserKind } from './document-parser.interface';
import { PdfDocumentParser } from './parsers/pdf-document.parser';
import { WordDocumentParser } from './parsers/word-document.parser';
import { ExcelDocumentParser } from './parsers/excel-document.parser';
import { CsvDocumentParser } from './parsers/csv-document.parser';
import { TextDocumentParser } from './parsers/text-document.parser';
import { ImageDocumentParser } from './parsers/image-document.parser';

@Injectable()
export class DocumentParserRegistry {
  private readonly parsers: DocumentParser[];

  constructor(
    pdfParser: PdfDocumentParser,
    wordParser: WordDocumentParser,
    excelParser: ExcelDocumentParser,
    csvParser: CsvDocumentParser,
    textParser: TextDocumentParser,
    imageParser: ImageDocumentParser,
  ) {
    this.parsers = [pdfParser, wordParser, excelParser, csvParser, textParser, imageParser];
  }

  getAll(): DocumentParser[] {
    return this.parsers;
  }

  getByKind(kind: DocumentParserKind): DocumentParser | undefined {
    return this.parsers.find((parser) => parser.kind === kind);
  }

  resolve(mimetype: string, filename: string): DocumentParser | undefined {
    return this.parsers.find((parser) => parser.matches(mimetype, filename));
  }
}
