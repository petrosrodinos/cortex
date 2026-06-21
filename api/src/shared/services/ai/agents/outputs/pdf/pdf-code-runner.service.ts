import { BadRequestException, Injectable } from '@nestjs/common';
import { runInNewContext } from 'node:vm';
import PDFDocument = require('pdfkit');
import { assertPdfCodeIsValid } from './utils/pdf-code-validation.utils';
import { createPdfKitHelpers, drawPageFooters } from './utils/pdf-kit.helpers';

const PAGE_MARGIN = 56;
const EXECUTION_TIMEOUT_MS = 15_000;

@Injectable()
export class PdfCodeRunnerService {
  async execute(code: string, title: string): Promise<Buffer> {
    assertPdfCodeIsValid(code);

    const doc = new PDFDocument({
      margin: PAGE_MARGIN,
      size: 'A4',
      bufferPages: true,
      info: {
        Title: title,
      },
    });

    const chunks: Buffer[] = [];
    const completed = new Promise<Buffer>((resolve, reject) => {
      doc.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    const h = createPdfKitHelpers();

    try {
      const script = `
(function () {
  const build = function (doc, h) {
    ${code}
  };
  build(doc, h);
})();
`;

      runInNewContext(script, { doc, h }, { timeout: EXECUTION_TIMEOUT_MS });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'PDF code execution failed';
      throw new BadRequestException(message);
    }

    drawPageFooters(doc);
    doc.end();

    const buffer = await completed;
    if (buffer.length === 0) {
      throw new BadRequestException('PDF generation produced an empty file');
    }

    if (buffer.subarray(0, 5).toString() !== '%PDF-') {
      throw new BadRequestException('PDF generation produced an invalid file');
    }

    return buffer;
  }
}
