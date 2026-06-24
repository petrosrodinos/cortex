import { Download, Eye, File, FileText, Image, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button, Dropdown, Label } from '@heroui/react';
import type { DocumentBoardItem } from '@/features/document-boards/interfaces/document-board.interfaces';
import { formatDateTime } from '@/lib/date';

function DocumentIcon({ mimetype, filename }: { mimetype: string; filename: string }) {
  if (mimetype.startsWith('image/')) return <Image className="h-4 w-4 shrink-0 text-muted" />;
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

type BoardDocumentCardProps = {
  item: DocumentBoardItem;
  canWrite: boolean;
  onRemove: (itemUuid: string) => void;
};

export function BoardDocumentCard({ item, canWrite, onRemove }: BoardDocumentCardProps) {
  const { document } = item;

  return (
    <li className="rounded-lg border border-border bg-surface-secondary/40 p-3">
      <div className="flex items-start gap-3">
        <DocumentIcon mimetype={document.mimetype} filename={document.filename} />
        <div className="min-w-0 flex-1">
          {item.title ? (
            <p className="text-sm font-semibold text-foreground break-all">{item.title}</p>
          ) : null}
          <p className={`break-all ${item.title ? 'mt-0.5 text-xs text-muted' : 'text-sm font-medium text-foreground'}`}>
            {document.filename}
          </p>
          <p className="mt-0.5 text-xs text-muted">Added {formatDateTime(item.created_at)}</p>
          <p className="mt-0.5 text-xs text-muted">
            By {[document.user.first_name, document.user.last_name].filter(Boolean).join(' ') || document.user.email}
          </p>
        </div>

        <Dropdown>
          <Button
            aria-label="Document actions"
            variant="secondary"
            className="inline-flex h-7 w-7 min-w-7 shrink-0 items-center justify-center rounded border-0 bg-transparent p-0 text-muted shadow-none hover:bg-surface-secondary hover:text-foreground data-[hover=true]:bg-surface-secondary data-[hover=true]:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Dropdown.Popover
            placement="bottom end"
            offset={4}
            className="z-50 min-w-[180px] overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-lg"
          >
            <Dropdown.Menu
              onAction={(key) => {
                const k = String(key);
                if (k === 'view') window.open(document.url, '_blank', 'noopener,noreferrer');
                if (k === 'download') downloadFile(document.url, document.filename);
                if (k === 'delete') onRemove(item.uuid);
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
              {canWrite ? (
                <Dropdown.Item id="delete" textValue="Delete" className="gap-2.5 rounded-lg px-2 py-2 text-red-500">
                  <Trash2 className="h-4 w-4 shrink-0" />
                  <Label className="text-sm">Remove</Label>
                </Dropdown.Item>
              ) : null}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </li>
  );
}
