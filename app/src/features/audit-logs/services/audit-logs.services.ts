import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type { AuditLogsResponse } from '../interfaces/audit-logs.interfaces';

export const getAuditLogs = async (orgUuid: string, page = 1, limit = 20): Promise<AuditLogsResponse> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.auditLogs(orgUuid), { params: { page, limit } });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load audit logs.');
  }
};
