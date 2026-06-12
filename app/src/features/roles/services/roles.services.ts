import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type { CreateRoleDto, OrganizationRole, OrganizationRolesQuery, SetRolePermissionsDto, UpdateRoleDto } from '../interfaces/role.interfaces';

export const getRoles = async (organization_uuid: string, query?: OrganizationRolesQuery): Promise<OrganizationRole[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.roles(organization_uuid), { params: query });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load roles. Please try again.');
  }
};

export const createRole = async (organization_uuid: string, payload: CreateRoleDto): Promise<OrganizationRole> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.roles(organization_uuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create role. Please try again.');
  }
};

export const updateRole = async (organization_uuid: string, organization_role_uuid: string, payload: UpdateRoleDto): Promise<OrganizationRole> => {
  try {
    const response = await axiosInstance.patch(ApiRoutes.organizations.role(organization_uuid, organization_role_uuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update role. Please try again.');
  }
};

export const setRolePermissions = async (
  organization_uuid: string,
  organization_role_uuid: string,
  payload: SetRolePermissionsDto,
): Promise<OrganizationRole> => {
  try {
    const response = await axiosInstance.put(ApiRoutes.organizations.rolePermissions(organization_uuid, organization_role_uuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update role permissions. Please try again.');
  }
};

export const deleteRole = async (organization_uuid: string, organization_role_uuid: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.organizations.role(organization_uuid, organization_role_uuid));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to delete role. Please try again.');
  }
};
