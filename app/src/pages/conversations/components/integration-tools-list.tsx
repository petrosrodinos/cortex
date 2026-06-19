import { useMemo, type FC, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import {
  IntegrationStatuses,
  type Integration,
} from '@/features/integrations/common/interfaces/integration.interface';
import { PROVIDER_ICON_META, providerLabels } from '@/features/integrations/constants/provider-metadata';
import { cn } from '@/lib/utils';

export function getToolEligibleIntegrations(integrations: Integration[]): Integration[] {
  return integrations.filter(
    (integration) =>
      integration.status === IntegrationStatuses.ACTIVE &&
      (integration.actions?.some((action) => action.enabled) ?? false),
  );
}

export function getIntegrationDisplayLabel(integration: Integration): string {
  return providerLabels[integration.provider] ?? integration.provider;
}

export function getIntegrationSlashSlug(integration: Integration): string {
  return getIntegrationDisplayLabel(integration)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function filterToolIntegrations(integrations: Integration[], query: string): Integration[] {
  const normalizedQuery = query.trim().toLowerCase();

  return getToolEligibleIntegrations(integrations).filter((integration) => {
    if (!normalizedQuery) {
      return true;
    }

    const label = getIntegrationDisplayLabel(integration).toLowerCase();
    const slug = getIntegrationSlashSlug(integration);
    const name = integration.name.toLowerCase();

    return (
      label.includes(normalizedQuery) ||
      slug.includes(normalizedQuery) ||
      name.includes(normalizedQuery)
    );
  });
}

export function sortToolIntegrations(integrations: Integration[]): Integration[] {
  return [...integrations].sort((a, b) => {
    const providerCompare = getIntegrationDisplayLabel(a).localeCompare(getIntegrationDisplayLabel(b));
    return providerCompare !== 0 ? providerCompare : a.name.localeCompare(b.name);
  });
}

interface IntegrationToolRowProps {
  integration: Integration;
  isSelected?: boolean;
  isHighlighted?: boolean;
  mode: 'multiple' | 'single';
}

export const IntegrationToolRow: FC<IntegrationToolRowProps> = ({
  integration,
  isSelected = false,
  isHighlighted = false,
  mode,
}) => {
  const iconMeta = PROVIDER_ICON_META[integration.provider];
  const Icon = iconMeta?.icon;
  const providerLabel = getIntegrationDisplayLabel(integration);
  const isActive = mode === 'single' ? isHighlighted : isSelected;

  return (
    <div className="flex w-full min-w-0 items-center gap-2">
      {Icon ? (
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-white"
          style={{ backgroundColor: iconMeta.bg }}
        >
          <Icon size={12} />
        </span>
      ) : null}
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-xs',
          isActive ? 'font-medium text-foreground' : 'text-muted',
        )}
      >
        {providerLabel}
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

interface IntegrationToolsListProps {
  integrations: Integration[];
  mode: 'multiple' | 'single';
  selectedUuids: string[];
  highlightedUuid?: string | null;
  filterQuery?: string;
  className?: string;
  emptyState?: ReactNode;
  onSelect: (uuid: string) => void;
  onHighlight?: (uuid: string) => void;
}

export const IntegrationToolsList: FC<IntegrationToolsListProps> = ({
  integrations,
  mode,
  selectedUuids,
  highlightedUuid = null,
  filterQuery = '',
  className,
  emptyState,
  onSelect,
  onHighlight,
}) => {
  const items = useMemo(
    () => sortToolIntegrations(filterToolIntegrations(integrations, filterQuery)),
    [integrations, filterQuery],
  );

  if (items.length === 0) {
    return (
      emptyState ?? (
        <div className={cn('px-3 py-4 text-center text-xs text-muted', className)}>
          No integrations found
        </div>
      )
    );
  }

  return (
    <div className={cn('overflow-y-auto p-1', className)} role="listbox" aria-label="Integrations">
      {items.map((integration) => {
        const isSelected = selectedUuids.includes(integration.uuid);
        const isHighlighted = highlightedUuid === integration.uuid;

        return (
          <button
            key={integration.uuid}
            type="button"
            role="option"
            aria-selected={mode === 'single' ? isHighlighted : isSelected}
            className={cn(
              'flex w-full min-w-0 items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors',
              (mode === 'single' ? isHighlighted : isSelected) && 'bg-accent/12',
              mode === 'single' && isHighlighted && 'bg-accent/16',
            )}
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onMouseEnter={() => onHighlight?.(integration.uuid)}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(integration.uuid);
            }}
          >
            <IntegrationToolRow
              integration={integration}
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
