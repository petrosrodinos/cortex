import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EncryptionService } from '@/shared/utils/encryption.service';
import { IntegrationProvider } from 'generated/prisma';
import { SaasActionDefinition, SaasIntegration, emptySchema, loadRuntimePackage, optionalNumber, optionalString } from '../saas-integration.base';
import { HUBSPOT_REQUIRED_CONFIG_KEYS } from './config/hubspot.config';
import { HubSpotService } from './services/hubspot.service';

const propertiesSchema = z.record(z.string(), z.string());

@Injectable()
export class HubSpotIntegration extends SaasIntegration {
  provider = IntegrationProvider.HUBSPOT;

  protected readonly actions: SaasActionDefinition[] = [
    // ── Contacts ──────────────────────────────────────────────────────────
    {
      key: 'list_contacts',
      label: 'List contacts',
      description: 'List HubSpot CRM contacts.',
      schema: z.object({ limit: optionalNumber, after: optionalString }),
      parameters: this.jsonSchema({ limit: { type: 'number' }, after: { type: 'string' } }),
    },
    {
      key: 'get_contact',
      label: 'Get contact',
      description: 'Get a HubSpot contact by ID.',
      schema: z.object({ contactId: z.string() }),
      parameters: this.jsonSchema({ contactId: { type: 'string' } }, ['contactId']),
    },
    {
      key: 'create_contact',
      label: 'Create contact',
      description: 'Create a new HubSpot contact.',
      schema: z.object({ email: optionalString, firstname: optionalString, lastname: optionalString, phone: optionalString, company: optionalString, jobtitle: optionalString, website: optionalString }),
      parameters: this.jsonSchema({ email: { type: 'string' }, firstname: { type: 'string' }, lastname: { type: 'string' }, phone: { type: 'string' }, company: { type: 'string' }, jobtitle: { type: 'string' }, website: { type: 'string' } }),
    },
    {
      key: 'update_contact',
      label: 'Update contact',
      description: 'Update a HubSpot contact by ID.',
      schema: z.object({ contactId: z.string(), properties: propertiesSchema }),
      parameters: this.jsonSchema({ contactId: { type: 'string' }, properties: { type: 'object', additionalProperties: { type: 'string' } } }, ['contactId', 'properties']),
    },
    {
      key: 'delete_contact',
      label: 'Delete contact',
      description: 'Delete (archive) a HubSpot contact.',
      schema: z.object({ contactId: z.string() }),
      parameters: this.jsonSchema({ contactId: { type: 'string' } }, ['contactId']),
    },
    {
      key: 'search_contacts',
      label: 'Search contacts',
      description: 'Search HubSpot contacts by query.',
      schema: z.object({ query: z.string(), limit: optionalNumber }),
      parameters: this.jsonSchema({ query: { type: 'string' }, limit: { type: 'number' } }, ['query']),
    },

    // ── Companies ─────────────────────────────────────────────────────────
    {
      key: 'list_companies',
      label: 'List companies',
      description: 'List HubSpot CRM companies.',
      schema: z.object({ limit: optionalNumber, after: optionalString }),
      parameters: this.jsonSchema({ limit: { type: 'number' }, after: { type: 'string' } }),
    },
    {
      key: 'get_company',
      label: 'Get company',
      description: 'Get a HubSpot company by ID.',
      schema: z.object({ companyId: z.string() }),
      parameters: this.jsonSchema({ companyId: { type: 'string' } }, ['companyId']),
    },
    {
      key: 'create_company',
      label: 'Create company',
      description: 'Create a new HubSpot company.',
      schema: z.object({ name: z.string(), domain: optionalString, phone: optionalString, city: optionalString, country: optionalString, industry: optionalString, description: optionalString }),
      parameters: this.jsonSchema({ name: { type: 'string' }, domain: { type: 'string' }, phone: { type: 'string' }, city: { type: 'string' }, country: { type: 'string' }, industry: { type: 'string' }, description: { type: 'string' } }, ['name']),
    },
    {
      key: 'update_company',
      label: 'Update company',
      description: 'Update a HubSpot company by ID.',
      schema: z.object({ companyId: z.string(), properties: propertiesSchema }),
      parameters: this.jsonSchema({ companyId: { type: 'string' }, properties: { type: 'object', additionalProperties: { type: 'string' } } }, ['companyId', 'properties']),
    },
    {
      key: 'delete_company',
      label: 'Delete company',
      description: 'Delete (archive) a HubSpot company.',
      schema: z.object({ companyId: z.string() }),
      parameters: this.jsonSchema({ companyId: { type: 'string' } }, ['companyId']),
    },
    {
      key: 'search_companies',
      label: 'Search companies',
      description: 'Search HubSpot companies by query.',
      schema: z.object({ query: z.string(), limit: optionalNumber }),
      parameters: this.jsonSchema({ query: { type: 'string' }, limit: { type: 'number' } }, ['query']),
    },

    // ── Deals ─────────────────────────────────────────────────────────────
    {
      key: 'list_deals',
      label: 'List deals',
      description: 'List HubSpot CRM deals.',
      schema: z.object({ limit: optionalNumber, after: optionalString }),
      parameters: this.jsonSchema({ limit: { type: 'number' }, after: { type: 'string' } }),
    },
    {
      key: 'get_deal',
      label: 'Get deal',
      description: 'Get a HubSpot deal by ID.',
      schema: z.object({ dealId: z.string() }),
      parameters: this.jsonSchema({ dealId: { type: 'string' } }, ['dealId']),
    },
    {
      key: 'create_deal',
      label: 'Create deal',
      description: 'Create a new HubSpot deal.',
      schema: z.object({ dealname: z.string(), amount: optionalString, closedate: optionalString, dealstage: optionalString, pipeline: optionalString, hubspot_owner_id: optionalString }),
      parameters: this.jsonSchema({ dealname: { type: 'string' }, amount: { type: 'string' }, closedate: { type: 'string' }, dealstage: { type: 'string' }, pipeline: { type: 'string' }, hubspot_owner_id: { type: 'string' } }, ['dealname']),
    },
    {
      key: 'update_deal',
      label: 'Update deal',
      description: 'Update a HubSpot deal by ID.',
      schema: z.object({ dealId: z.string(), properties: propertiesSchema }),
      parameters: this.jsonSchema({ dealId: { type: 'string' }, properties: { type: 'object', additionalProperties: { type: 'string' } } }, ['dealId', 'properties']),
    },
    {
      key: 'delete_deal',
      label: 'Delete deal',
      description: 'Delete (archive) a HubSpot deal.',
      schema: z.object({ dealId: z.string() }),
      parameters: this.jsonSchema({ dealId: { type: 'string' } }, ['dealId']),
    },
    {
      key: 'search_deals',
      label: 'Search deals',
      description: 'Search HubSpot deals by query.',
      schema: z.object({ query: z.string(), limit: optionalNumber }),
      parameters: this.jsonSchema({ query: { type: 'string' }, limit: { type: 'number' } }, ['query']),
    },

    // ── Tickets ───────────────────────────────────────────────────────────
    {
      key: 'list_tickets',
      label: 'List tickets',
      description: 'List HubSpot support tickets.',
      schema: z.object({ limit: optionalNumber, after: optionalString }),
      parameters: this.jsonSchema({ limit: { type: 'number' }, after: { type: 'string' } }),
    },
    {
      key: 'get_ticket',
      label: 'Get ticket',
      description: 'Get a HubSpot ticket by ID.',
      schema: z.object({ ticketId: z.string() }),
      parameters: this.jsonSchema({ ticketId: { type: 'string' } }, ['ticketId']),
    },
    {
      key: 'create_ticket',
      label: 'Create ticket',
      description: 'Create a new HubSpot support ticket.',
      schema: z.object({ subject: z.string(), content: optionalString, hs_ticket_priority: optionalString, hs_pipeline: optionalString, hs_pipeline_stage: optionalString }),
      parameters: this.jsonSchema({ subject: { type: 'string' }, content: { type: 'string' }, hs_ticket_priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] }, hs_pipeline: { type: 'string' }, hs_pipeline_stage: { type: 'string' } }, ['subject']),
    },
    {
      key: 'update_ticket',
      label: 'Update ticket',
      description: 'Update a HubSpot ticket by ID.',
      schema: z.object({ ticketId: z.string(), properties: propertiesSchema }),
      parameters: this.jsonSchema({ ticketId: { type: 'string' }, properties: { type: 'object', additionalProperties: { type: 'string' } } }, ['ticketId', 'properties']),
    },
    {
      key: 'delete_ticket',
      label: 'Delete ticket',
      description: 'Delete (archive) a HubSpot ticket.',
      schema: z.object({ ticketId: z.string() }),
      parameters: this.jsonSchema({ ticketId: { type: 'string' } }, ['ticketId']),
    },

    // ── Notes ─────────────────────────────────────────────────────────────
    {
      key: 'list_notes',
      label: 'List notes',
      description: 'List HubSpot CRM notes.',
      schema: z.object({ limit: optionalNumber, after: optionalString }),
      parameters: this.jsonSchema({ limit: { type: 'number' }, after: { type: 'string' } }),
    },
    {
      key: 'create_note',
      label: 'Create note',
      description: 'Create a HubSpot CRM note.',
      schema: z.object({ body: z.string(), hs_timestamp: optionalString }),
      parameters: this.jsonSchema({ body: { type: 'string' }, hs_timestamp: { type: 'string' } }, ['body']),
    },

    // ── Owners ────────────────────────────────────────────────────────────
    {
      key: 'list_owners',
      label: 'List owners',
      description: 'List HubSpot users (owners).',
      schema: z.object({ limit: optionalNumber }),
      parameters: this.jsonSchema({ limit: { type: 'number' } }),
    },

    // ── Pipelines ─────────────────────────────────────────────────────────
    {
      key: 'list_pipelines',
      label: 'List pipelines',
      description: 'List HubSpot deal pipelines.',
      schema: emptySchema,
      parameters: this.jsonSchema(),
    },
    {
      key: 'list_pipeline_stages',
      label: 'List pipeline stages',
      description: 'List stages for a HubSpot deal pipeline.',
      schema: z.object({ pipelineId: z.string() }),
      parameters: this.jsonSchema({ pipelineId: { type: 'string' } }, ['pipelineId']),
    },

    // ── Associations ──────────────────────────────────────────────────────
    {
      key: 'associate',
      label: 'Associate objects',
      description: 'Associate two HubSpot CRM objects (e.g. contact with a deal).',
      schema: z.object({ fromObjectType: z.string(), fromObjectId: z.string(), toObjectType: z.string(), toObjectId: z.string(), associationType: z.string() }),
      parameters: this.jsonSchema({ fromObjectType: { type: 'string' }, fromObjectId: { type: 'string' }, toObjectType: { type: 'string' }, toObjectId: { type: 'string' }, associationType: { type: 'string' } }, ['fromObjectType', 'fromObjectId', 'toObjectType', 'toObjectId', 'associationType']),
    },
  ];

  constructor(prisma: PrismaService, encryption: EncryptionService) {
    super(prisma, encryption);
  }

  protected requiredConfigKeys() {
    return [...HUBSPOT_REQUIRED_CONFIG_KEYS];
  }

  protected async executeValidatedTool(actionKey: string, input: Record<string, any>, config: Record<string, any>) {
    const { Client } = await loadRuntimePackage('@hubspot/api-client');
    const service = new HubSpotService(new Client({ accessToken: config.accessToken }));

    const actions: Record<string, () => Promise<any>> = {
      // Contacts
      list_contacts: () => service.listContacts(input),
      get_contact: () => service.getContact(input as any),
      create_contact: () => service.createContact(input as any),
      update_contact: () => service.updateContact(input as any),
      delete_contact: () => service.deleteContact(input as any),
      search_contacts: () => service.searchContacts(input as any),
      // Companies
      list_companies: () => service.listCompanies(input),
      get_company: () => service.getCompany(input as any),
      create_company: () => service.createCompany(input as any),
      update_company: () => service.updateCompany(input as any),
      delete_company: () => service.deleteCompany(input as any),
      search_companies: () => service.searchCompanies(input as any),
      // Deals
      list_deals: () => service.listDeals(input),
      get_deal: () => service.getDeal(input as any),
      create_deal: () => service.createDeal(input as any),
      update_deal: () => service.updateDeal(input as any),
      delete_deal: () => service.deleteDeal(input as any),
      search_deals: () => service.searchDeals(input as any),
      // Tickets
      list_tickets: () => service.listTickets(input),
      get_ticket: () => service.getTicket(input as any),
      create_ticket: () => service.createTicket(input as any),
      update_ticket: () => service.updateTicket(input as any),
      delete_ticket: () => service.deleteTicket(input as any),
      // Notes
      list_notes: () => service.listNotes(input),
      create_note: () => service.createNote(input as any),
      // Owners
      list_owners: () => service.listOwners(input),
      // Pipelines
      list_pipelines: () => service.listPipelines(),
      list_pipeline_stages: () => service.listPipelineStages(input as any),
      // Associations
      associate: () => service.associate(input as any),
    };

    return actions[actionKey]();
  }
}
