const BODY_FONT_SIZE = 10.5;
const BODY_LINE_GAP = 5;
const TABLE_CELL_PADDING = 8;
const BULLET_PATTERN = /^(?:•|\-|\*|\d+\.)\s+/;

export const PDF_COLORS = {
  accent: '#1e3a5f',
  title: '#0f172a',
  body: '#334155',
  muted: '#64748b',
  headerBg: '#1e3a5f',
  headerText: '#ffffff',
  rowAlt: '#f1f5f9',
  rowBorder: '#cbd5e1',
} as const;

export interface PdfCoverOptions {
  title: string;
  subtitle?: string;
}

function contentWidth(doc: PDFKit.PDFDocument) {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

export function ensureSpace(doc: PDFKit.PDFDocument, height: number) {
  const bottom = doc.page.height - doc.page.margins.bottom - 24;
  if (doc.y + height > bottom) {
    doc.addPage();
    doc.y = doc.page.margins.top;
  }
}

export function drawCover(doc: PDFKit.PDFDocument, options: PdfCoverOptions) {
  const width = contentWidth(doc);

  doc.rect(doc.page.margins.left, doc.page.margins.top - 24, width, 4).fill(PDF_COLORS.accent);

  doc.y = doc.page.margins.top;
  doc.fillColor(PDF_COLORS.title).font('Helvetica-Bold').fontSize(26).text(options.title.trim(), {
    align: 'left',
  });

  const subtitle = options.subtitle?.trim();
  const dateLine = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  doc.moveDown(0.35);
  doc
    .fillColor(PDF_COLORS.muted)
    .font('Helvetica')
    .fontSize(11)
    .text(subtitle ? `${subtitle} · ${dateLine}` : dateLine, { align: 'left' });

  doc.moveDown(0.6);
  doc
    .strokeColor(PDF_COLORS.accent)
    .lineWidth(1)
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.margins.left + width, doc.y)
    .stroke();
  doc.moveDown(1.2);
}

export function drawSectionHeading(doc: PDFKit.PDFDocument, text: string) {
  const width = contentWidth(doc);

  ensureSpace(doc, 48);
  doc.fillColor(PDF_COLORS.accent).font('Helvetica-Bold').fontSize(15).text(text.trim(), {
    align: 'left',
  });
  doc.moveDown(0.15);
  doc
    .strokeColor(PDF_COLORS.accent)
    .lineWidth(0.75)
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.margins.left + width * 0.35, doc.y)
    .stroke();
  doc.moveDown(0.55);
}

export function drawBody(doc: PDFKit.PDFDocument, body: string) {
  const paragraphs = body.split('\n').map((line) => line.trim());
  const width = contentWidth(doc);

  doc.fillColor(PDF_COLORS.body).font('Helvetica').fontSize(BODY_FONT_SIZE);

  for (const paragraph of paragraphs) {
    if (!paragraph) {
      doc.moveDown(0.35);
      continue;
    }

    const isBullet = BULLET_PATTERN.test(paragraph);
    const text = isBullet ? paragraph.replace(BULLET_PATTERN, '') : paragraph;

    ensureSpace(doc, BODY_FONT_SIZE * 2.2);
    doc.text(isBullet ? `•  ${text}` : text, {
      align: 'left',
      lineGap: BODY_LINE_GAP,
      width,
      indent: isBullet ? 12 : 0,
    });
    doc.moveDown(0.45);
  }
}

function getTableRowHeight(
  doc: PDFKit.PDFDocument,
  values: Array<string | number>,
  columnWidth: number,
  isHeader: boolean,
) {
  doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica').fontSize(10);

  const heights = values.map((value) =>
    doc.heightOfString(String(value), {
      width: columnWidth - TABLE_CELL_PADDING * 2,
      lineGap: 2,
    }),
  );

  return Math.max(...heights, 14) + TABLE_CELL_PADDING * 2;
}

function drawTableRow(
  doc: PDFKit.PDFDocument,
  values: Array<string | number>,
  columnWidth: number,
  isHeader: boolean,
  rowIndex: number,
) {
  const x = doc.page.margins.left;
  const rowHeight = getTableRowHeight(doc, values, columnWidth, isHeader);

  ensureSpace(doc, rowHeight);
  const rowY = doc.y;

  doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica').fontSize(10);

  values.forEach((value, index) => {
    const cellX = x + index * columnWidth;
    const text = String(value);

    if (isHeader) {
      doc.rect(cellX, rowY, columnWidth, rowHeight).fillAndStroke(PDF_COLORS.headerBg, PDF_COLORS.headerBg);
      doc.fillColor(PDF_COLORS.headerText).text(text, cellX + TABLE_CELL_PADDING, rowY + TABLE_CELL_PADDING, {
        width: columnWidth - TABLE_CELL_PADDING * 2,
        lineGap: 2,
      });
    } else {
      const fill = rowIndex % 2 === 1 ? PDF_COLORS.rowAlt : '#ffffff';
      doc.rect(cellX, rowY, columnWidth, rowHeight).fillAndStroke(fill, PDF_COLORS.rowBorder);
      doc.fillColor(PDF_COLORS.body).text(text, cellX + TABLE_CELL_PADDING, rowY + TABLE_CELL_PADDING, {
        width: columnWidth - TABLE_CELL_PADDING * 2,
        lineGap: 2,
      });
    }
  });

  doc.y = rowY + rowHeight;
}

export function drawTable(
  doc: PDFKit.PDFDocument,
  headers: string[],
  rows: Array<Array<string | number>>,
) {
  const usableWidth = contentWidth(doc);
  const columnWidth = usableWidth / headers.length;

  drawTableRow(doc, headers, columnWidth, true, 0);

  rows.forEach((row, index) => {
    const values = headers.map((_, cellIndex) => row[cellIndex] ?? '');
    drawTableRow(doc, values, columnWidth, false, index);
  });

  doc.moveDown(0.6);
}

export function drawPageFooters(doc: PDFKit.PDFDocument) {
  const range = doc.bufferedPageRange();
  const totalPages = range.count;

  for (let pageIndex = range.start; pageIndex < range.start + range.count; pageIndex++) {
    doc.switchToPage(pageIndex);

    const footerY = doc.page.height - doc.page.margins.bottom + 14;
    const footerWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    doc
      .strokeColor(PDF_COLORS.rowBorder)
      .lineWidth(0.5)
      .moveTo(doc.page.margins.left, footerY - 8)
      .lineTo(doc.page.margins.left + footerWidth, footerY - 8)
      .stroke();

    doc
      .fillColor(PDF_COLORS.muted)
      .font('Helvetica')
      .fontSize(8.5)
      .text(`Page ${pageIndex + 1} of ${totalPages}`, doc.page.margins.left, footerY, {
        align: 'center',
        width: footerWidth,
        lineBreak: false,
      });
  }
}

export function createPdfKitHelpers() {
  return {
    colors: PDF_COLORS,
    drawCover,
    drawSectionHeading,
    drawBody,
    drawTable,
    drawPageFooters,
    ensureSpace,
  };
}

export type PdfKitHelpers = ReturnType<typeof createPdfKitHelpers>;
