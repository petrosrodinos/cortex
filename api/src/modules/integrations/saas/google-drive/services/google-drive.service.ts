import { GOOGLE_DRIVE_DEFAULTS, GOOGLE_DRIVE_EXPORT_MIME_TYPES, GOOGLE_DRIVE_MIME_TYPES } from '../config/google-drive.config';
import {
  CopyFileInput,
  CreateCommentInput,
  CreateFileInput,
  CreateFolderInput,
  CreatePermissionInput,
  DeleteFileInput,
  DeletePermissionInput,
  DownloadFileInput,
  ExportFileInput,
  GetFileInput,
  ListCommentsInput,
  ListFilesInput,
  ListFolderContentsInput,
  ListPermissionsInput,
  MoveFileInput,
  RenameFileInput,
  RestoreFileInput,
  SearchFilesInput,
  TrashFileInput,
} from '../interfaces/google-drive.interfaces';
import { deletedResult, escapeQuery, extractData } from '../utils/google-drive.utils';

export class GoogleDriveService {
  constructor(private readonly drive: any) {}

  // ── Files ─────────────────────────────────────────────────────────────────

  listFiles({ query, pageSize, pageToken, folderId, orderBy }: ListFilesInput = {}) {
    const q = folderId ? `'${folderId}' in parents and trashed=false` : query;
    return this.drive.files
      .list({ q, pageSize: pageSize ?? GOOGLE_DRIVE_DEFAULTS.PAGE_SIZE, pageToken, orderBy, fields: GOOGLE_DRIVE_DEFAULTS.LIST_FIELDS })
      .then(extractData);
  }

  getFile({ fileId }: GetFileInput) {
    return this.drive.files.get({ fileId, fields: '*' }).then(extractData);
  }

  downloadFile({ fileId, mimeType }: DownloadFileInput) {
    return this.drive.files
      .get({ fileId, alt: 'media', mimeType }, { responseType: 'text' })
      .then(extractData);
  }

  searchFiles({ query, pageSize }: SearchFilesInput) {
    const q = `name contains '${escapeQuery(query)}'`;
    return this.drive.files
      .list({ q, pageSize: pageSize ?? GOOGLE_DRIVE_DEFAULTS.PAGE_SIZE, fields: GOOGLE_DRIVE_DEFAULTS.LIST_FIELDS })
      .then(extractData);
  }

  createFile({ name, content, mimeType, parentFolderId }: CreateFileInput) {
    const requestBody: any = { name, mimeType, parents: parentFolderId ? [parentFolderId] : undefined };
    const media = content ? { mimeType: mimeType ?? 'text/plain', body: content } : undefined;
    return this.drive.files
      .create({ requestBody, media, fields: GOOGLE_DRIVE_DEFAULTS.FILE_FIELDS })
      .then(extractData);
  }

  createFolder({ name, parentFolderId }: CreateFolderInput) {
    const requestBody = { name, mimeType: GOOGLE_DRIVE_MIME_TYPES.FOLDER, parents: parentFolderId ? [parentFolderId] : undefined };
    return this.drive.files
      .create({ requestBody, fields: GOOGLE_DRIVE_DEFAULTS.FILE_FIELDS })
      .then(extractData);
  }

  copyFile({ fileId, name, parentFolderId }: CopyFileInput) {
    const requestBody: any = {};
    if (name) requestBody.name = name;
    if (parentFolderId) requestBody.parents = [parentFolderId];
    return this.drive.files
      .copy({ fileId, requestBody, fields: GOOGLE_DRIVE_DEFAULTS.FILE_FIELDS })
      .then(extractData);
  }

  async moveFile({ fileId, newParentFolderId }: MoveFileInput) {
    const current = await this.drive.files.get({ fileId, fields: 'parents' });
    const previousParents = (current.data.parents ?? []).join(',');
    return this.drive.files
      .update({ fileId, addParents: newParentFolderId, removeParents: previousParents, fields: GOOGLE_DRIVE_DEFAULTS.FILE_FIELDS })
      .then(extractData);
  }

  renameFile({ fileId, name }: RenameFileInput) {
    return this.drive.files
      .update({ fileId, requestBody: { name }, fields: GOOGLE_DRIVE_DEFAULTS.FILE_FIELDS })
      .then(extractData);
  }

  async deleteFile({ fileId }: DeleteFileInput) {
    await this.drive.files.delete({ fileId });
    return deletedResult(`File ${fileId} permanently deleted.`);
  }

  trashFile({ fileId }: TrashFileInput) {
    return this.drive.files
      .update({ fileId, requestBody: { trashed: true }, fields: GOOGLE_DRIVE_DEFAULTS.FILE_FIELDS })
      .then(extractData);
  }

  restoreFile({ fileId }: RestoreFileInput) {
    return this.drive.files
      .update({ fileId, requestBody: { trashed: false }, fields: GOOGLE_DRIVE_DEFAULTS.FILE_FIELDS })
      .then(extractData);
  }

  exportFile({ fileId, format }: ExportFileInput) {
    const mimeType = GOOGLE_DRIVE_EXPORT_MIME_TYPES[format];
    return this.drive.files.export({ fileId, mimeType }, { responseType: 'text' }).then(extractData);
  }

  listFolderContents({ folderId, pageSize }: ListFolderContentsInput) {
    return this.drive.files
      .list({ q: `'${folderId}' in parents and trashed=false`, pageSize: pageSize ?? GOOGLE_DRIVE_DEFAULTS.PAGE_SIZE, fields: GOOGLE_DRIVE_DEFAULTS.LIST_FIELDS })
      .then(extractData);
  }

  // ── Permissions ───────────────────────────────────────────────────────────

  listPermissions({ fileId }: ListPermissionsInput) {
    return this.drive.permissions
      .list({ fileId, fields: 'permissions(id,role,type,emailAddress,displayName)' })
      .then(extractData);
  }

  createPermission({ fileId, role, type, emailAddress, domain, sendNotification }: CreatePermissionInput) {
    return this.drive.permissions
      .create({ fileId, sendNotificationEmail: sendNotification ?? false, requestBody: { role, type, emailAddress, domain } })
      .then(extractData);
  }

  async deletePermission({ fileId, permissionId }: DeletePermissionInput) {
    await this.drive.permissions.delete({ fileId, permissionId });
    return deletedResult(`Permission ${permissionId} removed.`);
  }

  // ── Comments ──────────────────────────────────────────────────────────────

  listComments({ fileId }: ListCommentsInput) {
    return this.drive.comments
      .list({ fileId, fields: 'comments(id,content,author,createdTime,resolved)' })
      .then(extractData);
  }

  createComment({ fileId, content }: CreateCommentInput) {
    return this.drive.comments
      .create({ fileId, requestBody: { content }, fields: 'id,content,author,createdTime' })
      .then(extractData);
  }

  // ── Storage ───────────────────────────────────────────────────────────────

  getStorageInfo() {
    return this.drive.about.get({ fields: 'storageQuota,user' }).then(extractData);
  }
}
