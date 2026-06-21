import type { FC } from 'react';
import { Paperclip, X } from 'lucide-react';
import { MessageRoles } from '@/features/conversations/interfaces/conversation.interfaces';
import { cn } from '@/lib/utils';
import type { ConversationReplyTarget } from '../../utils/conversation-reply.utils';

interface ConversationReplyPreviewProps {
  reply: ConversationReplyTarget;
  onDismiss: () => void;
  embedded?: boolean;
}

export const ConversationReplyPreview: FC<ConversationReplyPreviewProps> = ({
  reply,
  onDismiss,
  embedded = false,
}) => {
  const previewText = reply.quotedText.trim() || 'Attachment';

  return (
    <div
      className={cn(
        'min-w-0 bg-surface px-2.5 py-2 sm:px-3 sm:py-2.5',
        embedded ? 'border-b border-border' : 'mb-2 rounded-xl border border-border bg-surface-secondary',
      )}
    >
      <div className="flex min-w-0 items-start gap-2 sm:gap-2.5">
        <div
          className={cn(
            'mt-0.5 w-1 shrink-0 self-stretch rounded-full',
            reply.role === MessageRoles.USER ? 'bg-foreground/35' : 'bg-indigo-500',
          )}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-muted sm:text-xs">
            Replying to {reply.authorLabel}
          </p>
          <p className="mt-0.5 line-clamp-2 break-words text-sm text-foreground/85 sm:line-clamp-3">
            {previewText}
          </p>
          {reply.attachmentCount > 0 ? (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted sm:text-xs">
              <Paperclip className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {reply.attachmentCount === 1
                  ? '1 attachment'
                  : `${reply.attachmentCount} attachments`}
              </span>
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-foreground/10 hover:text-foreground sm:h-8 sm:w-8"
          aria-label="Cancel reply"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
