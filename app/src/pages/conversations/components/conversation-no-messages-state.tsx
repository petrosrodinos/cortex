import type { FC } from 'react';
import { Sparkles } from 'lucide-react';

export const ConversationNoMessagesState: FC = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-muted">
      <Sparkles className="h-7 w-7" />
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">Start the conversation</p>
      <p className="mt-1 text-sm text-muted">Send a message to begin chatting with Cortex.</p>
    </div>
  </div>
);
