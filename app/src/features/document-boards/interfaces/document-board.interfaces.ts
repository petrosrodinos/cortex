export interface DocumentBoard {
  uuid: string;
  org_uuid: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BoardDocument {
  uuid: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  created_at: string;
}

export interface DocumentBoardItem {
  uuid: string;
  board_uuid: string;
  document_uuid: string;
  added_by: string;
  created_at: string;
  document: BoardDocument;
}

export interface DocumentBoardDetail extends DocumentBoard {
  items: DocumentBoardItem[];
}

export interface CreateDocumentBoardPayload {
  name: string;
  description?: string;
}

export type UpdateDocumentBoardPayload = Partial<CreateDocumentBoardPayload>;
