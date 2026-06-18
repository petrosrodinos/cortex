import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationsService } from '@/modules/organizations/organizations.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { DocumentType } from 'generated/prisma';

interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationsService,
    private readonly gcs: GcsService,
  ) {}

  async upload(
    userUuid: string,
    organizationUuid: string,
    file: UploadedFile,
  ) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    const uploaded = await this.gcs.uploadImageFromBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
      'documents',
    );

    const document = await this.prisma.document.create({
      data: {
        user_uuid: userUuid,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: uploaded.url,
        path: uploaded.path,
        type: this.resolveDocumentType(file.mimetype),
      },
    });

    return {
      uuid: document.uuid,
      filename: document.filename,
      mimetype: document.mimetype,
      size: document.size,
      url: document.url,
    };
  }

  private resolveDocumentType(mimetype: string): DocumentType {
    if (mimetype.startsWith('image/')) return DocumentType.IMAGE;
    if (mimetype.startsWith('video/')) return DocumentType.VIDEO;
    if (mimetype.startsWith('audio/')) return DocumentType.AUDIO;
    if (mimetype === 'application/pdf') return DocumentType.PDF;
    return DocumentType.DOCUMENT;
  }

  async findAll(userUuid: string, organizationUuid: string) {
    await this.organizations.requireActiveMember(userUuid, organizationUuid);

    return this.prisma.document.findMany({
      where: { user_uuid: userUuid },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }
}
