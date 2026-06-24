import { useEffect, useRef, useState, type FC, type KeyboardEvent } from 'react';
import { MoreHorizontal, PanelLeftClose, PanelLeftOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Conversation } from '@/features/conversations/interfaces/conversation.interfaces';
import { ConversationKinds, MessageRoles } from '@/features/conversations/interfaces/conversation.interfaces';
import { cn } from '@/lib/utils';
import { OrganizationPermissionGate } from '@/components/permissions/organization-permission-gate';
import { PermissionKeys } from '@/features/permissions/interfaces/permission.interfaces';
import { stripMarkdownForPreview } from '@/lib/message-markdown.utils';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationUuid?: string;
  isCreating: boolean;
  onSelect: (uuid: string) => void;
  onCreate: () => void;
  onRename: (uuid: string, title: string) => void;
  onDelete: (uuid: string) => void;
  className?: string;
  showHeader?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ConversationSidebar: FC<ConversationSidebarProps> = ({
  conversations,
  activeConversationUuid,
  isCreating,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  className,
  showHeader = true,
  collapsed = false,
  onToggleCollapse,
}) => {
  const [menuOpenUuid, setMenuOpenUuid] = useState<string | null>(null);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenUuid(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const startEditing = (conversation: Conversation) => {
    setEditingUuid(conversation.uuid);
    setEditTitle(conversation.title || 'Untitled chat');
    setMenuOpenUuid(null);
  };

  const commitEdit = () => {
    if (!editingUuid) return;
    const trimmed = editTitle.trim();
    if (trimmed) {
      onRename(editingUuid, trimmed);
    }
    setEditingUuid(null);
    setEditTitle('');
  };

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitEdit();
    }
    if (event.key === 'Escape') {
      setEditingUuid(null);
      setEditTitle('');
    }
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    const lastMessage = conversation.messages?.[0];

    if (!lastMessage?.content) {
      return 'No messages yet';
    }

    if (lastMessage.role === MessageRoles.ASSISTANT) {
      return stripMarkdownForPreview(lastMessage.content) || 'No messages yet';
    }

    return lastMessage.content;
  };

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 ease-in-out',
        collapsed ? 'w-14' : 'w-full md:w-72',
        className,
      )}
    >
      {showHeader ? (
        collapsed ? (
          <header className="flex shrink-0 flex-col items-center gap-2 border-b border-border px-2 py-3">
            {onToggleCollapse ? (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
                aria-label="Expand chats panel"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            ) : null}
            <OrganizationPermissionGate permission={PermissionKeys.CONVERSATIONS_WRITE}>
              <button
                type="button"
                onClick={onCreate}
                disabled={isCreating}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-secondary text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="New chat"
              >
                <Plus className="h-4 w-4" />
              </button>
            </OrganizationPermissionGate>
          </header>
        ) : (
          <header className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-3 md:px-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-medium text-foreground">Chats</h2>
              <p className="text-xs text-muted">
                {conversations.length} {conversations.length === 1 ? 'chat' : 'chats'} created
              </p>
            </div>
            <OrganizationPermissionGate permission={PermissionKeys.CONVERSATIONS_WRITE}>
              <button
                type="button"
                onClick={onCreate}
                disabled={isCreating}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-foreground transition-colors hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="New chat"
              >
                <Plus className="h-4 w-4" />
              </button>
            </OrganizationPermissionGate>
            {onToggleCollapse ? (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
                aria-label="Collapse chats panel"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            ) : null}
          </header>
        )
      ) : null}

      {!collapsed ? (
      <div className="flex min-h-0 flex-1 flex-col">
        {!showHeader ? (
          <OrganizationPermissionGate permission={PermissionKeys.CONVERSATIONS_WRITE}>
            <div className="flex shrink-0 items-center justify-end border-b border-border px-3 py-2">
              <button
                type="button"
                onClick={onCreate}
                disabled={isCreating}
                className="flex h-8 items-center gap-1.5 rounded-lg bg-surface-secondary px-3 text-xs font-medium text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                New chat
              </button>
            </div>
          </OrganizationPermissionGate>
        ) : null}

        <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-2">
        {conversations.map((conversation) => {
          const isActive = conversation.uuid === activeConversationUuid;
          const isEditing = editingUuid === conversation.uuid;
          const isAgent = conversation.kind === ConversationKinds.SCHEDULED_AGENT;

          return (
            <div
              key={conversation.uuid}
              className={cn(
                'group relative flex items-center rounded-xl border transition-colors',
                isActive
                  ? 'border-border bg-surface-secondary'
                  : 'border-transparent hover:border-border hover:bg-surface-secondary/70',
                isEditing && 'py-0.5',
              )}
            >
              {isEditing ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={handleEditKeyDown}
                  className="mx-1 w-full rounded-lg border border-accent/50 bg-surface px-3 py-2 text-sm text-foreground outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => onSelect(conversation.uuid)}
                  className="min-w-0 flex-1 px-3 py-2 text-left text-sm"
                >
                  <p className="truncate font-medium text-foreground">{conversation.title || 'Untitled chat'}</p>
                  <div className="flex items-center gap-1.5">
                    {isAgent ? (
                      <span className="shrink-0 rounded-full bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-medium text-violet-600">
                        Agent
                      </span>
                    ) : null}
                    <p className="truncate text-xs text-muted">
                      {getLastMessagePreview(conversation)}
                    </p>
                  </div>
                </button>
              )}

              {!isEditing && !isAgent ? (
                <OrganizationPermissionGate permissions={[PermissionKeys.CONVERSATIONS_WRITE, PermissionKeys.CONVERSATIONS_DELETE]} mode="any">
                  <div className="relative pr-1" ref={menuOpenUuid === conversation.uuid ? menuRef : undefined}>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setMenuOpenUuid(menuOpenUuid === conversation.uuid ? null : conversation.uuid);
                      }}
                      className={cn(
                        'rounded-md p-1.5 text-muted transition-opacity hover:bg-surface',
                        menuOpenUuid === conversation.uuid
                          ? 'opacity-100'
                          : 'opacity-100 md:opacity-0 md:group-hover:opacity-100',
                      )}
                      aria-label="Conversation options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {menuOpenUuid === conversation.uuid && (
                      <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg">
                        <OrganizationPermissionGate permission={PermissionKeys.CONVERSATIONS_WRITE}>
                          <button
                            type="button"
                            onClick={() => startEditing(conversation)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-surface-secondary"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Rename
                          </button>
                        </OrganizationPermissionGate>
                        <OrganizationPermissionGate permission={PermissionKeys.CONVERSATIONS_DELETE}>
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpenUuid(null);
                              onDelete(conversation.uuid);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-400 hover:bg-surface-secondary"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </OrganizationPermissionGate>
                      </div>
                    )}
                  </div>
                </OrganizationPermissionGate>
              ) : null}
            </div>
          );
        })}
        </div>
      </div>
      ) : null}
    </aside>
  );
};
