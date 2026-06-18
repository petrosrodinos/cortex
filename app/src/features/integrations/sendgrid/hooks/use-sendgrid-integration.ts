import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { TestSendGridConnectionDto } from '../interfaces/sendgrid.interface';
import { testSendGridDraftConnection } from '../services/sendgrid.service';

export function useTestSendGridConnection(organizationUuid?: string) {
  return useMutation({
    mutationFn: (payload: TestSendGridConnectionDto) => testSendGridDraftConnection(organizationUuid as string, payload),
    onError: (error: Error) => {
      toast({ title: 'SendGrid test failed', description: error.message, variant: 'error', duration: 3500 });
    },
  });
}
