import { NOTION_DEFAULTS } from '../config/notion.config';
import {
  AppendBlockChildrenInput,
  ArchivePageInput,
  CreateCommentInput,
  CreateDatabaseInput,
  CreatePageInput,
  DeleteBlockInput,
  GetBlockChildrenInput,
  GetBlockInput,
  GetDatabaseInput,
  GetPageContentInput,
  GetPageInput,
  GetUserInput,
  ListCommentsInput,
  QueryDatabaseInput,
  SearchInput,
  UpdateDatabaseInput,
  UpdatePageInput,
} from '../interfaces/notion.interfaces';
import { buildRichText, buildTitleProperty, wrapResult } from '../utils/notion.utils';

export class NotionService {
  constructor(private readonly client: any) {}

  // ── Search ────────────────────────────────────────────────────────────────

  async search({ query, filterType, pageSize }: SearchInput = {}) {
    const filter = filterType ? { property: 'object', value: filterType } : undefined;
    return wrapResult(await this.client.search({ query, filter, page_size: pageSize ?? NOTION_DEFAULTS.PAGE_SIZE }));
  }

  // ── Pages ─────────────────────────────────────────────────────────────────

  async getPage({ pageId }: GetPageInput) {
    return wrapResult(await this.client.pages.retrieve({ page_id: pageId }));
  }

  async createPage({ parentPageId, parentDatabaseId, title, properties, children }: CreatePageInput) {
    const parent = parentDatabaseId
      ? { database_id: parentDatabaseId }
      : { page_id: parentPageId };
    const resolvedProperties = properties ?? (title ? { title: buildTitleProperty(title) } : {});
    return wrapResult(await this.client.pages.create({ parent, properties: resolvedProperties, children }));
  }

  async updatePage({ pageId, properties, archived }: UpdatePageInput) {
    return wrapResult(await this.client.pages.update({ page_id: pageId, properties, archived }));
  }

  async archivePage({ pageId }: ArchivePageInput) {
    return wrapResult(await this.client.pages.update({ page_id: pageId, archived: true }));
  }

  async getPageContent({ pageId, pageSize }: GetPageContentInput) {
    return wrapResult(await this.client.blocks.children.list({ block_id: pageId, page_size: pageSize ?? NOTION_DEFAULTS.PAGE_SIZE }));
  }

  // ── Databases ─────────────────────────────────────────────────────────────

  async listDatabases() {
    return wrapResult(await this.client.search({ filter: { property: 'object', value: 'database' } }));
  }

  async getDatabase({ databaseId }: GetDatabaseInput) {
    return wrapResult(await this.client.databases.retrieve({ database_id: databaseId }));
  }

  async queryDatabase({ databaseId, filter, sorts, pageSize }: QueryDatabaseInput) {
    return wrapResult(await this.client.databases.query({ database_id: databaseId, filter, sorts, page_size: pageSize ?? NOTION_DEFAULTS.PAGE_SIZE }));
  }

  async createDatabase({ parentPageId, title, properties }: CreateDatabaseInput) {
    return wrapResult(await this.client.databases.create({
      parent: { page_id: parentPageId },
      title: buildRichText(title),
      properties: properties ?? {},
    }));
  }

  async updateDatabase({ databaseId, title, properties }: UpdateDatabaseInput) {
    const titleProp = title ? buildRichText(title) : undefined;
    return wrapResult(await this.client.databases.update({ database_id: databaseId, title: titleProp, properties }));
  }

  // ── Blocks ────────────────────────────────────────────────────────────────

  async getBlock({ blockId }: GetBlockInput) {
    return wrapResult(await this.client.blocks.retrieve({ block_id: blockId }));
  }

  async getBlockChildren({ blockId, pageSize }: GetBlockChildrenInput) {
    return wrapResult(await this.client.blocks.children.list({ block_id: blockId, page_size: pageSize ?? NOTION_DEFAULTS.PAGE_SIZE }));
  }

  async appendBlockChildren({ blockId, children }: AppendBlockChildrenInput) {
    return wrapResult(await this.client.blocks.children.append({ block_id: blockId, children }));
  }

  async deleteBlock({ blockId }: DeleteBlockInput) {
    return wrapResult(await this.client.blocks.delete({ block_id: blockId }));
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  async listUsers() {
    return wrapResult(await this.client.users.list());
  }

  async getUser({ userId }: GetUserInput) {
    return wrapResult(await this.client.users.retrieve({ user_id: userId }));
  }

  async getBotUser() {
    return wrapResult(await this.client.users.me());
  }

  // ── Comments ──────────────────────────────────────────────────────────────

  async listComments({ blockId }: ListCommentsInput) {
    return wrapResult(await this.client.comments.list({ block_id: blockId }));
  }

  async createComment({ pageId, content }: CreateCommentInput) {
    return wrapResult(await this.client.comments.create({
      parent: { page_id: pageId },
      rich_text: buildRichText(content),
    }));
  }
}
