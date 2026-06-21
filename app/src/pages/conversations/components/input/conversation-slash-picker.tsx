import { useEffect, useMemo, useState, type FC } from 'react';
import type { IntegrationAppsToolkit } from '@/features/integration-apps/interfaces/integrationApps.interface';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import { cn } from '@/lib/utils';
import {
  buildConversationToolItems,
  filterConversationToolItems,
  getConversationToolItemId,
  sortConversationToolItems,
  type ConversationToolItem,
} from './conversation-tool-items.utils';
import { ConversationToolsList } from './conversation-tools-list';

interface ConversationSlashPickerProps {
  integrations: Integration[];
  toolkits: IntegrationAppsToolkit[];
  query: string;
  isOpen: boolean;
  excludedIntegrationUuids?: string[];
  className?: string;
  onSelect: (item: ConversationToolItem) => void;
  onClose: () => void;
}

export const ConversationSlashPicker: FC<ConversationSlashPickerProps> = ({
  integrations,
  toolkits,
  query,
  isOpen,
  excludedIntegrationUuids = [],
  className,
  onSelect,
  onClose,
}) => {
  const filteredItems = useMemo(() => {
    const excluded = new Set(excludedIntegrationUuids);
    const items = buildConversationToolItems(
      integrations.filter((integration) => !excluded.has(integration.uuid)),
      toolkits,
    );

    return sortConversationToolItems(filterConversationToolItems(items, query));
  }, [integrations, toolkits, query, excludedIntegrationUuids]);

  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedItemId(null);
      return;
    }

    const nextHighlighted = filteredItems[0];
    setHighlightedItemId(nextHighlighted ? getConversationToolItemId(nextHighlighted) : null);
  }, [isOpen, query, filteredItems]);

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

      if (filteredItems.length === 0) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedItemId((current) => {
          const currentIndex = filteredItems.findIndex(
            (item) => getConversationToolItemId(item) === current,
          );
          const nextIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
          const nextItem = filteredItems[nextIndex];
          return nextItem ? getConversationToolItemId(nextItem) : null;
        });
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedItemId((current) => {
          const currentIndex = filteredItems.findIndex(
            (item) => getConversationToolItemId(item) === current,
          );
          const nextIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
          const nextItem = filteredItems[nextIndex];
          return nextItem ? getConversationToolItemId(nextItem) : null;
        });
        return;
      }

      if (event.key === 'Enter' && highlightedItemId) {
        event.preventDefault();
        const item = filteredItems.find(
          (entry) => getConversationToolItemId(entry) === highlightedItemId,
        );
        if (item) {
          onSelect(item);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, highlightedItemId, isOpen, onClose, onSelect]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute bottom-full left-0 z-50 mb-2 w-[min(260px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-surface shadow-lg',
        className,
      )}
    >
      <ConversationToolsList
        integrations={integrations}
        toolkits={toolkits}
        mode="single"
        selectedIntegrationUuids={[]}
        selectedToolkitSlugs={[]}
        excludeIntegrationUuids={excludedIntegrationUuids}
        highlightedItemId={highlightedItemId}
        filterQuery={query}
        className="max-h-[min(280px,45dvh)]"
        onSelect={onSelect}
        onHighlight={setHighlightedItemId}
      />
    </div>
  );
};
