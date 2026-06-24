import { X } from 'lucide-react';
import type { DocumentBoard } from '@/features/document-boards/interfaces/document-board.interfaces';
import type { CreateDocumentBoardPayload } from '@/features/document-boards/interfaces/document-board.interfaces';
import { BoardForm } from './board-form';

type BoardModalProps = {
  mode: 'create' | 'edit';
  board?: DocumentBoard;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: CreateDocumentBoardPayload) => void;
};

export function BoardModal({
  mode,
  board,
  isSubmitting,
  onClose,
  onSubmit,
}: BoardModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-xl border border-border bg-surface p-5 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {mode === 'create' ? 'New Board' : 'Edit Board'}
            </h2>
            <p className="text-sm text-muted">
              {mode === 'create'
                ? 'Create a shared space where you and your team can collect documents.'
                : 'Update the board name or description.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-surface-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <BoardForm
          key={board?.uuid ?? 'create'}
          initialValues={board ? { name: board.name, description: board.description ?? undefined } : undefined}
          submitLabel={mode === 'create' ? 'Create board' : 'Save changes'}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
