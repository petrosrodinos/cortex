import type { FC, Key } from 'react';
import { Button, Dropdown, Label } from '@heroui/react';
import { Copy, CornerDownRight, MoreHorizontal, RotateCcw, Trash2 } from 'lucide-react';
import type { Message } from '@/features/conversations/interfaces/conversation.interfaces';
import { MessageRoles } from '@/features/conversations/interfaces/conversation.interfaces';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MessageActionsMenuProps {
  message: Message;
  canDelete?: boolean;
  canRetry?: boolean;
  showReply?: boolean;
  isDeleting?: boolean;
  onReply: (message: Message) => void;
  onRetry?: (message: Message) => void;
  onDelete?: (message: Message) => void;
  className?: string;
}

export const MessageActionsMenu: FC<MessageActionsMenuProps> = ({
  message,
  canDelete = false,
  canRetry = false,
  showReply = true,
  isDeleting = false,
  onReply,
  onRetry,
  onDelete,
  className,
}) => {
  const handleAction = async (key: Key) => {
    if (key === 'copy') {
      if (!message.content) {
        return;
      }

      try {
        await navigator.clipboard.writeText(message.content);
        toast({ title: 'Copied to clipboard', duration: 1500 });
      } catch {
        toast({ title: 'Could not copy message', variant: 'error', duration: 2000 });
      }
      return;
    }

    if (key === 'reply') {
      onReply(message);
      return;
    }

    if (key === 'retry') {
      onRetry?.(message);
      return;
    }

    if (key === 'delete') {
      onDelete?.(message);
    }
  };

  return (
    <Dropdown>
      <Button
        aria-label="Message actions"
        variant="secondary"
        isDisabled={isDeleting}
        className={cn(
          'inline-flex h-6 w-6 min-w-6 shrink-0 rounded-md border-0 bg-transparent p-0 text-muted/80 shadow-none',
          'hover:bg-foreground/10 hover:text-foreground data-[hover=true]:bg-foreground/10 data-[hover=true]:text-foreground',
          className,
        )}
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </Button>
      <Dropdown.Popover
        placement="bottom end"
        offset={4}
        className="z-50 min-w-[180px] overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-lg"
      >
        <Dropdown.Menu onAction={(key) => void handleAction(key)}>
          <Dropdown.Item id="copy" textValue="Copy" className="rounded-lg px-2 py-2">
            <Copy className="h-4 w-4 shrink-0 text-muted" />
            <Label className="text-sm">Copy</Label>
          </Dropdown.Item>
          {showReply ? (
            <Dropdown.Item id="reply" textValue="Reply" className="rounded-lg px-2 py-2">
              <CornerDownRight className="h-4 w-4 shrink-0 text-muted" />
              <Label className="text-sm">Reply</Label>
            </Dropdown.Item>
          ) : null}
          {message.role === MessageRoles.USER && canRetry && onRetry ? (
            <Dropdown.Item id="retry" textValue="Retry" className="rounded-lg px-2 py-2">
              <RotateCcw className="h-4 w-4 shrink-0 text-muted" />
              <Label className="text-sm">Retry</Label>
            </Dropdown.Item>
          ) : null}
          {canDelete && onDelete ? (
            <Dropdown.Item id="delete" textValue="Delete" className="rounded-lg px-2 py-2 text-red-400">
              <Trash2 className="h-4 w-4 shrink-0" />
              <Label className="text-sm">Delete</Label>
            </Dropdown.Item>
          ) : null}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
