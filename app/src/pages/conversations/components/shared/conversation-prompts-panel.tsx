import { useState, type FC } from 'react';
import { Bot, MessageSquare, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, Dropdown, Label } from '@heroui/react';
import type { SavedPrompt } from '@/features/saved-prompts/interfaces/saved-prompts.interfaces';
import {
  useDeleteSavedPrompt,
  useGetSavedPrompts,
} from '@/features/saved-prompts/hooks/use-saved-prompts';
import { formatDateTime } from '@/lib/date';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface ConversationPromptsPanelProps {
  orgUuid: string;
  onCreatePrompt: () => void;
  onEditPrompt: (prompt: SavedPrompt) => void;
  onUsePrompt: (prompt: SavedPrompt) => void;
  onCreateAgentFromPrompt: (prompt: SavedPrompt) => void;
}

function PromptActionsDropdown({
  onEdit,
  onUse,
  onCreateAgent,
  onDelete,
}: {
  onEdit: () => void;
  onUse: () => void;
  onCreateAgent: () => void;
  onDelete: () => void;
}) {
  return (
    <Dropdown>
      <Button
        aria-label="Prompt actions"
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
            const action = String(key);
            if (action === 'use') onUse();
            if (action === 'create-agent') onCreateAgent();
            if (action === 'edit') onEdit();
            if (action === 'delete') onDelete();
          }}
        >
          <Dropdown.Item id="use" textValue="Use to chat" className="gap-2.5 rounded-lg px-2 py-2">
            <MessageSquare className="h-4 w-4 shrink-0 text-muted" />
            <Label className="text-sm">Use to chat</Label>
          </Dropdown.Item>
          <Dropdown.Item id="create-agent" textValue="Create agent" className="gap-2.5 rounded-lg px-2 py-2">
            <Bot className="h-4 w-4 shrink-0 text-muted" />
            <Label className="text-sm">Create agent</Label>
          </Dropdown.Item>
          <Dropdown.Item id="edit" textValue="Edit" className="gap-2.5 rounded-lg px-2 py-2">
            <Pencil className="h-4 w-4 shrink-0 text-muted" />
            <Label className="text-sm">Edit</Label>
          </Dropdown.Item>
          <Dropdown.Item id="delete" textValue="Delete" className="gap-2.5 rounded-lg px-2 py-2 text-red-400">
            <Trash2 className="h-4 w-4 shrink-0" />
            <Label className="text-sm">Delete</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

function PromptItem({
  prompt,
  onEdit,
  onUse,
  onCreateAgent,
  onDelete,
}: {
  prompt: SavedPrompt;
  onEdit: () => void;
  onUse: () => void;
  onCreateAgent: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="rounded-lg border border-border bg-surface-secondary/40 p-3">
      <div className="flex items-start gap-3">
        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{prompt.title}</p>
          <p className="mt-1 line-clamp-2 text-xs text-muted">{prompt.content}</p>
          <p className="mt-1.5 text-xs text-muted">{formatDateTime(prompt.updated_at)}</p>
        </div>
        <PromptActionsDropdown
          onEdit={onEdit}
          onUse={onUse}
          onCreateAgent={onCreateAgent}
          onDelete={onDelete}
        />
      </div>
    </li>
  );
}

function PromptsSkeleton() {
  return (
    <ul className="space-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <li
          key={index}
          className="rounded-lg border border-border bg-surface-secondary/40 p-3"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-4 w-4 shrink-0 animate-pulse rounded bg-surface-secondary" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-surface-secondary" />
              <div className="h-3 w-full animate-pulse rounded bg-surface-secondary" />
              <div className="h-3 w-24 animate-pulse rounded bg-surface-secondary" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export const ConversationPromptsPanel: FC<ConversationPromptsPanelProps> = ({
  orgUuid,
  onCreatePrompt,
  onEditPrompt,
  onUsePrompt,
  onCreateAgentFromPrompt,
}) => {
  const { data: prompts = [], isLoading } = useGetSavedPrompts(orgUuid);
  const deletePrompt = useDeleteSavedPrompt(orgUuid);
  const [deleteTarget, setDeleteTarget] = useState<SavedPrompt | null>(null);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deletePrompt.mutate(deleteTarget.uuid, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs text-muted">Reusable prompts for your account in this organization.</p>
        <button
          type="button"
          onClick={onCreatePrompt}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-surface-secondary"
        >
          <Plus className="h-3.5 w-3.5" />
          New prompt
        </button>
      </div>

      {isLoading ? (
        <PromptsSkeleton />
      ) : prompts.length === 0 ? (
        <p className="text-sm text-muted">No saved prompts yet.</p>
      ) : (
        <ul className="space-y-2">
          {prompts.map((prompt) => (
            <PromptItem
              key={prompt.uuid}
              prompt={prompt}
              onEdit={() => onEditPrompt(prompt)}
              onUse={() => onUsePrompt(prompt)}
              onCreateAgent={() => onCreateAgentFromPrompt(prompt)}
              onDelete={() => setDeleteTarget(prompt)}
            />
          ))}
        </ul>
      )}

      <ConfirmationDialog
        open={deleteTarget != null}
        title="Delete prompt?"
        description="This will permanently remove the saved prompt from your library."
        confirmLabel="Delete"
        loading={deletePrompt.isPending}
        onConfirm={handleDeleteConfirm}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      />
    </>
  );
};
