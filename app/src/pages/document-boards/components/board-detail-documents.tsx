import type { DocumentBoardItem } from '@/features/document-boards/interfaces/document-board.interfaces';
import { BoardDocumentCard } from './board-document-card';

type BoardDetailDocumentsProps = {
  items: DocumentBoardItem[];
  onRemove: (itemUuid: string) => void;
};

export function BoardDetailDocuments({ items, onRemove }: BoardDetailDocumentsProps) {
  if (items.length === 0) {
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
    <ul className="space-y-2">
      {items.map((item) => (
        <BoardDocumentCard key={item.uuid} item={item} onRemove={onRemove} />
      ))}
    </ul>
  );
}
