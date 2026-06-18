import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DocumentType } from 'generated/prisma';
import * as libreConvert from 'libreoffice-convert';
import { promisify } from 'node:util';
import { DocumentOutputService } from '../shared/document-output.service';
import type { GeneratedFileResult } from '../shared/generated-file.types';
import { DocxGeneratorService } from '../word/docx-generator.service';
import type { DocxGenerateParams } from '../word/docx.types';

const PDF_MIME = 'application/pdf';
const convertAsync = promisify(libreConvert.convert);

@Injectable()
export class PdfGeneratorService {
  private readonly logger = new Logger(PdfGeneratorService.name);

  constructor(
    private readonly docxGenerator: DocxGeneratorService,
    private readonly documentOutput: DocumentOutputService,
  ) {}

  async generate(
    organizationUuid: string,
    userUuid: string,
    params: DocxGenerateParams,
  ): Promise<GeneratedFileResult> {
    const docxBuffer = await this.docxGenerator.generateBuffer(params);
    const pdfBuffer = await this.convertDocxToPdf(docxBuffer);

    return this.documentOutput.persist(
      organizationUuid,
      userUuid,
      pdfBuffer,
      'pdf',
      PDF_MIME,
      DocumentType.PDF,
    );
  }

  private async convertDocxToPdf(docxBuffer: Buffer): Promise<Buffer> {
    try {
      const pdfBuffer = await convertAsync(docxBuffer, '.pdf', undefined);
      if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
        throw new BadRequestException('PDF conversion produced an empty file');
      }

      return pdfBuffer;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'PDF conversion failed';
      this.logger.error(`DOCX to PDF conversion failed: ${message}`);
      throw new BadRequestException(
        'PDF conversion failed. LibreOffice must be installed on the server for PDF export.',
      );
    }
  }
}
