import { useMemo, type FC } from 'react';
import type { IntegrationAppsToolkit } from '@/features/integration-apps/interfaces/integrationApps.interface';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import { buildConversationToolItems } from './conversation-tool-items.utils';
import { ConversationToolsList } from './conversation-tools-list';

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
  const items = useMemo(
    () => buildConversationToolItems(integrations, toolkits),
    [integrations, toolkits],
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-h-[min(340px,55dvh)] w-[280px] overflow-y-auto p-1">
      <ConversationToolsList
        integrations={integrations}
        toolkits={toolkits}
        mode="multiple"
        selectedIntegrationUuids={selectedIntegrationUuids}
        selectedToolkitSlugs={selectedToolkitSlugs}
        className="max-h-none p-0"
        onSelect={(item) => {
          if (item.kind === 'integration') {
            const uuid = item.integration.uuid;
            const isSelected = selectedIntegrationUuids.includes(uuid);
            onIntegrationSelectionChange(
              isSelected
                ? selectedIntegrationUuids.filter((value) => value !== uuid)
                : [...selectedIntegrationUuids, uuid],
            );
            return;
          }

          const slug = item.toolkit.slug;
          const isSelected = selectedToolkitSlugs.includes(slug);
          onToolkitSelectionChange(
            isSelected
              ? selectedToolkitSlugs.filter((value) => value !== slug)
              : [...selectedToolkitSlugs, slug],
          );
        }}
      />
    </div>
  );
};
