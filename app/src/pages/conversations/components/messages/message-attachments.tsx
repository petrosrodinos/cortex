import type { FC } from 'react';
import { File } from 'lucide-react';
import type { MessageAttachment } from '@/features/conversations/interfaces/conversation.interfaces';
import { cn } from '@/lib/utils';
import { ExpandableImage } from './expandable-image';

interface MessageAttachmentsProps {
  attachments: MessageAttachment[];
  className?: string;
}

export const MessageAttachments: FC<MessageAttachmentsProps> = ({ attachments, className }) => {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className={cn('mt-2 flex flex-col gap-2', className)}>
      {attachments.map((attachment) => {
        const isImage = attachment.mimetype?.startsWith('image/');

        if (isImage && attachment.url) {
          return (
            <ExpandableImage
              key={attachment.uuid}
              src={attachment.url}
              alt={attachment.filename}
            />
          );
        }

        if (attachment.url) {
          return (
            <a
              key={attachment.uuid}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-accent hover:underline"
            >
              <File className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{attachment.filename}</span>
            </a>
          );
        }

        return (
          <div
            key={attachment.uuid}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground"
          >
            <File className="h-3.5 w-3.5 shrink-0 text-muted" />
            <span className="truncate">{attachment.filename}</span>
          </div>
        );
      })}
    </div>
  );
};

export const getMessageAttachments = (metadata?: Record<string, unknown> | null): MessageAttachment[] => {
  if (!metadata || !Array.isArray(metadata.attachments)) {
    return [];
  }

  return metadata.attachments.filter(
    (attachment): attachment is MessageAttachment =>
      typeof attachment === 'object' &&
      attachment != null &&
      typeof (attachment as MessageAttachment).uuid === 'string' &&
      typeof (attachment as MessageAttachment).filename === 'string',
  );
};
