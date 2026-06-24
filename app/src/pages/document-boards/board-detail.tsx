import { useRef, useState } from 'react';
import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Upload } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  useAddDocumentToBoard,
  useGetDocumentBoard,
  useRemoveDocumentFromBoard,
} from '@/features/document-boards/hooks/use-document-boards';
import { useUploadDocument } from '@/features/files/hooks/use-files';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationStore } from '@/stores/organization';
import { Routes } from '@/routes/routes';
import { AddFromConversationModal } from './components/add-from-conversation-modal';
import { BoardDetailDocuments } from './components/board-detail-documents';

const DocumentBoardDetailPage: FC = () => {
  const { boardUuid } = useParams<{ boardUuid: string }>();
  const organizationUuid = useOrganizationStore((state) => state.current_organization?.uuid);
  const canWrite = useAuthStore((state) =>
    (state.organization_permissions as string[]).includes('files:write'),
  );

  const [addFromConvOpen, setAddFromConvOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: board, isLoading } = useGetDocumentBoard(organizationUuid, boardUuid);
  const uploadDocument = useUploadDocument(organizationUuid);
  const addDocument = useAddDocumentToBoard(organizationUuid, boardUuid);
  const removeDocument = useRemoveDocumentFromBoard(organizationUuid, boardUuid);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !organizationUuid || !boardUuid) return;

    uploadDocument.mutate(file, {
      onSuccess: (uploaded) => {
        addDocument.mutate(uploaded.uuid);
      },
    });

    e.target.value = '';
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="h-6 w-40 animate-pulse rounded bg-surface-secondary" />
        <div className="mt-4 h-8 w-64 animate-pulse rounded bg-surface-secondary" />
      </div>
    );
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

      {canWrite ? (
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
      ) : null}

      <BoardDetailDocuments
        items={board.items}
        canWrite={canWrite}
        onRemove={(itemUuid) => setRemoveTarget(itemUuid)}
      />

      {addFromConvOpen && organizationUuid && boardUuid ? (
        <AddFromConversationModal
          orgUuid={organizationUuid}
          boardUuid={boardUuid}
          onClose={() => setAddFromConvOpen(false)}
        />
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
