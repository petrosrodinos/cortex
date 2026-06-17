// ── Shared ────────────────────────────────────────────────────────────────────

export interface ListInput {
  limit?: number;
  after?: string;
}

export interface SearchInput {
  query: string;
  limit?: number;
}

// ── Contacts ──────────────────────────────────────────────────────────────────

export interface GetContactInput {
  contactId: string;
}

export interface CreateContactInput {
  email?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  jobtitle?: string;
  website?: string;
}

export interface UpdateContactInput {
  contactId: string;
  properties: Record<string, string>;
}

export interface DeleteContactInput {
  contactId: string;
}

// ── Companies ─────────────────────────────────────────────────────────────────

export interface GetCompanyInput {
  companyId: string;
}

export interface CreateCompanyInput {
  name: string;
  domain?: string;
  phone?: string;
  city?: string;
  country?: string;
  industry?: string;
  description?: string;
}

export interface UpdateCompanyInput {
  companyId: string;
  properties: Record<string, string>;
}

export interface DeleteCompanyInput {
  companyId: string;
}

// ── Deals ─────────────────────────────────────────────────────────────────────

export interface GetDealInput {
  dealId: string;
}

export interface CreateDealInput {
  dealname: string;
  amount?: string;
  closedate?: string;
  dealstage?: string;
  pipeline?: string;
  hubspot_owner_id?: string;
}

export interface UpdateDealInput {
  dealId: string;
  properties: Record<string, string>;
}

export interface DeleteDealInput {
  dealId: string;
}

// ── Tickets ───────────────────────────────────────────────────────────────────

export interface GetTicketInput {
  ticketId: string;
}

export interface CreateTicketInput {
  subject: string;
  content?: string;
  hs_ticket_priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  hs_pipeline?: string;
  hs_pipeline_stage?: string;
}

export interface UpdateTicketInput {
  ticketId: string;
  properties: Record<string, string>;
}

export interface DeleteTicketInput {
  ticketId: string;
}

// ── Notes ─────────────────────────────────────────────────────────────────────

export interface CreateNoteInput {
  body: string;
  hs_timestamp?: string;
}

// ── Pipelines ─────────────────────────────────────────────────────────────────

export interface ListPipelineStagesInput {
  pipelineId: string;
}

// ── Associations ──────────────────────────────────────────────────────────────

export interface AssociateInput {
  fromObjectType: string;
  fromObjectId: string;
  toObjectType: string;
  toObjectId: string;
  associationType: string;
}

// ── Result ────────────────────────────────────────────────────────────────────

export interface HubSpotActionResult<T = any> {
  success: boolean;
  data: T;
}
