import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentType } from 'generated/prisma';
import PDFDocument = require('pdfkit');
import { DocumentOutputService } from '../shared/document-output.service';
import type { GeneratedFileResult } from '../shared/generated-file.types';
import type { DocxGenerateParams } from '../word/docx.types';

const PDF_MIME = 'application/pdf';
const PAGE_MARGIN = 48;
const BODY_FONT_SIZE = 11;
const BODY_LINE_GAP = 4;
const TABLE_CELL_PADDING = 6;

@Injectable()
export class PdfGeneratorService {
  constructor(private readonly documentOutput: DocumentOutputService) {}

  async generate(
    organizationUuid: string,
    userUuid: string,
    params: DocxGenerateParams,
  ): Promise<GeneratedFileResult> {
    const pdfBuffer = await this.generateBuffer(params);

    return this.documentOutput.persist(
      organizationUuid,
      userUuid,
      pdfBuffer,
      'pdf',
      PDF_MIME,
      DocumentType.PDF,
    );
  }

  async generateBuffer(params: DocxGenerateParams): Promise<Buffer> {
    const title = params.title?.trim();
    if (!title) {
      throw new BadRequestException('Document title is required');
    }

    if (!params.sections?.length) {
      throw new BadRequestException('At least one section is required');
    }

    const document = new PDFDocument({
      margin: PAGE_MARGIN,
      size: 'A4',
      bufferPages: false,
      info: {
        Title: title,
      },
    });

    const chunks: Buffer[] = [];
    const completed = new Promise<Buffer>((resolve, reject) => {
      document.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
      document.on('end', () => resolve(Buffer.concat(chunks)));
      document.on('error', reject);
    });

    this.renderDocument(document, { ...params, title });
    document.end();

    const buffer = await completed;
    if (buffer.length === 0) {
      throw new BadRequestException('PDF generation produced an empty file');
    }

    return buffer;
  }

  private renderDocument(document: PDFKit.PDFDocument, params: DocxGenerateParams) {
    document.fillColor('#111827').font('Helvetica-Bold').fontSize(20).text(params.title.trim(), {
      align: 'left',
    });
    document.moveDown(1);

    for (const section of params.sections) {
      if (section.heading?.trim()) {
        this.ensureSpace(document, 36);
        document.fillColor('#111827').font('Helvetica-Bold').fontSize(14).text(section.heading.trim(), {
          align: 'left',
        });
        document.moveDown(0.4);
      }

      this.renderBody(document, section.body);
    }

    for (const table of params.tables ?? []) {
      if (!table.headers?.length) {
        continue;
      }

      document.moveDown(0.8);
      this.renderTable(document, table.headers, table.rows ?? []);
    }
  }

  private renderBody(document: PDFKit.PDFDocument, body: string) {
    const paragraphs = body.split('\n').map((line) => line.trim());

    document.fillColor('#111827').font('Helvetica').fontSize(BODY_FONT_SIZE);

    for (const paragraph of paragraphs) {
      if (!paragraph) {
        document.moveDown(0.4);
        continue;
      }

      this.ensureSpace(document, BODY_FONT_SIZE * 2);
      document.text(paragraph, {
        align: 'left',
        lineGap: BODY_LINE_GAP,
      });
      document.moveDown(0.5);
    }
  }

  private renderTable(document: PDFKit.PDFDocument, headers: string[], rows: Array<Array<string | number>>) {
    const usableWidth = document.page.width - document.page.margins.left - document.page.margins.right;
    const columnWidth = usableWidth / headers.length;

    this.renderTableRow(document, headers, columnWidth, true);

    for (const row of rows) {
      const values = headers.map((_, index) => row[index] ?? '');
      this.renderTableRow(document, values, columnWidth, false);
    }

    document.moveDown(0.6);
  }

  private renderTableRow(
    document: PDFKit.PDFDocument,
    values: Array<string | number>,
    columnWidth: number,
    isHeader: boolean,
  ) {
    const x = document.page.margins.left;
    const rowHeight = this.getTableRowHeight(document, values, columnWidth, isHeader);

    this.ensureSpace(document, rowHeight);
    const rowY = document.y;

    document.font(isHeader ? 'Helvetica-Bold' : 'Helvetica').fontSize(10);

    values.forEach((value, index) => {
      const cellX = x + index * columnWidth;
      const text = String(value);

      if (isHeader) {
        document.rect(cellX, rowY, columnWidth, rowHeight).fillAndStroke('#f3f4f6', '#d1d5db');
      } else {
        document.rect(cellX, rowY, columnWidth, rowHeight).stroke('#d1d5db');
      }

      document.fillColor('#111827').text(text, cellX + TABLE_CELL_PADDING, rowY + TABLE_CELL_PADDING, {
        width: columnWidth - TABLE_CELL_PADDING * 2,
        lineGap: 2,
      });
    });

    document.y = rowY + rowHeight;
  }

  private getTableRowHeight(
    document: PDFKit.PDFDocument,
    values: Array<string | number>,
    columnWidth: number,
    isHeader: boolean,
  ) {
    document.font(isHeader ? 'Helvetica-Bold' : 'Helvetica').fontSize(10);

    const heights = values.map((value) =>
      document.heightOfString(String(value), {
        width: columnWidth - TABLE_CELL_PADDING * 2,
        lineGap: 2,
      }),
    );

    return Math.max(...heights, 14) + TABLE_CELL_PADDING * 2;
  }

  private ensureSpace(document: PDFKit.PDFDocument, height: number) {
    const bottom = document.page.height - document.page.margins.bottom;
    if (document.y + height > bottom) {
      document.addPage();
    }
  }
}
