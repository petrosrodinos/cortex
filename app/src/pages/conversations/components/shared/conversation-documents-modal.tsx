import { useEffect, useRef, useState, type FC } from 'react';
import { Download, Eye, File, FileText, Image, MoreHorizontal, Share2, X } from 'lucide-react';
import { Button, Dropdown, Label } from '@heroui/react';
import type { MessageAttachment } from '@/features/conversations/interfaces/conversation.interfaces';
import { useGetConversationDocuments } from '@/features/conversations/hooks/use-conversations';
import type { ConversationDocument } from '@/features/conversations/services/conversations.service';
import {
  useAddDocumentToBoardById,
  useGetDocumentBoards,
} from '@/features/document-boards/hooks/use-document-boards';
import type { DocumentBoard } from '@/features/document-boards/interfaces/document-board.interfaces';
import { formatDateTime } from '@/lib/date';
import { ConversationDocumentsSkeleton } from './conversation-documents-skeleton';

interface ConversationDocumentsModalProps {
  open: boolean;
  orgUuid: string;
  conversationUuid: string;
  pendingAttachments?: MessageAttachment[];
  onOpenChange: (open: boolean) => void;
}

function DocumentIcon({ mimetype, filename }: { mimetype: string | null; filename: string }) {
  if (mimetype?.startsWith('image/') || filename.match(/\.(png|jpe?g|gif|webp|svg)$/i)) {
    return <Image className="h-4 w-4 shrink-0 text-muted" />;
  }
  if (filename.match(/\.(pdf)$/i)) return <FileText className="h-4 w-4 shrink-0 text-muted" />;
  return <File className="h-4 w-4 shrink-0 text-muted" />;
}

function downloadFile(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener noreferrer';
  a.click();
}

