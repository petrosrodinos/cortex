import type { OrganizationMember } from '@/features/members/interfaces/member.interfaces';

export interface Organization {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
  members?: OrganizationMember[];
}

export interface OrganizationsQuery {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateOrganizationDto {
  name: string;
  logo_url?: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  logo_url?: string | null;
}

export interface DeleteOrganizationDto {
  organization_uuid: string;
}

export interface SwitchOrganizationDto {
  organization_uuid: string;
}

export interface SwitchOrganizationResponse {
  access_token: string;
  expires_in: number;
  organization_uuid: string;
  organization_role: string;
  organization_permissions: string[];
}
