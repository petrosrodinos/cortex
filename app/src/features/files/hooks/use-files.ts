import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { getDocuments, uploadDocument } from '../services/files.service';

export const documentsQueryKey = ['documents'] as const;

export function useGetDocuments(orgUuid?: string) {
  return useQuery({
    queryKey: [...documentsQueryKey, orgUuid],
    queryFn: () => getDocuments(orgUuid as string),
    enabled: !!orgUuid,
  });
}

export function useUploadDocument(orgUuid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadDocument(orgUuid as string, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...documentsQueryKey, orgUuid] });
      toast({ title: 'File uploaded', duration: 2000 });
    },
    onError: (error: Error) => {
      toast({ title: 'Could not upload file', description: error.message, variant: 'error' });
    },
  });
}