function BoardPicker({
  documentUuid,
  boards,
  orgUuid,
  onClose,
}: {
  documentUuid: string;
  boards: DocumentBoard[];
  orgUuid: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const addToBoard = useAddDocumentToBoardById(orgUuid);
  const [title, setTitle] = useState('');
  const [pendingBoard, setPendingBoard] = useState<DocumentBoard | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleAdd = () => {
    if (!pendingBoard) return;
    addToBoard.mutate(
      { boardUuid: pendingBoard.uuid, documentUuid, title: title.trim() || undefined },
      { onSettled: onClose },
    );
  };

  if (pendingBoard) {
    return (
      <div
        ref={ref}
        className="absolute right-0 top-full z-[120] mt-1 w-64 overflow-hidden rounded-xl border border-border bg-surface p-3 shadow-lg"
      >
        <p className="mb-2 text-xs font-medium text-foreground">
          Add to &quot;{pendingBoard.name}&quot;
        </p>
        <input
          autoFocus
          type="text"
          placeholder="Title (optional)"
          value={title}
          maxLength={255}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
            if (e.key === 'Escape') setPendingBoard(null);
          }}
          className="w-full rounded-md border border-border bg-surface-secondary px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setPendingBoard(null)}
            className="flex-1 rounded-md border border-border px-2 py-1.5 text-xs text-muted hover:bg-surface-secondary"
          >
            Back
          </button>
          <button
            type="button"
            disabled={addToBoard.isPending}
            onClick={handleAdd}
            className="flex-1 rounded-md bg-accent px-2 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
          >
            {addToBoard.isPending ? 'Adding…' : 'Add'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-[120] mt-1 min-w-[200px] overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-lg"
    >
      {boards.length === 0 ? (
        <p className="px-2 py-2 text-sm text-muted">No boards yet</p>
      ) : (
        boards.map((board) => (
          <button
            key={board.uuid}
            type="button"
            className="flex w-full items-center rounded-lg px-2 py-2 text-sm text-foreground hover:bg-surface-secondary"
            onClick={() => setPendingBoard(board)}
          >
            {board.name}
          </button>
        ))
      )}
    </div>
  );
}

function ActionsDropdown({
  doc,
  boards,
  orgUuid,
}: {
  doc: ConversationDocument;
  boards: DocumentBoard[];
  orgUuid: string;
}) {
  const [boardPickerOpen, setBoardPickerOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <Dropdown>
        <Button
          aria-label="Document actions"
          variant="secondary"
          className="inline-flex h-7 w-7 min-w-7 items-center justify-center rounded border-0 bg-transparent p-0 text-muted shadow-none hover:bg-surface-secondary hover:text-foreground data-[hover=true]:bg-surface-secondary data-[hover=true]:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        <Dropdown.Popover
          placement="bottom end"
          offset={4}
          className="z-[110] min-w-[180px] overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-lg"
        >
          <Dropdown.Menu
            onAction={(key) => {
              const k = String(key);
              if (k === 'view') window.open(doc.url, '_blank', 'noopener,noreferrer');
              if (k === 'download') downloadFile(doc.url, doc.filename);
              if (k === '__share__') setBoardPickerOpen(true);
            }}
          >
            <Dropdown.Item id="view" textValue="View" className="gap-2.5 rounded-lg px-2 py-2">
              <Eye className="h-4 w-4 shrink-0 text-muted" />
              <Label className="text-sm">View</Label>
            </Dropdown.Item>
            <Dropdown.Item id="download" textValue="Download" className="gap-2.5 rounded-lg px-2 py-2">
              <Download className="h-4 w-4 shrink-0 text-muted" />
              <Label className="text-sm">Download</Label>
            </Dropdown.Item>
            {doc.uuid ? (
              <Dropdown.Item id="__share__" textValue="Share to Board" className="gap-2.5 rounded-lg px-2 py-2">
                <Share2 className="h-4 w-4 shrink-0 text-muted" />
                <Label className="text-sm">Share to Board</Label>
              </Dropdown.Item>
            ) : null}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      {boardPickerOpen && doc.uuid ? (
        <BoardPicker
          documentUuid={doc.uuid}
          boards={boards}
          orgUuid={orgUuid}
          onClose={() => setBoardPickerOpen(false)}
        />
      ) : null}
    </div>
  );
}

function DocumentItem({
  doc,
  boards,
  orgUuid,
}: {
  doc: ConversationDocument;
  boards: DocumentBoard[];
  orgUuid: string;
}) {
  const isImage =
    doc.mimetype?.startsWith('image/') ||
    doc.filename.match(/\.(png|jpe?g|gif|webp|svg)$/i);

  return (
    <li className="rounded-lg border border-border bg-surface-secondary/40 p-3">
      <div className="flex items-start gap-3">
        <DocumentIcon mimetype={doc.mimetype} filename={doc.filename} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground break-all">{doc.filename}</p>
          <p className="mt-0.5 text-xs text-muted">{formatDateTime(doc.created_at)}</p>
        </div>
        <ActionsDropdown doc={doc} boards={boards} orgUuid={orgUuid} />
      </div>

      {isImage && (
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block overflow-hidden rounded-lg border border-border"
        >
          <img src={doc.url} alt={doc.filename} className="max-h-40 w-full object-contain" />
        </a>
      )}
    </li>
  );
}

export const ConversationDocumentsModal: FC<ConversationDocumentsModalProps> = ({
  open,
  orgUuid,
  conversationUuid,
  pendingAttachments = [],
  onOpenChange,
}) => {
  const { data: documents = [], isLoading } = useGetConversationDocuments(
    open ? orgUuid : undefined,
    open ? conversationUuid : undefined,
  );
  const { data: boards = [] } = useGetDocumentBoards(open ? orgUuid : undefined);

  if (!open) return null;

  const pendingItems = pendingAttachments.filter((a) => a.filename);

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
            <p className="mt-0.5 text-xs text-muted">Files shared or generated in this conversation.</p>
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
          {isLoading ? (
            <ConversationDocumentsSkeleton />
          ) : documents.length === 0 && pendingItems.length === 0 ? (
            <p className="text-sm text-muted">No files in this conversation yet.</p>
          ) : (
            <ul className="space-y-2">
              {documents.map((doc, i) => (
                <DocumentItem
                  key={doc.uuid ?? `url-${i}`}
                  doc={doc}
                  boards={boards}
                  orgUuid={orgUuid}
                />
              ))}
              {pendingItems.map((att) => (
                <li key={att.uuid} className="rounded-lg border border-border bg-surface-secondary/40 p-3 opacity-60">
                  <div className="flex items-start gap-3">
                    <File className="h-4 w-4 shrink-0 text-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground break-all">{att.filename}</p>
                      <p className="mt-0.5 text-xs text-muted">Uploading…</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};
