import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentType } from 'generated/prisma';
import PDFDocument = require('pdfkit');
import { DocumentOutputService } from '../shared/document-output.service';
import type { GeneratedFileResult } from '../shared/generated-file.types';
import type { DocxGenerateParams } from '../word/docx.types';

const PDF_MIME = 'application/pdf';
const PAGE_MARGIN = 56;
const BODY_FONT_SIZE = 10.5;
const BODY_LINE_GAP = 5;
const TABLE_CELL_PADDING = 8;
const ACCENT = '#1e3a5f';
const TITLE_COLOR = '#0f172a';
const BODY_COLOR = '#334155';
const MUTED = '#64748b';
const HEADER_BG = '#1e3a5f';
const HEADER_TEXT = '#ffffff';
const ROW_ALT = '#f1f5f9';
const ROW_BORDER = '#cbd5e1';
const BULLET_PATTERN = /^(?:•|\-|\*|\d+\.)\s+/;

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
      bufferPages: true,
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
    this.renderPageFooters(document);
    document.end();

    const buffer = await completed;
    if (buffer.length === 0) {
      throw new BadRequestException('PDF generation produced an empty file');
    }

    return buffer;
  }

  private renderDocument(document: PDFKit.PDFDocument, params: DocxGenerateParams) {
    const contentWidth = document.page.width - document.page.margins.left - document.page.margins.right;

    document
      .rect(document.page.margins.left, document.page.margins.top - 24, contentWidth, 4)
      .fill(ACCENT);

    document.y = document.page.margins.top;
    document.fillColor(TITLE_COLOR).font('Helvetica-Bold').fontSize(26).text(params.title.trim(), {
      align: 'left',
    });

    const subtitle = params.subtitle?.trim();
    const dateLine = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    document.moveDown(0.35);
    document
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(11)
      .text(subtitle ? `${subtitle} · ${dateLine}` : dateLine, { align: 'left' });

    document.moveDown(0.6);
    document
      .strokeColor(ACCENT)
      .lineWidth(1)
      .moveTo(document.page.margins.left, document.y)
      .lineTo(document.page.margins.left + contentWidth, document.y)
      .stroke();
    document.moveDown(1.2);

    for (const section of params.sections) {
      if (section.heading?.trim()) {
        this.ensureSpace(document, 48);
        document.fillColor(ACCENT).font('Helvetica-Bold').fontSize(15).text(section.heading.trim(), {
          align: 'left',
        });
        document.moveDown(0.15);
        document
          .strokeColor(ACCENT)
          .lineWidth(0.75)
          .moveTo(document.page.margins.left, document.y)
          .lineTo(document.page.margins.left + contentWidth * 0.35, document.y)
          .stroke();
        document.moveDown(0.55);
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
    const contentWidth = document.page.width - document.page.margins.left - document.page.margins.right;

    document.fillColor(BODY_COLOR).font('Helvetica').fontSize(BODY_FONT_SIZE);

    for (const paragraph of paragraphs) {
      if (!paragraph) {
        document.moveDown(0.35);
        continue;
      }

      const isBullet = BULLET_PATTERN.test(paragraph);
      const text = isBullet ? paragraph.replace(BULLET_PATTERN, '') : paragraph;

      this.ensureSpace(document, BODY_FONT_SIZE * 2.2);
      document.text(isBullet ? `•  ${text}` : text, {
        align: 'left',
        lineGap: BODY_LINE_GAP,
        width: contentWidth,
        indent: isBullet ? 12 : 0,
      });
      document.moveDown(0.45);
    }
  }

  private renderTable(document: PDFKit.PDFDocument, headers: string[], rows: Array<Array<string | number>>) {
    const usableWidth = document.page.width - document.page.margins.left - document.page.margins.right;
    const columnWidth = usableWidth / headers.length;

    this.renderTableRow(document, headers, columnWidth, true, 0);

    rows.forEach((row, index) => {
      const values = headers.map((_, cellIndex) => row[cellIndex] ?? '');
      this.renderTableRow(document, values, columnWidth, false, index);
    });

    document.moveDown(0.6);
  }

  private renderTableRow(
    document: PDFKit.PDFDocument,
    values: Array<string | number>,
    columnWidth: number,
    isHeader: boolean,
    rowIndex: number,
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
        document.rect(cellX, rowY, columnWidth, rowHeight).fillAndStroke(HEADER_BG, HEADER_BG);
        document.fillColor(HEADER_TEXT).text(text, cellX + TABLE_CELL_PADDING, rowY + TABLE_CELL_PADDING, {
          width: columnWidth - TABLE_CELL_PADDING * 2,
          lineGap: 2,
        });
      } else {
        const fill = rowIndex % 2 === 1 ? ROW_ALT : '#ffffff';
        document.rect(cellX, rowY, columnWidth, rowHeight).fillAndStroke(fill, ROW_BORDER);
        document.fillColor(BODY_COLOR).text(text, cellX + TABLE_CELL_PADDING, rowY + TABLE_CELL_PADDING, {
          width: columnWidth - TABLE_CELL_PADDING * 2,
          lineGap: 2,
        });
      }
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

  private renderPageFooters(document: PDFKit.PDFDocument) {
    const range = document.bufferedPageRange();
    const totalPages = range.count;

    for (let pageIndex = range.start; pageIndex < range.start + range.count; pageIndex++) {
      document.switchToPage(pageIndex);

      const footerY = document.page.height - document.page.margins.bottom + 14;
      const footerWidth = document.page.width - document.page.margins.left - document.page.margins.right;

      document
        .strokeColor(ROW_BORDER)
        .lineWidth(0.5)
        .moveTo(document.page.margins.left, footerY - 8)
        .lineTo(document.page.margins.left + footerWidth, footerY - 8)
        .stroke();

      document
        .fillColor(MUTED)
        .font('Helvetica')
        .fontSize(8.5)
        .text(`Page ${pageIndex + 1} of ${totalPages}`, document.page.margins.left, footerY, {
          align: 'center',
          width: footerWidth,
          lineBreak: false,
        });
    }
  }

  private ensureSpace(document: PDFKit.PDFDocument, height: number) {
    const bottom = document.page.height - document.page.margins.bottom - 24;
    if (document.y + height > bottom) {
      document.addPage();
      document.y = document.page.margins.top;
    }
  }
}
