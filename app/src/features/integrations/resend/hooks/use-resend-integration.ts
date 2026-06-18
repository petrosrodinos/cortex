import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { TestResendConnectionDto } from '../interfaces/resend.interface';
import { testResendDraftConnection } from '../services/resend.service';

export function useTestResendConnection(organizationUuid?: string) {
  return useMutation({
    mutationFn: (payload: TestResendConnectionDto) => testResendDraftConnection(organizationUuid as string, payload),
    onError: (error: Error) => {
      toast({ title: 'Resend test failed', description: error.message, variant: 'error', duration: 3500 });
    },
  });
}
