import { useEffect, useMemo, useState, type FC } from 'react';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import { cn } from '@/lib/utils';
import {
  filterToolIntegrations,
  IntegrationToolsList,
  sortToolIntegrations,
} from './integration-tools-list';

interface ConversationSlashPickerProps {
  integrations: Integration[];
  query: string;
  isOpen: boolean;
  excludedUuids?: string[];
  className?: string;
  onSelect: (uuid: string) => void;
  onClose: () => void;
  onHighlightChange?: (uuid: string | null) => void;
}

export const ConversationSlashPicker: FC<ConversationSlashPickerProps> = ({
  integrations,
  query,
  isOpen,
  excludedUuids = [],
  className,
  onSelect,
  onClose,
  onHighlightChange,
}) => {
  const filteredIntegrations = useMemo(() => {
    const excluded = new Set(excludedUuids);
    return sortToolIntegrations(
      filterToolIntegrations(integrations, query).filter((integration) => !excluded.has(integration.uuid)),
    );
  }, [integrations, query, excludedUuids]);

  const [highlightedUuid, setHighlightedUuid] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedUuid(null);
      onHighlightChange?.(null);
      return;
    }

    const nextHighlighted = filteredIntegrations[0]?.uuid ?? null;
    setHighlightedUuid(nextHighlighted);
    onHighlightChange?.(nextHighlighted);
  }, [isOpen, query, filteredIntegrations, onHighlightChange]);

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

      if (filteredIntegrations.length === 0) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedUuid((current) => {
          const currentIndex = filteredIntegrations.findIndex((integration) => integration.uuid === current);
          const nextIndex = currentIndex < filteredIntegrations.length - 1 ? currentIndex + 1 : 0;
          const nextUuid = filteredIntegrations[nextIndex]?.uuid ?? null;
          onHighlightChange?.(nextUuid);
          return nextUuid;
        });
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedUuid((current) => {
          const currentIndex = filteredIntegrations.findIndex((integration) => integration.uuid === current);
          const nextIndex = currentIndex > 0 ? currentIndex - 1 : filteredIntegrations.length - 1;
          const nextUuid = filteredIntegrations[nextIndex]?.uuid ?? null;
          onHighlightChange?.(nextUuid);
          return nextUuid;
        });
        return;
      }

      if (event.key === 'Enter' && highlightedUuid) {
        event.preventDefault();
        onSelect(highlightedUuid);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredIntegrations, highlightedUuid, isOpen, onClose, onSelect, onHighlightChange]);

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
      <IntegrationToolsList
        integrations={integrations}
        mode="single"
        selectedUuids={[]}
        highlightedUuid={highlightedUuid}
        filterQuery={query}
        className="max-h-[min(280px,45dvh)]"
        onSelect={onSelect}
        onHighlight={setHighlightedUuid}
      />
    </div>
  );
};
