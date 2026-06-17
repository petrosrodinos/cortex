// ── Search ────────────────────────────────────────────────────────────────────

export interface SearchInput {
  query?: string;
  filterType?: 'page' | 'database';
  pageSize?: number;
}

// ── Pages ─────────────────────────────────────────────────────────────────────

export interface GetPageInput {
  pageId: string;
}

export interface CreatePageInput {
  parentPageId?: string;
  parentDatabaseId?: string;
  title?: string;
  properties?: Record<string, any>;
  children?: any[];
}

export interface UpdatePageInput {
  pageId: string;
  properties?: Record<string, any>;
  archived?: boolean;
}

export interface ArchivePageInput {
  pageId: string;
}

export interface GetPageContentInput {
  pageId: string;
  pageSize?: number;
}

// ── Databases ─────────────────────────────────────────────────────────────────

export interface GetDatabaseInput {
  databaseId: string;
}

export interface QueryDatabaseInput {
  databaseId: string;
  filter?: Record<string, any>;
  sorts?: any[];
  pageSize?: number;
}

export interface CreateDatabaseInput {
  parentPageId: string;
  title: string;
  properties?: Record<string, any>;
}

export interface UpdateDatabaseInput {
  databaseId: string;
  title?: string;
  properties?: Record<string, any>;
}

// ── Blocks ────────────────────────────────────────────────────────────────────

export interface GetBlockInput {
  blockId: string;
}

export interface GetBlockChildrenInput {
  blockId: string;
  pageSize?: number;
}

export interface AppendBlockChildrenInput {
  blockId: string;
  children: any[];
}

export interface DeleteBlockInput {
  blockId: string;
}

// ── Users ─────────────────────────────────────────────────────────────────────

export interface GetUserInput {
  userId: string;
}

// ── Comments ──────────────────────────────────────────────────────────────────

export interface ListCommentsInput {
  blockId: string;
}

export interface CreateCommentInput {
  pageId: string;
  content: string;
}

// ── Result ────────────────────────────────────────────────────────────────────

export interface NotionActionResult<T = any> {
  success: boolean;
  data: T;
}
