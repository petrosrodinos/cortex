import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type { TestResendConnectionDto, TestResendConnectionResponse } from '../interfaces/resend.interface';

export const testResendDraftConnection = async (
  organizationUuid: string,
  payload: TestResendConnectionDto,
): Promise<TestResendConnectionResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.resendIntegrationTest(organizationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to test Resend connection. Please try again.');
  }
};
