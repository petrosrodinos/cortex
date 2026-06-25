export interface DocumentBoard {
  uuid: string;
  org_uuid: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BoardDocumentUser {
  uuid: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

export interface BoardDocument {
  uuid: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  created_at: string;
  user: BoardDocumentUser;
}

export interface DocumentBoardItem {
  uuid: string;
  board_uuid: string;
  document_uuid: string;
  added_by: string;
  title: string | null;
  created_at: string;
  document: BoardDocument;
}

export interface DocumentBoardItemsQuery {
  page?: number;
  limit?: number;
}

export interface DocumentBoardItemsResponse {
  data: DocumentBoardItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface CreateDocumentBoardPayload {
  name: string;
  description?: string;
}

export type UpdateDocumentBoardPayload = Partial<CreateDocumentBoardPayload>;
