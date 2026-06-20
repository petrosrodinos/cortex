import { useMemo, type FC } from 'react';
import { Button, Dropdown, Label } from '@heroui/react';
import { Paperclip, Plus, Settings2 } from 'lucide-react';
import type { ComposioToolkit } from '@/features/composio/interfaces/composio.interface';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import { cn } from '@/lib/utils';
import {
  ConversationToolsMenu,
  getToolEligibleIntegrations,
  getToolEligibleToolkits,
} from './conversation-tools-menu';

interface ConversationAttachMenuProps {
  integrations: Integration[];
  toolkits: ComposioToolkit[];
  selectedIntegrationUuids: string[];
  selectedToolkitSlugs: string[];
  disabled?: boolean;
  onUpload: () => void;
  onIntegrationSelectionChange: (integrationUuids: string[]) => void;
  onToolkitSelectionChange: (toolkitSlugs: string[]) => void;
}

export const ConversationAttachMenu: FC<ConversationAttachMenuProps> = ({
  integrations,
  toolkits,
  selectedIntegrationUuids,
  selectedToolkitSlugs,
  disabled = false,
  onUpload,
  onIntegrationSelectionChange,
  onToolkitSelectionChange,
}) => {
  const toolIntegrations = useMemo(() => getToolEligibleIntegrations(integrations), [integrations]);
  const toolToolkits = useMemo(() => getToolEligibleToolkits(toolkits), [toolkits]);
  const totalToolCount = toolIntegrations.length + toolToolkits.length;
  const selectedToolCount = selectedIntegrationUuids.length + selectedToolkitSlugs.length;
  const hasPartialToolSelection =
    totalToolCount > 0 && selectedToolCount < totalToolCount;

  return (
    <Dropdown>
      <Button
        aria-label="Add attachments and tools"
        variant="secondary"
        isDisabled={disabled}
        className={cn(
          'mb-0.5 h-8 w-8 min-w-8 shrink-0 rounded-full border-0 bg-transparent p-0 text-muted shadow-none',
          'hover:bg-surface hover:text-foreground data-[hover=true]:bg-surface',
          hasPartialToolSelection && 'text-foreground',
        )}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Dropdown.Popover
        placement="top start"
        offset={8}
        className="z-50 min-w-[220px] overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-lg"
      >
        <Dropdown.Menu
          onAction={(key) => {
            if (key === 'upload') {
              onUpload();
            }
          }}
        >
          <Dropdown.Item id="upload" textValue="Upload photos and files" className="rounded-lg px-2 py-2">
            <Paperclip className="h-4 w-4 shrink-0 text-muted" />
            <Label className="text-sm">Upload photos & files</Label>
          </Dropdown.Item>

          {totalToolCount > 0 ? (
            <Dropdown.SubmenuTrigger>
              <Dropdown.Item id="tools" textValue="Tools" className="rounded-lg px-2 py-2">
                <Settings2 className="h-4 w-4 shrink-0 text-muted" />
                <Label className="flex-1 text-sm">Tools</Label>
                {hasPartialToolSelection ? (
                  <span className="text-[11px] text-muted">
                    {selectedToolCount}/{totalToolCount}
                  </span>
                ) : null}
                <Dropdown.SubmenuIndicator />
              </Dropdown.Item>
              <Dropdown.Popover className="z-50 overflow-hidden rounded-xl border border-border bg-surface p-0 shadow-lg">
                <ConversationToolsMenu
                  integrations={integrations}
                  toolkits={toolkits}
                  selectedIntegrationUuids={selectedIntegrationUuids}
                  selectedToolkitSlugs={selectedToolkitSlugs}
                  onIntegrationSelectionChange={onIntegrationSelectionChange}
                  onToolkitSelectionChange={onToolkitSelectionChange}
                />
              </Dropdown.Popover>
            </Dropdown.SubmenuTrigger>
          ) : null}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
