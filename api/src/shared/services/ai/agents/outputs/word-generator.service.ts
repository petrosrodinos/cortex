import { Injectable } from '@nestjs/common';
import { DocumentType } from 'generated/prisma';
import { DocxGeneratorService } from './docx-generator.service';
import type { DocxGenerateParams, GeneratedFileResult } from './docx-generator.types';
import { DocumentOutputService } from './document-output.service';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

@Injectable()
export class WordGeneratorService {
  constructor(
    private readonly docxGenerator: DocxGeneratorService,
    private readonly documentOutput: DocumentOutputService,
  ) {}

  async generate(
    organizationUuid: string,
    userUuid: string,
    params: DocxGenerateParams,
  ): Promise<GeneratedFileResult> {
    const buffer = await this.docxGenerator.generateBuffer(params);

    return this.documentOutput.persist(
      organizationUuid,
      userUuid,
      buffer,
      'docx',
      DOCX_MIME,
      DocumentType.DOCUMENT,
    );
  }
}
