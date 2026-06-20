import { useMemo, type FC } from 'react';
import { Check } from 'lucide-react';
import type { IntegrationAppsToolkit } from '@/features/integrationApps/interfaces/integrationApps.interface';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import {
  IntegrationStatuses,
} from '@/features/integrations/common/interfaces/integration.interface';
import { cn } from '@/lib/utils';
import { IntegrationToolsList } from './integration-tools-list';

export function getToolEligibleIntegrations(integrations: Integration[]): Integration[] {
  return integrations.filter(
    (integration) =>
      integration.status === IntegrationStatuses.ACTIVE &&
      (integration.actions?.some((action) => action.enabled) ?? false),
  );
}

interface ConversationToolsMenuProps {
  integrations: Integration[];
  toolkits: IntegrationAppsToolkit[];
  selectedIntegrationUuids: string[];
  selectedToolkitSlugs: string[];
  onIntegrationSelectionChange: (integrationUuids: string[]) => void;
  onToolkitSelectionChange: (toolkitSlugs: string[]) => void;
}

export const ConversationToolsMenu: FC<ConversationToolsMenuProps> = ({
  integrations,
  toolkits,
  selectedIntegrationUuids,
  selectedToolkitSlugs,
  onIntegrationSelectionChange,
  onToolkitSelectionChange,
}) => {
  const toolIntegrations = useMemo(() => getToolEligibleIntegrations(integrations), [integrations]);
  const toolToolkits = useMemo(() => getToolEligibleToolkits(toolkits), [toolkits]);

  if (toolIntegrations.length === 0 && toolToolkits.length === 0) {
    return null;
  }

  return (
    <div className="max-h-[min(340px,55dvh)] w-[280px] overflow-y-auto p-1">
      {toolToolkits.length > 0 ? (
        <div className="pb-1">
          <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-muted">Integrations</div>
          {toolToolkits.map((toolkit) => (
            <ToolkitToolRow
              key={toolkit.slug}
              toolkit={toolkit}
              selected={selectedToolkitSlugs.includes(toolkit.slug)}
              onSelect={() => {
                const isSelected = selectedToolkitSlugs.includes(toolkit.slug);
                onToolkitSelectionChange(
                  isSelected
                    ? selectedToolkitSlugs.filter((item) => item !== toolkit.slug)
                    : [...selectedToolkitSlugs, toolkit.slug],
                );
              }}
            />
          ))}
        </div>
      ) : null}

      {toolIntegrations.length > 0 ? (
        <div className="border-t border-border pt-1">
          <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-muted">Custom integrations</div>
          <IntegrationToolsList
            integrations={integrations}
            mode="multiple"
            selectedUuids={selectedIntegrationUuids}
            className="max-h-none p-0"
            onSelect={(uuid) => {
              const isSelected = selectedIntegrationUuids.includes(uuid);
              onIntegrationSelectionChange(
                isSelected
                  ? selectedIntegrationUuids.filter((item) => item !== uuid)
                  : [...selectedIntegrationUuids, uuid],
              );
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export function getToolEligibleToolkits(toolkits: IntegrationAppsToolkit[]): IntegrationAppsToolkit[] {
  return toolkits.filter((toolkit) => toolkit.is_org_enabled && toolkit.tool_count > 0);
}

function ToolkitToolRow({
  toolkit,
  selected,
  onSelect,
}: {
  toolkit: IntegrationAppsToolkit;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={cn(
        'flex w-full min-w-0 items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors',
        selected && 'bg-accent/12',
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      {toolkit.logo_url ? (
        <img src={toolkit.logo_url} alt="" className="h-5 w-5 shrink-0 rounded bg-background object-contain" />
      ) : (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent text-[10px] font-semibold text-accent-foreground">
          {toolkit.name.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className={cn('min-w-0 flex-1 truncate text-xs', selected ? 'font-medium text-foreground' : 'text-muted')}>
        {toolkit.name}
      </span>
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
          selected ? 'border-accent bg-accent text-background' : 'border-border bg-transparent',
        )}
      >
        {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </span>
    </button>
  );
}
