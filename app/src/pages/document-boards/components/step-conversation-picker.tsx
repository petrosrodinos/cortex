import { MessageSquare } from 'lucide-react';
import { Skeleton } from '@heroui/react';
import type { Conversation } from '@/features/conversations/interfaces/conversation.interfaces';
import { useGetConversations } from '@/features/conversations/hooks/use-conversations';
import { formatDateTime } from '@/lib/date';

type StepConversationPickerProps = {
  orgUuid: string;
  onSelect: (conversation: Conversation) => void;
};

export function StepConversationPicker({ orgUuid, onSelect }: StepConversationPickerProps) {
  const { data: conversations = [], isLoading } = useGetConversations(orgUuid);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
        <p className="text-sm font-medium text-foreground">No conversations</p>
        <p className="mt-1 text-sm text-muted">Start a conversation first to attach documents.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-1.5">
      {conversations.map((conversation) => (
        <li key={conversation.uuid}>
          <button
            type="button"
            onClick={() => onSelect(conversation)}
            className="flex w-full items-start gap-3 rounded-lg border border-border bg-surface-secondary/40 p-3 text-left hover:bg-surface-secondary"
          >
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {conversation.title ?? 'Untitled conversation'}
              </p>
              <p className="mt-0.5 text-xs text-muted">{formatDateTime(conversation.created_at)}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
