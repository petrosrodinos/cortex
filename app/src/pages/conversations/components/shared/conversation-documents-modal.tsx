import type { FC } from 'react';
import { File, FileText, Image, X } from 'lucide-react';
import type { Message, MessageAttachment } from '@/features/conversations/interfaces/conversation.interfaces';
import { getConversationDocuments } from '../../utils/conversation-documents';

interface ConversationDocumentsModalProps {
  open: boolean;
  messages: Message[];
  pendingAttachments?: MessageAttachment[];
  onOpenChange: (open: boolean) => void;
}

function DocumentIcon({ mimetype, filename }: { mimetype?: string; filename: string }) {
  if (mimetype?.startsWith('image/')) {
    return <Image className="h-4 w-4 shrink-0 text-muted" />;
  }

  if (filename.match(/\.(pdf)$/i)) {
    return <FileText className="h-4 w-4 shrink-0 text-muted" />;
  }

  return <File className="h-4 w-4 shrink-0 text-muted" />;
}

export const ConversationDocumentsModal: FC<ConversationDocumentsModalProps> = ({
  open,
  messages,
  pendingAttachments = [],
  onOpenChange,
}) => {
  if (!open) {
    return null;
  }

  const documents = getConversationDocuments(messages, pendingAttachments);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close documents"
        className="absolute inset-0 bg-[color-mix(in_oklch,black_42%,transparent)]"
        onClick={() => onOpenChange(false)}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="conversation-documents-title"
        className="relative flex max-h-[min(80dvh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-xl"
        style={{ boxShadow: '0 24px 60px -20px color-mix(in oklch, black 55%, transparent)' }}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h2 id="conversation-documents-title" className="text-sm font-semibold text-foreground">
              Documents
            </h2>
            <p className="mt-0.5 text-xs text-muted">Files you attached in this conversation.</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {documents.length === 0 ? (
            <p className="text-sm text-muted">No documents in this conversation yet.</p>
          ) : (
            <ul className="space-y-2">
              {documents.map((document) => {
                const isImage = document.mimetype?.startsWith('image/') || document.filename.match(/\.(png|jpe?g|gif|webp|svg)$/i);

                return (
                  <li
                    key={document.id}
                    className="rounded-lg border border-border bg-surface-secondary/40 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <DocumentIcon mimetype={document.mimetype} filename={document.filename} />
                      <div className="min-w-0 flex-1">
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate text-sm font-medium text-accent hover:underline"
                        >
                          {document.filename}
                        </a>
                      </div>
                    </div>

                    {isImage && (
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block overflow-hidden rounded-lg border border-border"
                      >
                        <img
                          src={document.url}
                          alt={document.filename}
                          className="max-h-40 w-full object-contain"
                        />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};
