export const OrganizationMemberStatuses = {
  ACTIVE: 'ACTIVE',
  INVITED: 'INVITED',
  SUSPENDED: 'SUSPENDED',
} as const;

export type OrganizationMemberStatus = (typeof OrganizationMemberStatuses)[keyof typeof OrganizationMemberStatuses];

export interface Permission {
  id: number;
  uuid: string;
  key: string;
  label: string;
  group: string;
}

export interface OrganizationRole {
  id: number;
  uuid: string;
  org_uuid: string;
  name: string;
  is_system: boolean;
  permissions?: Array<{
    permission: Permission;
  }>;
}

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
