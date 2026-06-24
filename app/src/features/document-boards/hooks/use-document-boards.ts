import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { CreateDocumentBoardPayload, UpdateDocumentBoardPayload } from '../interfaces/document-board.interfaces';
import {
  addDocumentToBoard,
  createDocumentBoard,
  deleteDocumentBoard,
  getDocumentBoard,
  getDocumentBoards,
  removeDocumentFromBoard,
  updateDocumentBoard,
} from '../services/document-boards.service';

export const documentBoardsQueryKey = ['document-boards'] as const;

export function useGetDocumentBoards(orgUuid?: string) {
  return useQuery({
    queryKey: [...documentBoardsQueryKey, orgUuid],
    queryFn: () => getDocumentBoards(orgUuid as string),
    enabled: !!orgUuid,
  });
}

export function useGetDocumentBoard(orgUuid?: string, boardUuid?: string) {
  return useQuery({
    queryKey: [...documentBoardsQueryKey, orgUuid, boardUuid],
    queryFn: () => getDocumentBoard(orgUuid as string, boardUuid as string),
    enabled: !!orgUuid && !!boardUuid,
  });
}

export function useCreateDocumentBoard(orgUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDocumentBoardPayload) =>
      createDocumentBoard(orgUuid as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...documentBoardsQueryKey, orgUuid] });
      toast({ title: 'Board created', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not create board', description: error.message, variant: 'error' });
    },
  });
}

export function useUpdateDocumentBoard(orgUuid?: string, boardUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDocumentBoardPayload) =>
      updateDocumentBoard(orgUuid as string, boardUuid as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...documentBoardsQueryKey, orgUuid] });
      queryClient.invalidateQueries({ queryKey: [...documentBoardsQueryKey, orgUuid, boardUuid] });
      toast({ title: 'Board updated', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not update board', description: error.message, variant: 'error' });
    },
  });
}

export function useDeleteDocumentBoard(orgUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boardUuid: string) => deleteDocumentBoard(orgUuid as string, boardUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...documentBoardsQueryKey, orgUuid] });
      toast({ title: 'Board deleted', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not delete board', description: error.message, variant: 'error' });
    },
  });
}

export function useAddDocumentToBoard(orgUuid?: string, boardUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentUuid, title }: { documentUuid: string; title?: string }) =>
      addDocumentToBoard(orgUuid as string, boardUuid as string, documentUuid, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...documentBoardsQueryKey, orgUuid, boardUuid] });
      toast({ title: 'Document added to board', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not add document', description: error.message, variant: 'error' });
    },
  });
}

export function useAddDocumentToBoardById(orgUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardUuid, documentUuid, title }: { boardUuid: string; documentUuid: string; title?: string }) =>
      addDocumentToBoard(orgUuid as string, boardUuid, documentUuid, title),
    onSuccess: (_data, { boardUuid }) => {
      queryClient.invalidateQueries({ queryKey: [...documentBoardsQueryKey, orgUuid, boardUuid] });
      toast({ title: 'Added to board', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not add to board', description: error.message, variant: 'error' });
    },
  });
}

export function useRemoveDocumentFromBoard(orgUuid?: string, boardUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemUuid: string) =>
      removeDocumentFromBoard(orgUuid as string, boardUuid as string, itemUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...documentBoardsQueryKey, orgUuid, boardUuid] });
      toast({ title: 'Document removed', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not remove document', description: error.message, variant: 'error' });
    },
  });
}
