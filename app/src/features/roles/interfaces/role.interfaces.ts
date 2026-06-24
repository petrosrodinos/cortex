import type { Permission } from '@/features/permissions/interfaces/permission.interfaces';

export const OrganizationRoleTypes = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
} as const;

export type OrganizationRoleType = (typeof OrganizationRoleTypes)[keyof typeof OrganizationRoleTypes];

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

export interface OrganizationRolesQuery {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateRoleDto {
  name: string;
  permission_keys: string[];
}

export interface UpdateRoleDto {
  name?: string;
}

export interface SetRolePermissionsDto {
  permission_keys: string[];
}

export interface DeleteRoleDto {
  organization_uuid: string;
  organization_role_uuid: string;
}
