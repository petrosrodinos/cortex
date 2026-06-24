import type { FC } from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface ConversationNoMessagesStateProps {
  isAgent?: boolean;
}

export const ConversationNoMessagesState: FC<ConversationNoMessagesStateProps> = ({ isAgent }) => {
  if (isAgent) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-3 overflow-hidden px-4 text-center sm:px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-muted">
          <Bot className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Agent hasn't run yet</p>
          <p className="mt-1 text-sm text-muted">
            Results will appear here after the first scheduled run.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-3 overflow-hidden px-4 text-center sm:px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-muted">
        <Sparkles className="h-7 w-7" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">Start the conversation</p>
        <p className="mt-1 text-sm text-muted">Send a message to begin chatting with Cortex.</p>
      </div>
    </div>
  );
};
