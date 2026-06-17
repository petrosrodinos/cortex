import { ExportFormat } from '../config/google-drive.config';

// ── Files ─────────────────────────────────────────────────────────────────────

export interface ListFilesInput {
  query?: string;
  pageSize?: number;
  pageToken?: string;
  folderId?: string;
  orderBy?: string;
}

export interface GetFileInput {
  fileId: string;
}

export interface DownloadFileInput {
  fileId: string;
  mimeType?: string;
}

export interface SearchFilesInput {
  query: string;
  pageSize?: number;
}

export interface CreateFileInput {
  name: string;
  content?: string;
  mimeType?: string;
  parentFolderId?: string;
}

export interface CreateFolderInput {
  name: string;
  parentFolderId?: string;
}

export interface CopyFileInput {
  fileId: string;
  name?: string;
  parentFolderId?: string;
}

export interface MoveFileInput {
  fileId: string;
  newParentFolderId: string;
}

export interface RenameFileInput {
  fileId: string;
  name: string;
}

export interface DeleteFileInput {
  fileId: string;
}

export interface TrashFileInput {
  fileId: string;
}

export interface RestoreFileInput {
  fileId: string;
}

export interface ExportFileInput {
  fileId: string;
  format: ExportFormat;
}

export interface ListFolderContentsInput {
  folderId: string;
  pageSize?: number;
}

// ── Permissions ───────────────────────────────────────────────────────────────

export interface ListPermissionsInput {
  fileId: string;
}

export interface CreatePermissionInput {
  fileId: string;
  role: 'reader' | 'writer' | 'commenter' | 'owner';
  type: 'user' | 'group' | 'domain' | 'anyone';
  emailAddress?: string;
  domain?: string;
  sendNotification?: boolean;
}

export interface DeletePermissionInput {
  fileId: string;
  permissionId: string;
}

// ── Comments ──────────────────────────────────────────────────────────────────

export interface ListCommentsInput {
  fileId: string;
}

export interface CreateCommentInput {
  fileId: string;
  content: string;
}

// ── Result ────────────────────────────────────────────────────────────────────

export interface GoogleDriveActionResult<T = any> {
  success: boolean;
  data: T;
}
