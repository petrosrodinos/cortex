import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, loadRuntimePackage, optionalString } from '../saas-integration.base';

@Injectable()
export class NotionIntegration extends SaasIntegration {
  provider = IntegrationProvider.NOTION;
  protected readonly actions: SaasActionDefinition[] = [
    { key: 'search', label: 'Search', description: 'Search Notion pages and databases.', schema: z.object({ query: optionalString }), parameters: this.jsonSchema({ query: { type: 'string' } }) },
    { key: 'get_page', label: 'Get page', description: 'Get a Notion page.', schema: z.object({ pageId: z.string() }), parameters: this.jsonSchema({ pageId: { type: 'string' } }, ['pageId']) },
    { key: 'list_databases', label: 'List databases', description: 'List Notion databases available to the integration.', schema: emptySchema, parameters: this.jsonSchema() },
    { key: 'query_database', label: 'Query database', description: 'Query a Notion database.', schema: z.object({ databaseId: z.string(), filter: z.record(z.any()).optional() }), parameters: this.jsonSchema({ databaseId: { type: 'string' }, filter: { type: 'object' } }, ['databaseId']) },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) { super(prisma, encryption); }
  protected requiredConfigKeys() { return ['apiKey']; }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { Client } = await loadRuntimePackage('@notionhq/client');
    const client: any = new Client({ auth: config.apiKey });
    const actions: Record<string, () => Promise<any>> = {
      search: () => client.search({ query: input.query }),
      get_page: () => client.pages.retrieve({ page_id: input.pageId }),
      list_databases: () => client.search({ filter: { property: 'object', value: 'database' } }),
      query_database: () => client.databases.query({ database_id: input.databaseId, filter: input.filter }),
    };
    return { success: true, data: await actions[actionKey]() };
  }
}
