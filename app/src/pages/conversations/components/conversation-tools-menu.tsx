import { useMemo, type FC } from 'react';
import type { Selection } from '@heroui/react';
import { Dropdown, Label } from '@heroui/react';
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

interface ConversationToolsMenuProps {
  integrations: Integration[];
  selectedIntegrationUuids: string[];
  onSelectionChange: (integrationUuids: string[]) => void;
}

export const ConversationToolsMenu: FC<ConversationToolsMenuProps> = ({
  integrations,
  selectedIntegrationUuids,
  onSelectionChange,
}) => {
  const toolIntegrations = useMemo(() => getToolEligibleIntegrations(integrations), [integrations]);

  const sortedIntegrations = useMemo(
    () =>
      [...toolIntegrations].sort((a, b) => {
        const providerCompare = (providerLabels[a.provider] ?? a.provider).localeCompare(
          providerLabels[b.provider] ?? b.provider,
        );
        return providerCompare !== 0 ? providerCompare : a.name.localeCompare(b.name);
      }),
    [toolIntegrations],
  );

  const selectedKeys = useMemo<Selection>(
    () => new Set(selectedIntegrationUuids),
    [selectedIntegrationUuids],
  );

  if (toolIntegrations.length === 0) {
    return null;
  }

  return (
    <Dropdown.Menu
      className="max-h-[min(280px,45dvh)] w-[260px] overflow-y-auto p-1"
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      onSelectionChange={(keys) => {
        if (keys === 'all') {
          onSelectionChange(toolIntegrations.map((integration) => integration.uuid));
          return;
        }

        onSelectionChange(Array.from(keys as Set<string>));
      }}
    >
      {sortedIntegrations.map((integration) => {
        const iconMeta = PROVIDER_ICON_META[integration.provider];
        const Icon = iconMeta?.icon;
        const isSelected = selectedIntegrationUuids.includes(integration.uuid);
        const providerLabel = providerLabels[integration.provider] ?? integration.provider;

        return (
          <Dropdown.Item
            key={integration.uuid}
            id={integration.uuid}
            textValue={providerLabel}
            className={cn('rounded-md px-1.5 py-1.5', isSelected && 'bg-accent/12')}
          >
            <div className="flex w-full min-w-0 items-center gap-2">
              {Icon ? (
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-white"
                  style={{ backgroundColor: iconMeta.bg }}
                >
                  <Icon size={12} />
                </span>
              ) : null}
              <Label
                className={cn(
                  'min-w-0 flex-1 truncate text-xs',
                  isSelected ? 'font-medium text-foreground' : 'text-muted',
                )}
              >
                {providerLabel}
              </Label>
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
            </div>
          </Dropdown.Item>
        );
      })}
    </Dropdown.Menu>
  );
};
