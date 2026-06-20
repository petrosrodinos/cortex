import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, loadRuntimePackage, optionalNumber, optionalString } from '../saas-integration.base';
import { NOTION_REQUIRED_CONFIG_KEYS } from './config/notion.config';
import { NotionService } from './services/notion.service';

@Injectable()
export class NotionIntegration extends SaasIntegration {
  provider = IntegrationProvider.NOTION;

  protected readonly actions: SaasActionDefinition[] = [
    // ── Search ────────────────────────────────────────────────────────────
    {
      key: 'search',
      label: 'Search',
      description: 'Search Notion pages and databases.',
      schema: z.object({ query: optionalString, filterType: optionalString, pageSize: optionalNumber }),
      parameters: this.jsonSchema({ query: { type: 'string' }, filterType: { type: 'string', enum: ['page', 'database'] }, pageSize: { type: 'number' } }),
    },

    // ── Pages ─────────────────────────────────────────────────────────────
    {
      key: 'get_page',
      label: 'Get page',
      description: 'Get a Notion page by ID.',
      schema: z.object({ pageId: z.string() }),
      parameters: this.jsonSchema({ pageId: { type: 'string' } }, ['pageId']),
    },
    {
      key: 'create_page',
      label: 'Create page',
      description: 'Create a new Notion page inside a page or database.',
      schema: z.object({ parentPageId: optionalString, parentDatabaseId: optionalString, title: optionalString, properties: z.record(z.string(), z.any()).optional(), children: z.array(z.any()).optional() }),
      parameters: this.jsonSchema({ parentPageId: { type: 'string' }, parentDatabaseId: { type: 'string' }, title: { type: 'string' }, properties: { type: 'object' }, children: { type: 'array' } }),
    },
    {
      key: 'update_page',
      label: 'Update page',
      description: 'Update Notion page properties.',
      schema: z.object({ pageId: z.string(), properties: z.record(z.string(), z.any()).optional(), archived: z.boolean().optional() }),
      parameters: this.jsonSchema({ pageId: { type: 'string' }, properties: { type: 'object' }, archived: { type: 'boolean' } }, ['pageId']),
    },
    {
      key: 'archive_page',
      label: 'Archive page',
      description: 'Archive (soft-delete) a Notion page.',
      schema: z.object({ pageId: z.string() }),
      parameters: this.jsonSchema({ pageId: { type: 'string' } }, ['pageId']),
    },
    {
      key: 'get_page_content',
      label: 'Get page content',
      description: 'Get the block content of a Notion page.',
      schema: z.object({ pageId: z.string(), pageSize: optionalNumber }),
      parameters: this.jsonSchema({ pageId: { type: 'string' }, pageSize: { type: 'number' } }, ['pageId']),
    },

    // ── Databases ─────────────────────────────────────────────────────────
    {
      key: 'list_databases',
      label: 'List databases',
      description: 'List Notion databases available to the integration.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'get_database',
      label: 'Get database',
      description: 'Get a Notion database by ID.',
      schema: z.object({ databaseId: z.string() }),
      parameters: this.jsonSchema({ databaseId: { type: 'string' } }, ['databaseId']),
    },
    {
      key: 'query_database',
      label: 'Query database',
      description: 'Query a Notion database with optional filters and sorts.',
      schema: z.object({ databaseId: z.string(), filter: z.record(z.string(), z.any()).optional(), sorts: z.array(z.any()).optional(), pageSize: optionalNumber }),
      parameters: this.jsonSchema({ databaseId: { type: 'string' }, filter: { type: 'object' }, sorts: { type: 'array' }, pageSize: { type: 'number' } }, ['databaseId']),
    },
    {
      key: 'create_database',
      label: 'Create database',
      description: 'Create a new Notion database as a child of a page.',
      schema: z.object({ parentPageId: z.string(), title: z.string(), properties: z.record(z.string(), z.any()).optional() }),
      parameters: this.jsonSchema({ parentPageId: { type: 'string' }, title: { type: 'string' }, properties: { type: 'object' } }, ['parentPageId', 'title']),
    },
    {
      key: 'update_database',
      label: 'Update database',
      description: 'Update a Notion database title or properties schema.',
      schema: z.object({ databaseId: z.string(), title: optionalString, properties: z.record(z.string(), z.any()).optional() }),
      parameters: this.jsonSchema({ databaseId: { type: 'string' }, title: { type: 'string' }, properties: { type: 'object' } }, ['databaseId']),
    },

    // ── Blocks ────────────────────────────────────────────────────────────
    {
      key: 'get_block',
      label: 'Get block',
      description: 'Get a Notion block by ID.',
      schema: z.object({ blockId: z.string() }),
      parameters: this.jsonSchema({ blockId: { type: 'string' } }, ['blockId']),
    },
    {
      key: 'get_block_children',
      label: 'Get block children',
      description: 'List child blocks of a Notion block or page.',
      schema: z.object({ blockId: z.string(), pageSize: optionalNumber }),
      parameters: this.jsonSchema({ blockId: { type: 'string' }, pageSize: { type: 'number' } }, ['blockId']),
    },
    {
      key: 'append_block_children',
      label: 'Append block children',
      description: 'Append new blocks to a Notion page or block.',
      schema: z.object({ blockId: z.string(), children: z.array(z.any()) }),
      parameters: this.jsonSchema({ blockId: { type: 'string' }, children: { type: 'array' } }, ['blockId', 'children']),
    },
    {
      key: 'delete_block',
      label: 'Delete block',
      description: 'Delete a Notion block.',
      schema: z.object({ blockId: z.string() }),
      parameters: this.jsonSchema({ blockId: { type: 'string' } }, ['blockId']),
    },

    // ── Users ─────────────────────────────────────────────────────────────
    {
      key: 'list_users',
      label: 'List users',
      description: 'List all users in the Notion workspace.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'get_user',
      label: 'Get user',
      description: 'Get a Notion user by ID.',
      schema: z.object({ userId: z.string() }),
      parameters: this.jsonSchema({ userId: { type: 'string' } }, ['userId']),
    },
    {
      key: 'get_bot_user',
      label: 'Get bot user',
      description: 'Get the bot user associated with the current integration.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },

    // ── Comments ──────────────────────────────────────────────────────────
    {
      key: 'list_comments',
      label: 'List comments',
      description: 'List comments on a Notion page or block.',
      schema: z.object({ blockId: z.string() }),
      parameters: this.jsonSchema({ blockId: { type: 'string' } }, ['blockId']),
    },
    {
      key: 'create_comment',
      label: 'Create comment',
      description: 'Add a comment to a Notion page.',
      schema: z.object({ pageId: z.string(), content: z.string() }),
      parameters: this.jsonSchema({ pageId: { type: 'string' }, content: { type: 'string' } }, ['pageId', 'content']),
    },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) {
    super(prisma, encryption);
  }

  protected requiredConfigKeys() {
    return [...NOTION_REQUIRED_CONFIG_KEYS];
  }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { Client } = await loadRuntimePackage('@notionhq/client');
    const service = new NotionService(new Client({ auth: config.apiKey }));

    const actions: Record<string, () => Promise<any>> = {
      // Search
      search: () => service.search(input),
      // Pages
      get_page: () => service.getPage(input as any),
      create_page: () => service.createPage(input as any),
      update_page: () => service.updatePage(input as any),
      archive_page: () => service.archivePage(input as any),
      get_page_content: () => service.getPageContent(input as any),
      // Databases
      list_databases: () => service.listDatabases(),
      get_database: () => service.getDatabase(input as any),
      query_database: () => service.queryDatabase(input as any),
      create_database: () => service.createDatabase(input as any),
      update_database: () => service.updateDatabase(input as any),
      // Blocks
      get_block: () => service.getBlock(input as any),
      get_block_children: () => service.getBlockChildren(input as any),
      append_block_children: () => service.appendBlockChildren(input as any),
      delete_block: () => service.deleteBlock(input as any),
      // Users
      list_users: () => service.listUsers(),
      get_user: () => service.getUser(input as any),
      get_bot_user: () => service.getBotUser(),
      // Comments
      list_comments: () => service.listComments(input as any),
      create_comment: () => service.createComment(input as any),
    };

    return actions[actionKey]();
  }
}
