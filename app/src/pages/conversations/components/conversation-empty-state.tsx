import type { FC } from 'react';
import { MessageSquare } from 'lucide-react';

export const ConversationEmptyState: FC = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-muted">
      <MessageSquare className="h-7 w-7" />
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">Select a conversation</p>
      <p className="mt-1 text-sm text-muted">Choose a chat from the sidebar or start a new one.</p>
    </div>
  </div>
);
