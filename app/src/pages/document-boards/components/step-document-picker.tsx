import { useState } from 'react';
import { File, FileText, Image } from 'lucide-react';
import { Skeleton } from '@heroui/react';
import type { Conversation } from '@/features/conversations/interfaces/conversation.interfaces';
import { useGetConversationDocuments } from '@/features/conversations/hooks/use-conversations';
import { formatDateTime } from '@/lib/date';

function DocumentIcon({ mimetype, filename }: { mimetype: string | null; filename: string }) {
  if (mimetype?.startsWith('image/') || filename.match(/\.(png|jpe?g|gif|webp|svg)$/i)) {
    return <Image className="h-4 w-4 shrink-0 text-muted" />;
  }
  if (filename.match(/\.(pdf)$/i)) return <FileText className="h-4 w-4 shrink-0 text-muted" />;
  return <File className="h-4 w-4 shrink-0 text-muted" />;
}

type StepDocumentPickerProps = {
  orgUuid: string;
  conversation: Conversation;
  isAdding: boolean;
  onConfirm: (docs: { uuid: string; title?: string }[]) => void;
};

export function StepDocumentPicker({
  orgUuid,
  conversation,
  isAdding,
  onConfirm,
}: StepDocumentPickerProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [titles, setTitles] = useState<Record<string, string>>({});
  const { data: documents = [], isLoading } = useGetConversationDocuments(orgUuid, conversation.uuid);

  const toggleDoc = (uuid: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) {
        next.delete(uuid);
        setTitles((t) => {
          const copy = { ...t };
          delete copy[uuid];
          return copy;
        });
      } else {
        next.add(uuid);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
        <p className="text-sm font-medium text-foreground">No documents</p>
        <p className="mt-1 text-sm text-muted">
          This conversation has no uploaded files.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="space-y-1.5">
        {documents.map((doc, i) => {
          const canSelect = !!doc.uuid;
          const isChecked = doc.uuid ? selected.has(doc.uuid) : false;

          return (
            <li key={doc.uuid ?? `url-${i}`}>
              <label
                className={`flex items-start gap-3 rounded-lg border border-border bg-surface-secondary/40 p-3 ${canSelect ? 'cursor-pointer hover:bg-surface-secondary' : 'cursor-not-allowed opacity-50'}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={!canSelect}
                  onChange={() => doc.uuid && toggleDoc(doc.uuid)}
                  className="mt-0.5 h-4 w-4 accent-accent"
                />
                <DocumentIcon mimetype={doc.mimetype} filename={doc.filename} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground break-all">{doc.filename}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatDateTime(doc.created_at)}
                    {!canSelect ? ' · Cannot be added (no file record)' : ''}
                  </p>
                  {isChecked && doc.uuid ? (
                    <input
                      type="text"
                      placeholder="Title (optional)"
                      value={titles[doc.uuid] ?? ''}
                      maxLength={255}
                      onClick={(e) => e.preventDefault()}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTitles((t) => ({ ...t, [doc.uuid!]: val }));
                      }}
                      className="mt-2 w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  ) : null}
                </div>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={selected.size === 0 || isAdding}
          onClick={() => {
            const docs = Array.from(selected).map((uuid) => ({
              uuid,
              title: titles[uuid]?.trim() || undefined,
            }));
            onConfirm(docs);
          }}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAdding
            ? 'Adding…'
            : `Add ${selected.size > 0 ? selected.size : ''} document${selected.size !== 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
}
