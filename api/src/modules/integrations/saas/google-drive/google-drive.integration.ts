import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, optionalNumber, optionalString } from '../saas-integration.base';
import { createGoogleOAuthClient } from '../google-auth.helper';
import { GOOGLE_DRIVE_REQUIRED_CONFIG_KEYS } from './config/google-drive.config';
import { GoogleDriveService } from './services/google-drive.service';

@Injectable()
export class GoogleDriveIntegration extends SaasIntegration {
  provider = IntegrationProvider.GOOGLE_DRIVE;

  protected readonly actions: SaasActionDefinition[] = [
    // ── Files ────────────────────────────────────────────────────────────
    {
      key: 'list_files',
      label: 'List files',
      description: 'List Google Drive files with optional query and pagination.',
      schema: z.object({ query: optionalString, pageSize: optionalNumber, pageToken: optionalString, folderId: optionalString, orderBy: optionalString }),
      parameters: this.jsonSchema({ query: { type: 'string' }, pageSize: { type: 'number' }, pageToken: { type: 'string' }, folderId: { type: 'string' }, orderBy: { type: 'string' } }),
    },
    {
      key: 'get_file',
      label: 'Get file',
      description: 'Get Google Drive file metadata by ID.',
      schema: z.object({ fileId: z.string() }),
      parameters: this.jsonSchema({ fileId: { type: 'string' } }, ['fileId']),
    },
    {
      key: 'download_file',
      label: 'Download file',
      description: 'Download the content of a Google Drive file.',
      schema: z.object({ fileId: z.string(), mimeType: optionalString }),
      parameters: this.jsonSchema({ fileId: { type: 'string' }, mimeType: { type: 'string' } }, ['fileId']),
    },
    {
      key: 'search',
      label: 'Search files',
      description: 'Search Google Drive files by name.',
      schema: z.object({ query: z.string(), pageSize: optionalNumber }),
      parameters: this.jsonSchema({ query: { type: 'string' }, pageSize: { type: 'number' } }, ['query']),
    },
    {
      key: 'create_file',
      label: 'Create file',
      description: 'Create a new file in Google Drive with optional text content.',
      schema: z.object({ name: z.string(), content: optionalString, mimeType: optionalString, parentFolderId: optionalString }),
      parameters: this.jsonSchema({ name: { type: 'string' }, content: { type: 'string' }, mimeType: { type: 'string' }, parentFolderId: { type: 'string' } }, ['name']),
    },
    {
      key: 'create_folder',
      label: 'Create folder',
      description: 'Create a new folder in Google Drive.',
      schema: z.object({ name: z.string(), parentFolderId: optionalString }),
      parameters: this.jsonSchema({ name: { type: 'string' }, parentFolderId: { type: 'string' } }, ['name']),
    },
    {
      key: 'copy_file',
      label: 'Copy file',
      description: 'Copy an existing Google Drive file.',
      schema: z.object({ fileId: z.string(), name: optionalString, parentFolderId: optionalString }),
      parameters: this.jsonSchema({ fileId: { type: 'string' }, name: { type: 'string' }, parentFolderId: { type: 'string' } }, ['fileId']),
    },
    {
      key: 'move_file',
      label: 'Move file',
      description: 'Move a Google Drive file to a different folder.',
      schema: z.object({ fileId: z.string(), newParentFolderId: z.string() }),
      parameters: this.jsonSchema({ fileId: { type: 'string' }, newParentFolderId: { type: 'string' } }, ['fileId', 'newParentFolderId']),
    },
    {
      key: 'rename_file',
      label: 'Rename file',
      description: 'Rename a Google Drive file or folder.',
      schema: z.object({ fileId: z.string(), name: z.string() }),
      parameters: this.jsonSchema({ fileId: { type: 'string' }, name: { type: 'string' } }, ['fileId', 'name']),
    },
    {
      key: 'delete_file',
      label: 'Delete file',
      description: 'Permanently delete a Google Drive file.',
      schema: z.object({ fileId: z.string() }),
      parameters: this.jsonSchema({ fileId: { type: 'string' } }, ['fileId']),
    },
    {
      key: 'trash_file',
      label: 'Trash file',
      description: 'Move a Google Drive file to trash.',
      schema: z.object({ fileId: z.string() }),
      parameters: this.jsonSchema({ fileId: { type: 'string' } }, ['fileId']),
    },
    {
      key: 'restore_file',
      label: 'Restore file',
      description: 'Restore a Google Drive file from trash.',
      schema: z.object({ fileId: z.string() }),
      parameters: this.jsonSchema({ fileId: { type: 'string' } }, ['fileId']),
    },
    {
      key: 'export_file',
      label: 'Export file',
      description: 'Export a Google Docs/Sheets/Slides file to a different format.',
      schema: z.object({ fileId: z.string(), format: z.enum(['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'csv', 'html']) }),
      parameters: this.jsonSchema({ fileId: { type: 'string' }, format: { type: 'string', enum: ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'csv', 'html'] } }, ['fileId', 'format']),
    },
    {
      key: 'list_folder_contents',
      label: 'List folder contents',
      description: 'List all files inside a specific Google Drive folder.',
      schema: z.object({ folderId: z.string(), pageSize: optionalNumber }),
      parameters: this.jsonSchema({ folderId: { type: 'string' }, pageSize: { type: 'number' } }, ['folderId']),
    },

    // ── Permissions ───────────────────────────────────────────────────────
    {
      key: 'list_permissions',
      label: 'List permissions',
      description: 'List sharing permissions for a Google Drive file.',
      schema: z.object({ fileId: z.string() }),
      parameters: this.jsonSchema({ fileId: { type: 'string' } }, ['fileId']),
    },
    {
      key: 'create_permission',
      label: 'Share file',
      description: 'Share a Google Drive file with a user, group, domain, or anyone.',
      schema: z.object({ fileId: z.string(), role: z.enum(['reader', 'writer', 'commenter', 'owner']), type: z.enum(['user', 'group', 'domain', 'anyone']), emailAddress: optionalString, domain: optionalString, sendNotification: z.boolean().optional() }),
      parameters: this.jsonSchema({ fileId: { type: 'string' }, role: { type: 'string', enum: ['reader', 'writer', 'commenter', 'owner'] }, type: { type: 'string', enum: ['user', 'group', 'domain', 'anyone'] }, emailAddress: { type: 'string' }, domain: { type: 'string' }, sendNotification: { type: 'boolean' } }, ['fileId', 'role', 'type']),
    },
    {
      key: 'delete_permission',
      label: 'Remove permission',
      description: 'Remove a sharing permission from a Google Drive file.',
      schema: z.object({ fileId: z.string(), permissionId: z.string() }),
      parameters: this.jsonSchema({ fileId: { type: 'string' }, permissionId: { type: 'string' } }, ['fileId', 'permissionId']),
    },

    // ── Comments ──────────────────────────────────────────────────────────
    {
      key: 'list_comments',
      label: 'List comments',
      description: 'List comments on a Google Drive file.',
      schema: z.object({ fileId: z.string() }),
      parameters: this.jsonSchema({ fileId: { type: 'string' } }, ['fileId']),
    },
    {
      key: 'create_comment',
      label: 'Create comment',
      description: 'Add a comment to a Google Drive file.',
      schema: z.object({ fileId: z.string(), content: z.string() }),
      parameters: this.jsonSchema({ fileId: { type: 'string' }, content: { type: 'string' } }, ['fileId', 'content']),
    },

    // ── Storage ───────────────────────────────────────────────────────────
    {
      key: 'get_storage_info',
      label: 'Get storage info',
      description: 'Get Google Drive storage quota and user information.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) {
    super(prisma, encryption);
  }

  protected requiredConfigKeys() {
    return [...GOOGLE_DRIVE_REQUIRED_CONFIG_KEYS];
  }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { google, auth } = await createGoogleOAuthClient(config);
    const service = new GoogleDriveService(google.drive({ version: 'v3', auth }));

    const actions: Record<string, () => Promise<any>> = {
      // Files
      list_files: () => service.listFiles(input),
      get_file: () => service.getFile(input as any),
      download_file: () => service.downloadFile(input as any),
      search: () => service.searchFiles(input as any),
      create_file: () => service.createFile(input as any),
      create_folder: () => service.createFolder(input as any),
      copy_file: () => service.copyFile(input as any),
      move_file: () => service.moveFile(input as any),
      rename_file: () => service.renameFile(input as any),
      delete_file: () => service.deleteFile(input as any),
      trash_file: () => service.trashFile(input as any),
      restore_file: () => service.restoreFile(input as any),
      export_file: () => service.exportFile(input as any),
      list_folder_contents: () => service.listFolderContents(input as any),
      // Permissions
      list_permissions: () => service.listPermissions(input as any),
      create_permission: () => service.createPermission(input as any),
      delete_permission: () => service.deletePermission(input as any),
      // Comments
      list_comments: () => service.listComments(input as any),
      create_comment: () => service.createComment(input as any),
      // Storage
      get_storage_info: () => service.getStorageInfo(),
    };

    return actions[actionKey]();
  }
}
