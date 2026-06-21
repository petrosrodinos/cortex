import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface AiTypingIndicatorProps {
  className?: string;
}

export const AiTypingIndicator: FC<AiTypingIndicatorProps> = ({ className }) => (
  <div
    className={cn('flex h-4 items-center gap-1', className)}
    role="status"
    aria-label="Assistant is typing"
  >
    <span className="typing-dot size-[7px] rounded-full bg-muted" style={{ animationDelay: '0ms' }} />
    <span className="typing-dot size-[7px] rounded-full bg-muted" style={{ animationDelay: '180ms' }} />
    <span className="typing-dot size-[7px] rounded-full bg-muted" style={{ animationDelay: '360ms' }} />
  </div>
);
