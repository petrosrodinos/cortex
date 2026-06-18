export interface DocxSectionInput {
  heading?: string;
  body: string;
}

export interface DocxTableInput {
  headers: string[];
  rows: string[][];
}

export interface DocxGenerateParams {
  title: string;
  sections: DocxSectionInput[];
  tables?: DocxTableInput[];
}

export interface GeneratedFileResult {
  file_url: string;
  filename: string;
  document_uuid: string;
  media_type: string;
}
