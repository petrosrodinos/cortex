import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type { TestSmtpConnectionDto, TestSmtpConnectionResponse } from '../interfaces/smtp.interface';

export const testSmtpDraftConnection = async (
  organizationUuid: string,
  payload: TestSmtpConnectionDto,
): Promise<TestSmtpConnectionResponse> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.organizations.smtpIntegrationTest(organizationUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to test SMTP connection. Please try again.');
  }
};
