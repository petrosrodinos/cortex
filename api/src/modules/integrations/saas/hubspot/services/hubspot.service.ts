import { HUBSPOT_DEFAULTS } from '../config/hubspot.config';
import {
  AssociateInput,
  CreateCompanyInput,
  CreateContactInput,
  CreateDealInput,
  CreateNoteInput,
  CreateTicketInput,
  DeleteCompanyInput,
  DeleteContactInput,
  DeleteDealInput,
  DeleteTicketInput,
  GetCompanyInput,
  GetContactInput,
  GetDealInput,
  GetTicketInput,
  ListInput,
  ListPipelineStagesInput,
  SearchInput,
  UpdateCompanyInput,
  UpdateContactInput,
  UpdateDealInput,
  UpdateTicketInput,
} from '../interfaces/hubspot.interfaces';
import { buildSearchRequest, deletedResult, wrapResult } from '../utils/hubspot.utils';

export class HubSpotService {
  constructor(private readonly client: any) {}

  // ── Contacts ──────────────────────────────────────────────────────────────

  async listContacts({ limit, after }: ListInput = {}) {
    return wrapResult(await this.client.crm.contacts.basicApi.getPage(limit ?? HUBSPOT_DEFAULTS.LIMIT, after));
  }

  async getContact({ contactId }: GetContactInput) {
    return wrapResult(await this.client.crm.contacts.basicApi.getById(contactId));
  }

  async createContact({ email, firstname, lastname, phone, company, jobtitle, website }: CreateContactInput) {
    return wrapResult(await this.client.crm.contacts.basicApi.create({ properties: { email, firstname, lastname, phone, company, jobtitle, website } }));
  }

  async updateContact({ contactId, properties }: UpdateContactInput) {
    return wrapResult(await this.client.crm.contacts.basicApi.update(contactId, { properties }));
  }

  async deleteContact({ contactId }: DeleteContactInput) {
    await this.client.crm.contacts.basicApi.archive(contactId);
    return deletedResult(`Contact ${contactId} deleted.`);
  }

  async searchContacts({ query, limit }: SearchInput) {
    return wrapResult(await this.client.crm.contacts.searchApi.doSearch(buildSearchRequest(query, limit ?? HUBSPOT_DEFAULTS.LIMIT)));
  }

  // ── Companies ─────────────────────────────────────────────────────────────

  async listCompanies({ limit, after }: ListInput = {}) {
    return wrapResult(await this.client.crm.companies.basicApi.getPage(limit ?? HUBSPOT_DEFAULTS.LIMIT, after));
  }

  async getCompany({ companyId }: GetCompanyInput) {
    return wrapResult(await this.client.crm.companies.basicApi.getById(companyId));
  }

  async createCompany({ name, domain, phone, city, country, industry, description }: CreateCompanyInput) {
    return wrapResult(await this.client.crm.companies.basicApi.create({ properties: { name, domain, phone, city, country, industry, description } }));
  }

  async updateCompany({ companyId, properties }: UpdateCompanyInput) {
    return wrapResult(await this.client.crm.companies.basicApi.update(companyId, { properties }));
  }

  async deleteCompany({ companyId }: DeleteCompanyInput) {
    await this.client.crm.companies.basicApi.archive(companyId);
    return deletedResult(`Company ${companyId} deleted.`);
  }

  async searchCompanies({ query, limit }: SearchInput) {
    return wrapResult(await this.client.crm.companies.searchApi.doSearch(buildSearchRequest(query, limit ?? HUBSPOT_DEFAULTS.LIMIT)));
  }

  // ── Deals ─────────────────────────────────────────────────────────────────

  async listDeals({ limit, after }: ListInput = {}) {
    return wrapResult(await this.client.crm.deals.basicApi.getPage(limit ?? HUBSPOT_DEFAULTS.LIMIT, after));
  }

  async getDeal({ dealId }: GetDealInput) {
    return wrapResult(await this.client.crm.deals.basicApi.getById(dealId));
  }

  async createDeal({ dealname, amount, closedate, dealstage, pipeline, hubspot_owner_id }: CreateDealInput) {
    return wrapResult(await this.client.crm.deals.basicApi.create({ properties: { dealname, amount, closedate, dealstage, pipeline, hubspot_owner_id } }));
  }

  async updateDeal({ dealId, properties }: UpdateDealInput) {
    return wrapResult(await this.client.crm.deals.basicApi.update(dealId, { properties }));
  }

  async deleteDeal({ dealId }: DeleteDealInput) {
    await this.client.crm.deals.basicApi.archive(dealId);
    return deletedResult(`Deal ${dealId} deleted.`);
  }

  async searchDeals({ query, limit }: SearchInput) {
    return wrapResult(await this.client.crm.deals.searchApi.doSearch(buildSearchRequest(query, limit ?? HUBSPOT_DEFAULTS.LIMIT)));
  }

  // ── Tickets ───────────────────────────────────────────────────────────────

  async listTickets({ limit, after }: ListInput = {}) {
    return wrapResult(await this.client.crm.tickets.basicApi.getPage(limit ?? HUBSPOT_DEFAULTS.LIMIT, after));
  }

  async getTicket({ ticketId }: GetTicketInput) {
    return wrapResult(await this.client.crm.tickets.basicApi.getById(ticketId));
  }

  async createTicket({ subject, content, hs_ticket_priority, hs_pipeline, hs_pipeline_stage }: CreateTicketInput) {
    return wrapResult(await this.client.crm.tickets.basicApi.create({ properties: { subject, content, hs_ticket_priority, hs_pipeline, hs_pipeline_stage } }));
  }

  async updateTicket({ ticketId, properties }: UpdateTicketInput) {
    return wrapResult(await this.client.crm.tickets.basicApi.update(ticketId, { properties }));
  }

  async deleteTicket({ ticketId }: DeleteTicketInput) {
    await this.client.crm.tickets.basicApi.archive(ticketId);
    return deletedResult(`Ticket ${ticketId} deleted.`);
  }

  // ── Notes ─────────────────────────────────────────────────────────────────

  async listNotes({ limit, after }: ListInput = {}) {
    return wrapResult(await this.client.crm.objects.notes.basicApi.getPage(limit ?? HUBSPOT_DEFAULTS.LIMIT, after));
  }

  async createNote({ body, hs_timestamp }: CreateNoteInput) {
    return wrapResult(await this.client.crm.objects.notes.basicApi.create({ properties: { hs_note_body: body, hs_timestamp: hs_timestamp ?? new Date().toISOString() } }));
  }

  // ── Owners ────────────────────────────────────────────────────────────────

  async listOwners({ limit }: ListInput = {}) {
    return wrapResult(await this.client.crm.owners.ownersApi.getPage(undefined, undefined, limit ?? HUBSPOT_DEFAULTS.LIMIT));
  }

  // ── Pipelines ─────────────────────────────────────────────────────────────

  async listPipelines() {
    return wrapResult(await this.client.crm.pipelines.pipelinesApi.getAll('deals'));
  }

  async listPipelineStages({ pipelineId }: ListPipelineStagesInput) {
    return wrapResult(await this.client.crm.pipelines.pipelineStagesApi.getAll('deals', pipelineId));
  }

  // ── Associations ──────────────────────────────────────────────────────────

  async associate({ fromObjectType, fromObjectId, toObjectType, toObjectId, associationType }: AssociateInput) {
    return wrapResult(await this.client.crm.associations.v4.basicApi.create(fromObjectType, fromObjectId, toObjectType, toObjectId, [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: associationType }]));
  }
}
