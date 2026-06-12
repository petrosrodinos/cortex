import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type { Permission, PermissionsQuery } from '../interfaces/permission.interfaces';

export const getPermissions = async (query?: PermissionsQuery): Promise<Permission[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.permissions.root, { params: query });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load permissions. Please try again.');
  }
};
