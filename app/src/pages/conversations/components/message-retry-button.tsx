import type { FC } from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageRetryButtonProps {
  disabled?: boolean;
  onRetry: () => void;
  className?: string;
}

export const MessageRetryButton: FC<MessageRetryButtonProps> = ({ disabled, onRetry, className }) => (
  <button
    type="button"
    onClick={onRetry}
    disabled={disabled}
    aria-label="Retry message"
    className={cn(
      'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted/80 transition-colors hover:bg-foreground/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-40',
      className,
    )}
  >
    <RotateCcw className="h-3.5 w-3.5" />
  </button>
);
