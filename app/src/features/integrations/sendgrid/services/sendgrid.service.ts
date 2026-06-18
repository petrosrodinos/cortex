import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type { TestSendGridConnectionDto, TestSendGridConnectionResponse } from '../interfaces/sendgrid.interface';

export const testSendGridDraftConnection = async (
  organizationUuid: string,
  payload: TestSendGridConnectionDto,
): Promise<TestSendGridConnectionResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.sendgridIntegrationTest(organizationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to test SendGrid connection. Please try again.');
  }
};
