import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, optionalNumber, optionalString } from '../saas-integration.base';
import { createGoogleOAuthClient } from '../google-auth.helper';

@Injectable()
export class GoogleDriveIntegration extends SaasIntegration {
  provider = IntegrationProvider.GOOGLE_DRIVE;
  protected readonly actions: SaasActionDefinition[] = [
    { key: 'list_files', label: 'List files', description: 'List Google Drive files.', schema: z.object({ query: optionalString, pageSize: optionalNumber }), parameters: this.jsonSchema({ query: { type: 'string' }, pageSize: { type: 'number' } }) },
    { key: 'get_file', label: 'Get file', description: 'Get Google Drive file metadata.', schema: z.object({ fileId: z.string() }), parameters: this.jsonSchema({ fileId: { type: 'string' } }, ['fileId']) },
    { key: 'download_file', label: 'Download file', description: 'Download Google Drive file content.', schema: z.object({ fileId: z.string(), mimeType: optionalString }), parameters: this.jsonSchema({ fileId: { type: 'string' }, mimeType: { type: 'string' } }, ['fileId']) },
    { key: 'search', label: 'Search files', description: 'Search Google Drive files.', schema: z.object({ query: z.string(), pageSize: optionalNumber }), parameters: this.jsonSchema({ query: { type: 'string' }, pageSize: { type: 'number' } }, ['query']) },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) { super(prisma, encryption); }
  protected requiredConfigKeys() { return ['accessToken']; }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { google, auth } = await createGoogleOAuthClient(config);
    const drive: any = google.drive({ version: 'v3', auth });
    const actions: Record<string, () => Promise<any>> = {
      list_files: () => drive.files.list({ q: input.query, pageSize: input.pageSize ?? 50, fields: 'files(id,name,mimeType,modifiedTime,webViewLink)' }),
      get_file: () => drive.files.get({ fileId: input.fileId, fields: '*' }),
      download_file: () => drive.files.get({ fileId: input.fileId, alt: 'media' }, { responseType: 'text' }),
      search: () => drive.files.list({ q: `name contains '${String(input.query).replace(/'/g, "\\'")}'`, pageSize: input.pageSize ?? 50 }),
    };
    const response = await actions[actionKey]();
    return { success: true, data: response.data };
  }
}
