import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentType } from 'generated/prisma';
import { DocumentOutputService } from '../shared/document-output.service';
import type { GeneratedFileResult } from '../shared/generated-file.types';
import { PdfCodeDebugService } from './pdf-code-debug.service';
import { PdfCodeRunnerService } from './pdf-code-runner.service';
import { PDF_MIME, type PdfGenerateParams } from './pdf.types';

@Injectable()
export class PdfGeneratorService {
  constructor(
    private readonly documentOutput: DocumentOutputService,
    private readonly pdfCodeRunner: PdfCodeRunnerService,
    private readonly pdfCodeDebug: PdfCodeDebugService,
  ) {}

  async generate(
    organizationUuid: string,
    userUuid: string,
    params: PdfGenerateParams,
  ): Promise<GeneratedFileResult> {
    const pdfBuffer = await this.generateBuffer(organizationUuid, params);

    return this.documentOutput.persist(
      organizationUuid,
      userUuid,
      pdfBuffer,
      'pdf',
      PDF_MIME,
      DocumentType.PDF,
    );
  }

  async generateBuffer(organizationUuid: string, params: PdfGenerateParams): Promise<Buffer> {
    const title = params.title?.trim();
    if (!title) {
      throw new BadRequestException('Document title is required');
    }

    const code = params.code?.trim();
    if (!code) {
      throw new BadRequestException('PDF code is required');
    }

    try {
      return await this.pdfCodeRunner.execute(code, title);
    } catch (firstError) {
      const errorMessage = firstError instanceof Error ? firstError.message : 'PDF code execution failed';
      const fixedCode = await this.pdfCodeDebug.fixCode(organizationUuid, code, errorMessage);

      if (!fixedCode) {
        throw firstError instanceof BadRequestException
          ? firstError
          : new BadRequestException(errorMessage);
      }

      return this.pdfCodeRunner.execute(fixedCode, title);
    }
  }
}
