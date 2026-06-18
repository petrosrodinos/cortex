import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type { UpdatePasswordDto, UpdateUserDto, User } from '../interfaces/user.interface';

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.users.me);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load user profile. Please try again.');
  }
};

export const updateCurrentUser = async (payload: UpdateUserDto): Promise<User> => {
  try {
    const response = await axiosInstance.patch(ApiRoutes.users.me, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update user profile. Please try again.');
  }
};

export const updateCurrentUserPassword = async (payload: UpdatePasswordDto): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.patch(ApiRoutes.users.password, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update password. Please try again.');
  }
};
