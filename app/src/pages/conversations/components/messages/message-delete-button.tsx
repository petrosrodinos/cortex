import type { FC } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageDeleteButtonProps {
  disabled?: boolean;
  onDelete: () => void;
  className?: string;
}

export const MessageDeleteButton: FC<MessageDeleteButtonProps> = ({
  disabled = false,
  onDelete,
  className,
}) => (
  <button
    type="button"
    onClick={onDelete}
    disabled={disabled}
    aria-label="Delete message"
    className={cn(
      'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted/80 transition-colors hover:bg-foreground/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-40',
      className,
    )}
  >
    <Trash2 className="h-3.5 w-3.5" />
  </button>
);
