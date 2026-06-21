export interface PdfGenerateParams {
  title: string;
  code: string;
}

export const PDF_MAX_CODE_BYTES = 128 * 1024;

export const PDF_MIME = 'application/pdf';
