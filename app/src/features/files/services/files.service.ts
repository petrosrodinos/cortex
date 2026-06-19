import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';

export interface Document {
  uuid: string;
  org_uuid: string;
  filename: string;
  content_type: string;
  size: number;
  url?: string;
  created_at: string;
}

export const uploadDocument = async (orgUuid: string, file: File): Promise<Document> => {
  try {
    const fd = new FormData();
    fd.append('file', file);
    const response = await axiosInstance.post(ApiRoutes.documents(orgUuid), fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to upload document.');
  }
};

export const getDocuments = async (orgUuid: string): Promise<Document[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.documents(orgUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load documents.');
  }
};

export const getWidgetContent = async (orgUuid: string, documentUuid: string): Promise<string> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.documentWidgetContent(orgUuid, documentUuid), {
      responseType: 'text',
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load widget.');
  }
};
