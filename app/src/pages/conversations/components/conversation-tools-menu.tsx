import { useMemo, type FC } from 'react';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import {
  IntegrationStatuses,
} from '@/features/integrations/common/interfaces/integration.interface';
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
  selectedIntegrationUuids: string[];
  onSelectionChange: (integrationUuids: string[]) => void;
}

export const ConversationToolsMenu: FC<ConversationToolsMenuProps> = ({
  integrations,
  selectedIntegrationUuids,
  onSelectionChange,
}) => {
  const toolIntegrations = useMemo(() => getToolEligibleIntegrations(integrations), [integrations]);

  if (toolIntegrations.length === 0) {
    return null;
  }

  return (
    <IntegrationToolsList
      integrations={integrations}
      mode="multiple"
      selectedUuids={selectedIntegrationUuids}
      className="max-h-[min(280px,45dvh)] w-[260px]"
      onSelect={(uuid) => {
        const isSelected = selectedIntegrationUuids.includes(uuid);
        onSelectionChange(
          isSelected
            ? selectedIntegrationUuids.filter((item) => item !== uuid)
            : [...selectedIntegrationUuids, uuid],
        );
      }}
    />
  );
};
