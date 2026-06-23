import { useEffect, useRef, useState, type FC, type KeyboardEvent } from 'react';
import { Skeleton } from '@heroui/react';
import { FileText, Menu, MoreHorizontal, PanelLeftOpen, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationHeaderProps {
  title: string;
  isTitleLoading?: boolean;
  onRename: (title: string) => void;
  onDelete: () => void;
  onOpenDocuments: () => void;
  onOpenChats?: () => void;
  chatsPanelCollapsed?: boolean;
  onToggleChatsPanel?: () => void;
}

export const ConversationHeader: FC<ConversationHeaderProps> = ({
  title,
  isTitleLoading = false,
  onRename,
  onDelete,
  onOpenDocuments,
  onOpenChats,
  chatsPanelCollapsed = false,
  onToggleChatsPanel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setEditTitle(title);
    }
  }, [title, isEditing]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const commitEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== title) {
      onRename(trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitEdit();
    }
    if (event.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    setMenuOpen(false);
    setIsEditing(true);
  };

  return (
    <header className="flex shrink-0 min-w-0 items-center gap-2 border-b border-border px-3 py-3 md:px-4">
      {onOpenChats ? (
        <button
          type="button"
          onClick={onOpenChats}
          className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-secondary hover:text-foreground md:hidden"
          aria-label="Open chats"
        >
          <Menu className="h-4 w-4" />
        </button>
      ) : null}

      {onToggleChatsPanel && chatsPanelCollapsed ? (
        <button
          type="button"
          onClick={onToggleChatsPanel}
          className="hidden rounded-md p-1.5 text-muted transition-colors hover:bg-surface-secondary hover:text-foreground md:inline-flex"
          aria-label="Expand chats panel"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      ) : null}

      {isEditing ? (
        <input
          ref={inputRef}
          value={editTitle}
          onChange={(event) => setEditTitle(event.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          className="my-0.5 min-w-0 flex-1 rounded-md border border-accent/50 bg-surface-secondary px-2 py-1.5 text-sm font-medium text-foreground outline-none"
        />
      ) : isTitleLoading ? (
        <Skeleton className="h-5 w-40 min-w-0 flex-1 rounded" aria-hidden="true" />
      ) : (
        <h1 className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{title || 'Untitled chat'}</h1>
      )}

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onOpenDocuments}
          className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
          aria-label="View documents"
        >
          <FileText className="h-4 w-4" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(
              'rounded-md p-1.5 text-muted transition-colors hover:bg-surface-secondary hover:text-foreground',
              menuOpen && 'bg-surface-secondary text-foreground',
            )}
            aria-label="Conversation options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg">
              <button
                type="button"
                onClick={startEditing}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-surface-secondary"
              >
                <Pencil className="h-3.5 w-3.5" />
                Rename
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-400 hover:bg-surface-secondary"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
