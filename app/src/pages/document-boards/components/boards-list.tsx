import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Label } from '@heroui/react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { DocumentBoard } from '@/features/document-boards/interfaces/document-board.interfaces';
import { Routes } from '@/routes/routes';
import { formatDateTime } from '@/lib/date';

type BoardsListProps = {
  boards: DocumentBoard[];
  canWrite: boolean;
  onEdit: (board: DocumentBoard) => void;
  onDelete: (board: DocumentBoard) => void;
};

export function BoardsList({ boards, canWrite, onEdit, onDelete }: BoardsListProps) {
  const navigate = useNavigate();

  if (boards.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">No boards yet</p>
        <p className="mt-1 text-sm text-muted">
          Create a board to start sharing documents with your team.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-surface-secondary/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board) => (
              <tr
                key={board.uuid}
                className="cursor-pointer border-b border-border last:border-b-0 hover:bg-surface-secondary/40"
                onClick={() => navigate(Routes.dashboard.documentBoard(board.uuid))}
              >
                <td className="px-4 py-3 font-medium text-foreground">{board.name}</td>
                <td className="px-4 py-3 text-muted">{board.description ?? '—'}</td>
                <td className="px-4 py-3 text-muted">{formatDateTime(board.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    {canWrite ? (
                      <Dropdown>
                        <Button
                          aria-label="Row actions"
                          variant="secondary"
                          className="inline-flex h-8 w-8 min-w-8 shrink-0 rounded-lg border-0 bg-transparent p-0 text-muted shadow-none hover:bg-surface-secondary hover:text-foreground data-[hover=true]:bg-surface-secondary data-[hover=true]:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        <Dropdown.Popover
                          placement="bottom end"
                          offset={4}
                          className="z-50 min-w-[160px] overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-lg"
                        >
                          <Dropdown.Menu
                            onAction={(key) => {
                              const k = String(key);
                              if (k === 'edit') onEdit(board);
                              if (k === 'delete') onDelete(board);
                            }}
                          >
                            <Dropdown.Item id="edit" textValue="Edit" className="gap-2.5 rounded-lg px-2 py-2">
                              <Pencil className="h-4 w-4 shrink-0 text-muted" />
                              <Label className="text-sm">Edit</Label>
                            </Dropdown.Item>
                            <Dropdown.Item id="delete" textValue="Delete" className="gap-2.5 rounded-lg px-2 py-2 text-red-500">
                              <Trash2 className="h-4 w-4 shrink-0" />
                              <Label className="text-sm">Delete</Label>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
