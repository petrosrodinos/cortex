import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  InviteMemberDto,
  MemberInvitationUrlResponse,
  OrganizationMember,
  OrganizationMembersQuery,
  UpdateMemberDto,
} from '../interfaces/member.interfaces';

export const getMembers = async (organization_uuid: string, query?: OrganizationMembersQuery): Promise<OrganizationMember[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.organizations.members(organization_uuid), { params: query });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load members. Please try again.');
  }
};

export const inviteMember = async (organization_uuid: string, payload: InviteMemberDto): Promise<OrganizationMember> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.members(organization_uuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to invite member. Please try again.');
  }
};

export const updateMember = async (
  organization_uuid: string,
  organization_member_uuid: string,
  payload: UpdateMemberDto,
): Promise<OrganizationMember> => {
  try {
    const response = await axiosInstance.patch(ApiRoutes.organizations.member(organization_uuid, organization_member_uuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update member. Please try again.');
  }
};

export const deleteMember = async (organization_uuid: string, organization_member_uuid: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.organizations.member(organization_uuid, organization_member_uuid));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to remove member. Please try again.');
  }
};

export const resendMemberInvitation = async (
  organization_uuid: string,
  organization_member_uuid: string,
): Promise<OrganizationMember> => {
  try {
    const response = await axiosInstance.post(
      ApiRoutes.organizations.resendMemberInvitation(organization_uuid, organization_member_uuid),
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to resend invitation. Please try again.');
  }
};

export const getMemberInvitationUrl = async (
  organization_uuid: string,
  organization_member_uuid: string,
): Promise<MemberInvitationUrlResponse> => {
  try {
    const response = await axiosInstance.get(
      ApiRoutes.organizations.memberInvitationUrl(organization_uuid, organization_member_uuid),
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to get invitation link. Please try again.');
  }
};
