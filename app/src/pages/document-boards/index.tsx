import { useState } from 'react';
import type { FC } from 'react';
import { Plus } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  useCreateDocumentBoard,
  useDeleteDocumentBoard,
  useGetDocumentBoards,
  useUpdateDocumentBoard,
} from '@/features/document-boards/hooks/use-document-boards';
import type {
  CreateDocumentBoardPayload,
  DocumentBoard,
} from '@/features/document-boards/interfaces/document-board.interfaces';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationStore } from '@/stores/organization';
import { BoardModal } from './components/board-modal';
import { BoardsList } from './components/boards-list';
import { BoardsTableSkeleton } from './components/boards-skeleton';

type ModalState = { mode: 'create' } | { mode: 'edit'; board: DocumentBoard } | null;
type DeleteTarget = { uuid: string; name: string } | null;

const DocumentBoardsPage: FC = () => {
  const organizationUuid = useOrganizationStore((state) => state.current_organization?.uuid);
  const canWrite = useAuthStore((state) =>
    (state.organization_permissions as string[]).includes('files:write'),
  );

  const [modalState, setModalState] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const { data: boards = [], isLoading } = useGetDocumentBoards(organizationUuid);
  const createBoard = useCreateDocumentBoard(organizationUuid);
  const updateBoard = useUpdateDocumentBoard(
    organizationUuid,
    modalState?.mode === 'edit' ? modalState.board.uuid : undefined,
  );
  const deleteBoard = useDeleteDocumentBoard(organizationUuid);

  const handleSubmit = (values: CreateDocumentBoardPayload) => {
    if (!modalState) return;

    if (modalState.mode === 'create') {
      createBoard.mutate(values, { onSuccess: () => setModalState(null) });
      return;
    }

    updateBoard.mutate(values, { onSuccess: () => setModalState(null) });
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Boards</h1>
          <p className="text-sm text-muted">
            Shared collections of documents for your organisation members.
          </p>
        </div>
        {canWrite ? (
          <button
            type="button"
            onClick={() => setModalState({ mode: 'create' })}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New board
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <BoardsTableSkeleton />
      ) : (
        <BoardsList
          boards={boards}
          canWrite={canWrite}
          onEdit={(board) => setModalState({ mode: 'edit', board })}
          onDelete={(board) => setDeleteTarget({ uuid: board.uuid, name: board.name })}
        />
      )}

      {modalState ? (
        <BoardModal
          mode={modalState.mode}
          board={modalState.mode === 'edit' ? modalState.board : undefined}
          isSubmitting={createBoard.isPending || updateBoard.isPending}
          onClose={() => setModalState(null)}
          onSubmit={handleSubmit}
        />
      ) : null}

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete board?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" and all its documents will be permanently removed from this board.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleteBoard.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteBoard.mutate(deleteTarget.uuid, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      />
    </div>
  );
};

export default DocumentBoardsPage;
