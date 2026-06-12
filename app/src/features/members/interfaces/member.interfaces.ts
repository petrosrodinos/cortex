import type { OrganizationRole } from '@/features/roles/interfaces/role.interfaces';

export const OrganizationMemberStatuses = {
  ACTIVE: 'ACTIVE',
  INVITED: 'INVITED',
  SUSPENDED: 'SUSPENDED',
} as const;

export type OrganizationMemberStatus = (typeof OrganizationMemberStatuses)[keyof typeof OrganizationMemberStatuses];

export interface OrganizationMember {
  id: number;
  uuid: string;
  org_uuid: string;
  user_uuid: string;
  role_uuid: string;
  status: OrganizationMemberStatus;
  invited_at: string;
  joined_at?: string | null;
  role?: OrganizationRole;
  user?: {
    uuid: string;
    email: string;
  };
}

export interface OrganizationMembersQuery {
  search?: string;
  status?: OrganizationMemberStatus;
  page?: number;
  limit?: number;
}

export interface InviteMemberDto {
  email: string;
  organization_role_uuid: string;
}

export interface UpdateMemberDto {
  organization_role_uuid?: string;
  status?: OrganizationMemberStatus;
}

export interface DeleteMemberDto {
  organization_uuid: string;
  organization_member_uuid: string;
}
