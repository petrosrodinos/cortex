import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import type { TestSmtpConnectionDto } from '../interfaces/smtp.interface';
import { testSmtpDraftConnection } from '../services/smtp.service';

export function useTestSmtpConnection(organizationUuid?: string) {
  return useMutation({
    mutationFn: (payload: TestSmtpConnectionDto) => testSmtpDraftConnection(organizationUuid as string, payload),
    onError: (error: Error) => {
      toast({ title: 'SMTP test failed', description: error.message, variant: 'error', duration: 3500 });
    },
  });
}
