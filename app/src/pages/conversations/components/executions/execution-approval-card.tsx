import type { FC } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import type { ExecutionApprovalRequest } from '@/features/conversations/interfaces/conversation.interfaces';
import { cn } from '@/lib/utils';
import { formatExecutionApproval } from '../../utils/format-execution-approval';

interface ExecutionApprovalCardProps {
  approvalRequest: ExecutionApprovalRequest;
  className?: string;
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export const ExecutionApprovalCard: FC<ExecutionApprovalCardProps> = ({
  approvalRequest,
  className,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
}) => {
  const summary = formatExecutionApproval(approvalRequest);
  const isBusy = isApproving || isRejecting;

  return (
    <div
      className={cn(
        'mr-auto w-full max-w-xl overflow-hidden rounded-2xl border border-accent/30 bg-accent/5 shadow-sm',
        className,
      )}
    >
      <div className="border-b border-accent/20 px-4 py-3 sm:px-5">
        <p className="text-sm font-medium text-foreground">{summary.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{summary.description}</p>
      </div>

      {summary.details.length > 0 && (
        <dl className="space-y-3 px-4 py-4 sm:px-5">
          {summary.details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-accent">{detail.label}</dt>
              <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-accent/20 bg-accent/8 px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={onApprove}
          disabled={isBusy}
          className={cn(
            'inline-flex h-9 min-w-[5.5rem] items-center justify-center gap-1.5 rounded-full px-4',
            'bg-accent text-sm font-medium text-accent-foreground',
            'transition-all duration-150 hover:opacity-90 active:scale-[0.98]',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Allow
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={isBusy}
          className={cn(
            'inline-flex h-9 min-w-[5.5rem] items-center justify-center gap-1.5 rounded-full px-4',
            'border border-accent/40 bg-surface text-sm font-medium text-foreground',
            'transition-all duration-150 hover:bg-accent/15 active:scale-[0.98]',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          Deny
        </button>
      </div>
    </div>
  );
};
