import { useMemo, useState, type FC } from 'react';
import { Check, Loader2 } from 'lucide-react';
import type { ExecutionUserChoiceRequest } from '@/features/conversations/interfaces/conversation.interfaces';
import { cn } from '@/lib/utils';

interface ExecutionUserChoiceCardProps {
  request: ExecutionUserChoiceRequest;
  className?: string;
  isSubmitting: boolean;
  isCancelling: boolean;
  onSubmit: (selectedIds: string[]) => void;
  onCancel: () => void;
}

export const ExecutionUserChoiceCard: FC<ExecutionUserChoiceCardProps> = ({
  request,
  className,
  isSubmitting,
  isCancelling,
  onSubmit,
  onCancel,
}) => {
  const isSingle = request.selection_mode === 'single';
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isBusy = isSubmitting || isCancelling;

  const isValid = useMemo(() => {
    if (isSingle) {
      return selectedIds.length === 1;
    }

    return selectedIds.length >= 1;
  }, [isSingle, selectedIds.length]);

  const toggleOption = (optionId: string) => {
    if (isSingle) {
      setSelectedIds([optionId]);
      return;
    }

    setSelectedIds((current) =>
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId],
    );
  };

  return (
    <div
      className={cn(
        'mr-auto w-full max-w-xl overflow-hidden rounded-2xl border border-accent/30 bg-accent/5 shadow-sm',
        className,
      )}
    >
      <div className="border-b border-accent/20 px-4 py-3 sm:px-5">
        <p className="text-sm font-medium text-foreground">{request.prompt}</p>
        {request.description ? (
          <p className="mt-1 text-sm leading-relaxed text-muted">{request.description}</p>
        ) : null}
        <p className="mt-2 text-xs text-muted">
          {isSingle ? 'Select one option' : 'Select one or more options'}
        </p>
      </div>

      <div className="space-y-2 px-4 py-4 sm:px-5">
        {request.options.map((option) => {
          const isSelected = selectedIds.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              disabled={isBusy}
              onClick={() => toggleOption(option.id)}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors',
                isSelected
                  ? 'border-accent bg-accent/15'
                  : 'border-accent/20 bg-surface hover:bg-accent/8',
                isBusy && 'cursor-not-allowed opacity-60',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border',
                  isSingle ? 'rounded-full' : 'rounded-sm',
                  isSelected ? 'border-accent bg-accent text-accent-foreground' : 'border-accent/40',
                )}
              >
                {isSelected ? <Check className="h-3 w-3" /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">{option.label}</span>
                {option.description ? (
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {option.description}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-accent/20 bg-accent/8 px-4 py-3 sm:px-5">
        <button
          type="button"
          disabled={isBusy || !isValid}
          onClick={() => onSubmit(selectedIds)}
          className={cn(
            'inline-flex h-9 min-w-[5.5rem] items-center justify-center gap-1.5 rounded-full px-4',
            'bg-accent text-sm font-medium text-accent-foreground',
            'transition-all duration-150 hover:opacity-90 active:scale-[0.98]',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Continue
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={onCancel}
          className={cn(
            'inline-flex h-9 min-w-[5.5rem] items-center justify-center gap-1.5 rounded-full px-4',
            'border border-accent/40 bg-surface text-sm font-medium text-foreground',
            'transition-all duration-150 hover:bg-accent/15 active:scale-[0.98]',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {isCancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Cancel
        </button>
      </div>
    </div>
  );
};
