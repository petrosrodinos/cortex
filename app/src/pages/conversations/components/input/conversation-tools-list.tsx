import { useMemo, type FC, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { IntegrationAppsToolkit } from '@/features/integration-apps/interfaces/integrationApps.interface';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import { cn } from '@/lib/utils';
import { IntegrationToolRow } from './integration-tools-list';
import {
  buildConversationToolItems,
  filterConversationToolItems,
  getConversationToolItemId,
  isConversationToolItemSelected,
  sortConversationToolItems,
  type ConversationToolItem,
} from './conversation-tool-items.utils';

interface ConversationToolRowProps {
  item: ConversationToolItem;
  isSelected?: boolean;
  isHighlighted?: boolean;
  mode: 'multiple' | 'single';
}

const ConversationToolRow: FC<ConversationToolRowProps> = ({
  item,
  isSelected = false,
  isHighlighted = false,
  mode,
}) => {
  if (item.kind === 'integration') {
    return (
      <IntegrationToolRow
        integration={item.integration}
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        mode={mode}
      />
    );
  }

  const isActive = mode === 'single' ? isHighlighted : isSelected;

  return (
    <div className="flex w-full min-w-0 items-center gap-2">
      {item.toolkit.logo_url ? (
        <img
          src={item.toolkit.logo_url}
          alt=""
          className="h-5 w-5 shrink-0 rounded bg-background object-contain"
        />
      ) : (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent text-[10px] font-semibold text-accent-foreground">
          {item.toolkit.name.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-xs',
          isActive ? 'font-medium text-foreground' : 'text-muted',
        )}
      >
        {item.toolkit.name}
      </span>
      {mode === 'multiple' ? (
        <span
          className={cn(
            'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
            isSelected
              ? 'border-accent bg-accent text-background'
              : 'border-border bg-transparent',
          )}
        >
          {isSelected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
        </span>
      ) : null}
    </div>
  );
};

interface ConversationToolsListProps {
  integrations: Integration[];
  toolkits: IntegrationAppsToolkit[];
  mode: 'multiple' | 'single';
  selectedIntegrationUuids: string[];
  selectedToolkitSlugs: string[];
  excludeIntegrationUuids?: string[];
  highlightedItemId?: string | null;
  filterQuery?: string;
  className?: string;
  emptyState?: ReactNode;
  onSelect: (item: ConversationToolItem) => void;
  onHighlight?: (itemId: string) => void;
}

export const ConversationToolsList: FC<ConversationToolsListProps> = ({
  integrations,
  toolkits,
  mode,
  selectedIntegrationUuids,
  selectedToolkitSlugs,
  excludeIntegrationUuids = [],
  highlightedItemId = null,
  filterQuery = '',
  className,
  emptyState,
  onSelect,
  onHighlight,
}) => {
  const items = useMemo(() => {
    const excluded = new Set(excludeIntegrationUuids);
    const visibleIntegrations = integrations.filter(
      (integration) => !excluded.has(integration.uuid),
    );
    const allItems = buildConversationToolItems(visibleIntegrations, toolkits);
    return sortConversationToolItems(filterConversationToolItems(allItems, filterQuery));
  }, [integrations, toolkits, filterQuery, excludeIntegrationUuids]);

  if (items.length === 0) {
    return (
      emptyState ?? (
        <div className={cn('px-3 py-4 text-center text-xs text-muted', className)}>
          No tools found
        </div>
      )
    );
  }

  return (
    <div className={cn('overflow-y-auto p-1', className)} role="listbox" aria-label="Tools">
      {items.map((item) => {
        const itemId = getConversationToolItemId(item);
        const isSelected = isConversationToolItemSelected(
          item,
          selectedIntegrationUuids,
          selectedToolkitSlugs,
        );
        const isHighlighted = highlightedItemId === itemId;
        const isActive = mode === 'single' ? isHighlighted : isSelected;

        return (
          <button
            key={itemId}
            type="button"
            role="option"
            aria-selected={mode === 'single' ? isHighlighted : isSelected}
            className={cn(
              'flex w-full min-w-0 items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors',
              isActive && 'bg-accent/12',
              mode === 'single' && isHighlighted && 'bg-accent/16',
            )}
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onMouseEnter={() => onHighlight?.(itemId)}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(item);
            }}
          >
            <ConversationToolRow
              item={item}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              mode={mode}
            />
          </button>
        );
      })}
    </div>
  );
};
