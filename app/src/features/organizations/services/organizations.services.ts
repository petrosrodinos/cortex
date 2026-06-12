import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  CreateOrganizationDto,
  Organization,
  OrganizationsQuery,
  SwitchOrganizationResponse,
  UpdateOrganizationDto,
} from '../interfaces/organization.interfaces';

export const getOrganizations = async (query?: OrganizationsQuery): Promise<Organization[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.root, { params: query });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load organizations. Please try again.');
  }
};

export const createOrganization = async (payload: CreateOrganizationDto): Promise<Organization> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.root, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create organization. Please try again.');
  }
};

export const updateOrganization = async (organization_uuid: string, payload: UpdateOrganizationDto): Promise<Organization> => {
  try {
    const response = await axiosInstance.patch(ApiRoutes.organizations.by_uuid(organization_uuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update organization. Please try again.');
  }
};

export const deleteOrganization = async (organization_uuid: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.organizations.by_uuid(organization_uuid));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to delete organization. Please try again.');
  }
};

export const switchOrganization = async (organization_uuid: string): Promise<SwitchOrganizationResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.auth.switchOrganization, { organization_uuid: organization_uuid });
    return {
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
      organization_uuid: response.data.organization_uuid,
      organization_role: response.data.organization_role,
      organization_permissions: response.data.organization_permissions,
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to switch organization. Please try again.');
  }
};
