import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type { LoggedInUser } from '@/features/user/interfaces/user.interface';
import type { Organization, OrganizationMember, OrganizationRole, Permission } from '@/interfaces/organization/organization.interface';

export const organizations_service = {
  async list_organizations(): Promise<Organization[]> {
    const response = await axiosInstance.get(ApiRoutes.organizations.root);
    return response.data;
  },

  async create_organization(payload: { name: string; logo_url?: string }): Promise<Organization> {
    const response = await axiosInstance.post(ApiRoutes.organizations.root, payload);
    return response.data;
  },

  async switch_organization(organization_uuid: string): Promise<Partial<LoggedInUser>> {
    const response = await axiosInstance.post(ApiRoutes.auth.switch_organization, { organization_uuid: organization_uuid });
    return {
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
      organization_uuid: response.data.organization_uuid,
      organization_role: response.data.organization_role,
      organization_permissions: response.data.organization_permissions,
    };
  },

  async list_members(organization_uuid: string): Promise<OrganizationMember[]> {
    const response = await axiosInstance.get(ApiRoutes.organizations.members(organization_uuid));
    return response.data;
  },

  async invite_member(organization_uuid: string, payload: { email: string; organization_role_uuid: string }): Promise<OrganizationMember> {
    const response = await axiosInstance.post(ApiRoutes.organizations.members(organization_uuid), payload);
    return response.data;
  },

  async update_member(
    organization_uuid: string,
    organization_member_uuid: string,
    payload: { organization_role_uuid?: string; status?: OrganizationMember['status'] },
  ): Promise<OrganizationMember> {
    const response = await axiosInstance.patch(ApiRoutes.organizations.member(organization_uuid, organization_member_uuid), payload);
    return response.data;
  },

  async remove_member(organization_uuid: string, organization_member_uuid: string): Promise<void> {
    await axiosInstance.delete(ApiRoutes.organizations.member(organization_uuid, organization_member_uuid));
  },

  async list_permissions(): Promise<Permission[]> {
    const response = await axiosInstance.get(ApiRoutes.permissions.root);
    return response.data;
  },

  async list_roles(organization_uuid: string): Promise<OrganizationRole[]> {
    const response = await axiosInstance.get(ApiRoutes.organizations.roles(organization_uuid));
    return response.data;
  },

  async create_role(organization_uuid: string, payload: { name: string; permission_keys: string[] }): Promise<OrganizationRole> {
    const response = await axiosInstance.post(ApiRoutes.organizations.roles(organization_uuid), payload);
    return response.data;
  },

  async set_role_permissions(organization_uuid: string, organization_role_uuid: string, permission_keys: string[]): Promise<OrganizationRole> {
    const response = await axiosInstance.put(ApiRoutes.organizations.rolePermissions(organization_uuid, organization_role_uuid), { permission_keys: permission_keys });
    return response.data;
  },

  async delete_role(organization_uuid: string, organization_role_uuid: string): Promise<void> {
    await axiosInstance.delete(ApiRoutes.organizations.role(organization_uuid, organization_role_uuid));
  },
};
