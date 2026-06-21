import { useEffect, useMemo, useState, type FC } from 'react';
import type { IntegrationAppsToolkit } from '@/features/integration-apps/interfaces/integrationApps.interface';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import { cn } from '@/lib/utils';
import {
  buildConversationToolItems,
  filterConversationToolItems,
  getConversationToolItemId,
  isConversationToolItemTierDisabled,
  sortConversationToolItems,
  type ConversationToolItem,
} from './conversation-tool-items.utils';
import { ConversationToolsList } from './conversation-tools-list';
import type { ToolkitBinding } from '../../utils/conversation-toolkit-bindings.utils';

interface ConversationSlashPickerProps {
  integrations: Integration[];
  toolkits: IntegrationAppsToolkit[];
  query: string;
  isOpen: boolean;
  selectedToolkitBindings?: ToolkitBinding[];
  excludedIntegrationUuids?: string[];
  excludedToolkitItemIds?: string[];
  className?: string;
  onSelect: (item: ConversationToolItem) => void;
  onClose: () => void;
}

export const ConversationSlashPicker: FC<ConversationSlashPickerProps> = ({
  integrations,
  toolkits,
  query,
  isOpen,
  selectedToolkitBindings = [],
  excludedIntegrationUuids = [],
  excludedToolkitItemIds = [],
  className,
  onSelect,
  onClose,
}) => {
  const filteredItems = useMemo(() => {
    const excludedIntegrations = new Set(excludedIntegrationUuids);
    const excludedToolkitItems = new Set(excludedToolkitItemIds);
    const items = buildConversationToolItems(
      integrations.filter((integration) => !excludedIntegrations.has(integration.uuid)),
      toolkits,
    ).filter((item) => !excludedToolkitItems.has(getConversationToolItemId(item)));

    return sortConversationToolItems(filterConversationToolItems(items, query));
  }, [integrations, toolkits, query, excludedIntegrationUuids, excludedToolkitItemIds]);

  const selectableItems = useMemo(
    () =>
      filteredItems.filter(
        (item) => !isConversationToolItemTierDisabled(item, selectedToolkitBindings),
      ),
    [filteredItems, selectedToolkitBindings],
  );

  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedItemId(null);
      return;
    }

    const nextHighlighted = selectableItems[0];
    setHighlightedItemId(nextHighlighted ? getConversationToolItemId(nextHighlighted) : null);
  }, [isOpen, query, selectableItems]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (selectableItems.length === 0) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedItemId((current) => {
          const currentIndex = selectableItems.findIndex(
            (item) => getConversationToolItemId(item) === current,
          );
          const nextIndex = currentIndex < selectableItems.length - 1 ? currentIndex + 1 : 0;
          const nextItem = selectableItems[nextIndex];
          return nextItem ? getConversationToolItemId(nextItem) : null;
        });
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedItemId((current) => {
          const currentIndex = selectableItems.findIndex(
            (item) => getConversationToolItemId(item) === current,
          );
          const nextIndex = currentIndex > 0 ? currentIndex - 1 : selectableItems.length - 1;
          const nextItem = selectableItems[nextIndex];
          return nextItem ? getConversationToolItemId(nextItem) : null;
        });
        return;
      }

      if (event.key === 'Enter' && highlightedItemId) {
        event.preventDefault();
        const item = selectableItems.find(
          (entry) => getConversationToolItemId(entry) === highlightedItemId,
        );
        if (item) {
          onSelect(item);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectableItems, highlightedItemId, isOpen, onClose, onSelect]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
        className={cn(
          'absolute bottom-full left-0 z-[100] mb-2 w-[min(260px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-surface shadow-lg',
          className,
        )}
    >
      <ConversationToolsList
        integrations={integrations}
        toolkits={toolkits}
        mode="single"
        selectedIntegrationUuids={[]}
        selectedToolkitBindings={selectedToolkitBindings}
        excludeIntegrationUuids={excludedIntegrationUuids}
        excludeToolkitItemIds={excludedToolkitItemIds}
        highlightedItemId={highlightedItemId}
        filterQuery={query}
        className="max-h-[min(280px,45dvh)]"
        onSelect={onSelect}
        onHighlight={setHighlightedItemId}
      />
    </div>
  );
};
