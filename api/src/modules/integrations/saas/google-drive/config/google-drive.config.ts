export const GOOGLE_DRIVE_DEFAULTS = {
  PAGE_SIZE: 50,
  FILE_FIELDS: 'id,name,mimeType,modifiedTime,webViewLink,size,parents',
  LIST_FIELDS: 'files(id,name,mimeType,modifiedTime,webViewLink,size,parents),nextPageToken',
} as const;

export const GOOGLE_DRIVE_REQUIRED_CONFIG_KEYS = ['accessToken'] as const;

export const GOOGLE_DRIVE_MIME_TYPES = {
  FOLDER: 'application/vnd.google-apps.folder',
  DOCUMENT: 'application/vnd.google-apps.document',
  SPREADSHEET: 'application/vnd.google-apps.spreadsheet',
  PRESENTATION: 'application/vnd.google-apps.presentation',
} as const;

export const GOOGLE_DRIVE_EXPORT_MIME_TYPES = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  csv: 'text/csv',
  html: 'text/html',
} as const;

export type ExportFormat = keyof typeof GOOGLE_DRIVE_EXPORT_MIME_TYPES;
