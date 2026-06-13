import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, loadRuntimePackage, optionalNumber, optionalString } from '../saas-integration.base';

@Injectable()
export class HubSpotIntegration extends SaasIntegration {
  provider = IntegrationProvider.HUBSPOT;
  protected readonly actions: SaasActionDefinition[] = [
    { key: 'list_contacts', label: 'List contacts', description: 'List HubSpot CRM contacts.', schema: z.object({ limit: optionalNumber }), parameters: this.jsonSchema({ limit: { type: 'number' } }) },
    { key: 'get_contact', label: 'Get contact', description: 'Get a HubSpot contact by ID.', schema: z.object({ contactId: z.string() }), parameters: this.jsonSchema({ contactId: { type: 'string' } }, ['contactId']) },
    { key: 'list_deals', label: 'List deals', description: 'List HubSpot CRM deals.', schema: z.object({ limit: optionalNumber }), parameters: this.jsonSchema({ limit: { type: 'number' } }) },
    { key: 'get_deal', label: 'Get deal', description: 'Get a HubSpot deal by ID.', schema: z.object({ dealId: z.string() }), parameters: this.jsonSchema({ dealId: { type: 'string' } }, ['dealId']) },
    { key: 'list_companies', label: 'List companies', description: 'List HubSpot CRM companies.', schema: z.object({ limit: optionalNumber }), parameters: this.jsonSchema({ limit: { type: 'number' } }) },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) { super(prisma, encryption); }
  protected requiredConfigKeys() { return ['accessToken']; }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { Client } = await loadRuntimePackage('@hubspot/api-client');
    const client: any = new Client({ accessToken: config.accessToken });
    const limit = input.limit ?? 100;
    const actions: Record<string, () => Promise<any>> = {
      list_contacts: () => client.crm.contacts.basicApi.getPage(limit),
      get_contact: () => client.crm.contacts.basicApi.getById(input.contactId),
      list_deals: () => client.crm.deals.basicApi.getPage(limit),
      get_deal: () => client.crm.deals.basicApi.getById(input.dealId),
      list_companies: () => client.crm.companies.basicApi.getPage(limit),
    };
    return { success: true, data: await actions[actionKey]() };
  }
}
