import axiosInstance from '@/config/api/axios';
import { ApiRoutes } from '@/config/api/routes';
import type {
  CreateDocumentBoardPayload,
  DocumentBoard,
  DocumentBoardDetail,
  DocumentBoardItem,
  UpdateDocumentBoardPayload,
} from '../interfaces/document-board.interfaces';

export const getDocumentBoards = async (orgUuid: string): Promise<DocumentBoard[]> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.documentBoards(orgUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load document boards.');
  }
};

export const getDocumentBoard = async (orgUuid: string, boardUuid: string): Promise<DocumentBoardDetail> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.documentBoard(orgUuid, boardUuid));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to load document board.');
  }
};

export const createDocumentBoard = async (
  orgUuid: string,
  payload: CreateDocumentBoardPayload,
): Promise<DocumentBoard> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.documentBoards(orgUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to create document board.');
  }
};

export const updateDocumentBoard = async (
  orgUuid: string,
  boardUuid: string,
  payload: UpdateDocumentBoardPayload,
): Promise<DocumentBoard> => {
  try {
    const response = await axiosInstance.patch(ApiRoutes.documentBoard(orgUuid, boardUuid), payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to update document board.');
  }
};

export const deleteDocumentBoard = async (orgUuid: string, boardUuid: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.documentBoard(orgUuid, boardUuid));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to delete document board.');
  }
};

export const addDocumentToBoard = async (
  orgUuid: string,
  boardUuid: string,
  documentUuid: string,
  title?: string,
): Promise<DocumentBoardItem> => {
  try {
    const response = await axiosInstance.post(ApiRoutes.documentBoardItems(orgUuid, boardUuid), {
      document_uuid: documentUuid,
      ...(title ? { title } : {}),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to add document to board.');
  }
};

export const removeDocumentFromBoard = async (
  orgUuid: string,
  boardUuid: string,
  itemUuid: string,
): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.documentBoardItem(orgUuid, boardUuid, itemUuid));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Failed to remove document from board.');
  }
};
