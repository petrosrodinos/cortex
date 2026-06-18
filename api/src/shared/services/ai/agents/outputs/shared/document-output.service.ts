import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { DocumentType } from 'generated/prisma';
import { randomUUID } from 'node:crypto';
import type { GeneratedFileResult } from './generated-file.types';

@Injectable()
export class DocumentOutputService {
  constructor(
    private readonly gcs: GcsService,
    private readonly prisma: PrismaService,
  ) {}

  async persist(
    organizationUuid: string,
    userUuid: string,
    buffer: Buffer,
    extension: string,
    contentType: string,
    documentType: DocumentType,
  ): Promise<GeneratedFileResult> {
    const filename = `generated-${randomUUID()}.${extension}`;

    const uploaded = await this.gcs.uploadImageFromBuffer(
      buffer,
      filename,
      contentType,
      `orgs/${organizationUuid}/generated`,
    );

    const document = await this.prisma.document.create({
      data: {
        user_uuid: userUuid,
        filename,
        mimetype: contentType,
        size: buffer.length,
        url: uploaded.url,
        path: uploaded.path,
        type: documentType,
      },
    });

    return {
      file_url: uploaded.url,
      filename,
      document_uuid: document.uuid,
      media_type: contentType,
    };
  }
}
