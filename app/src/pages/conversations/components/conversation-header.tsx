import { useEffect, useRef, useState, type FC, type KeyboardEvent } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface ConversationHeaderProps {
  title: string;
  onRename: (title: string) => void;
  onDelete: () => void;
}

export const ConversationHeader: FC<ConversationHeaderProps> = ({ title, onRename, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
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

  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
      {isEditing ? (
        <input
          ref={inputRef}
          value={editTitle}
          onChange={(event) => setEditTitle(event.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          className="my-0.5 min-w-0 flex-1 rounded-md border border-accent/50 bg-surface-secondary px-2 py-1.5 text-sm font-medium text-foreground outline-none"
        />
      ) : (
        <h1 className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{title || 'Untitled chat'}</h1>
      )}

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
          aria-label="Rename conversation"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-secondary hover:text-red-400"
          aria-label="Delete conversation"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
