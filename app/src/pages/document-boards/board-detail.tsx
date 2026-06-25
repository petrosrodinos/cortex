import { useRef, useState } from 'react';
import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Upload } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  useAddDocumentToBoard,
  useGetDocumentBoard,
  useGetDocumentBoardItems,
  useRemoveDocumentFromBoard,
} from '@/features/document-boards/hooks/use-document-boards';
import { useUploadDocument } from '@/features/files/hooks/use-files';
import { OrganizationPermissionGate } from '@/components/permissions/organization-permission-gate';
import { PermissionKeys } from '@/features/permissions/interfaces/permission.interfaces';
import { useOrganizationStore } from '@/stores/organization';
import { Routes } from '@/routes/routes';
import { AddFromConversationModal } from './components/add-from-conversation-modal';
import { BoardDetailDocuments } from './components/board-detail-documents';
import { BoardDetailSkeleton } from './components/board-detail-skeleton';

const ITEMS_PAGE_SIZE = 20;

const DocumentBoardDetailPage: FC = () => {
  const { boardUuid } = useParams<{ boardUuid: string }>();
  const organizationUuid = useOrganizationStore((state) => state.current_organization?.uuid);

  const [addFromConvOpen, setAddFromConvOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [pendingDocUuid, setPendingDocUuid] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [itemsPage, setItemsPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const itemsQuery = { page: itemsPage, limit: ITEMS_PAGE_SIZE };

  const { data: board, isLoading: isBoardLoading } = useGetDocumentBoard(organizationUuid, boardUuid);
  const { data: itemsResult, isLoading: isItemsLoading } = useGetDocumentBoardItems(
    organizationUuid,
    boardUuid,
    itemsQuery,
  );
  const uploadDocument = useUploadDocument(organizationUuid);
  const addDocument = useAddDocumentToBoard(organizationUuid, boardUuid);
  const removeDocument = useRemoveDocumentFromBoard(organizationUuid, boardUuid);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !organizationUuid || !boardUuid) return;

    uploadDocument.mutate(file, {
      onSuccess: (uploaded) => {
        setPendingDocUuid(uploaded.uuid);
        setTitleInput('');
      },
    });

    e.target.value = '';
  };

  const handleAddPending = () => {
    if (!pendingDocUuid) return;
    addDocument.mutate(
      { documentUuid: pendingDocUuid, title: titleInput.trim() || undefined },
      {
        onSuccess: () => {
          setItemsPage(1);
        },
        onSettled: () => setPendingDocUuid(null),
      },
    );
  };

  if (isBoardLoading) {
    return <BoardDetailSkeleton />;
  }

  if (!board) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-sm text-muted">Board not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <Link
          to={Routes.dashboard.documentBoards}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Boards
        </Link>
        <h1 className="mt-2 text-lg font-semibold text-foreground">{board.name}</h1>
        {board.description ? (
          <p className="text-sm text-muted">{board.description}</p>
        ) : null}
      </div>

      <OrganizationPermissionGate permission={PermissionKeys.DOCUMENTS_WRITE}>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAddFromConvOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-secondary"
          >
            <MessageSquare className="h-4 w-4" />
            Add from conversation
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadDocument.isPending || addDocument.isPending}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploadDocument.isPending ? 'Uploading…' : 'Upload file'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </OrganizationPermissionGate>

      <BoardDetailDocuments
        items={itemsResult?.data ?? []}
        isLoading={isItemsLoading}
        page={itemsResult?.pagination.page ?? itemsPage}
        totalPages={itemsResult?.pagination.total_pages ?? 1}
        total={itemsResult?.pagination.total ?? 0}
        onPageChange={setItemsPage}
        onRemove={(itemUuid) => setRemoveTarget(itemUuid)}
      />

      {addFromConvOpen && organizationUuid && boardUuid ? (
        <AddFromConversationModal
          orgUuid={organizationUuid}
          boardUuid={boardUuid}
          onClose={() => setAddFromConvOpen(false)}
        />
      ) : null}

      {pendingDocUuid ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-[color-mix(in_oklch,black_42%,transparent)]"
            onClick={() => setPendingDocUuid(null)}
          />
          <section
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm overflow-hidden rounded-lg border border-border bg-surface p-5 shadow-xl"
            style={{ boxShadow: '0 24px 60px -20px color-mix(in oklch, black 55%, transparent)' }}
          >
            <h2 className="text-sm font-semibold text-foreground">Add to board</h2>
            <p className="mt-0.5 text-xs text-muted">Optionally give this document a title.</p>
            <input
              autoFocus
              type="text"
              placeholder="Title (optional)"
              value={titleInput}
              maxLength={255}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddPending();
                if (e.key === 'Escape') setPendingDocUuid(null);
              }}
              className="mt-3 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDocUuid(null)}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-muted hover:bg-surface-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={addDocument.isPending}
                onClick={handleAddPending}
                className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
              >
                {addDocument.isPending ? 'Adding…' : 'Add to board'}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      <ConfirmationDialog
        open={!!removeTarget}
        title="Remove document?"
        description="This document will be removed from the board. The original file is not deleted."
        confirmLabel="Remove"
        loading={removeDocument.isPending}
        onConfirm={() => {
          if (!removeTarget) return;
          removeDocument.mutate(removeTarget, {
            onSuccess: () => setRemoveTarget(null),
          });
        }}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
      />
    </div>
  );
};

export default DocumentBoardDetailPage;
