import type { DocumentBoardItem } from '@/features/document-boards/interfaces/document-board.interfaces';
import { Button } from '@/components/ui/button';
import { BoardDocumentCard } from './board-document-card';

type BoardDetailDocumentsProps = {
  items: DocumentBoardItem[];
  isLoading?: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onRemove: (itemUuid: string) => void;
};

export function BoardDetailDocuments({
  items,
  isLoading,
  page,
  totalPages,
  total,
  onPageChange,
  onRemove,
}: BoardDetailDocumentsProps) {
  if (isLoading) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <li
            key={index}
            className="h-[72px] animate-pulse rounded-lg border border-border bg-surface-secondary/40"
          />
        ))}
      </ul>
    );
  }

  if (items.length === 0 && total === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">No documents yet</p>
        <p className="mt-1 text-sm text-muted">
          Add documents from your conversations or upload a file.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="space-y-2">
        {items.map((item) => (
          <BoardDocumentCard key={item.uuid} item={item} onRemove={onRemove} />
        ))}
      </ul>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">
            Page {page} of {totalPages} — {total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-8 px-3 text-xs"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="h-8 px-3 text-xs"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
