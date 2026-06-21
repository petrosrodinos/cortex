import { useMemo, type FC } from 'react';
import { Button, Dropdown, Label } from '@heroui/react';
import { Paperclip, Plus, Settings2 } from 'lucide-react';
import type { IntegrationAppsToolkit } from '@/features/integration-apps/interfaces/integrationApps.interface';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import { cn } from '@/lib/utils';
import { buildConversationToolItems } from './conversation-tool-items.utils';
import { ConversationToolsMenu } from './conversation-tools-menu';

import type { ToolkitBinding } from '../../utils/conversation-toolkit-bindings.utils';

interface ConversationAttachMenuProps {
  integrations: Integration[];
  toolkits: IntegrationAppsToolkit[];
  selectedIntegrationUuids: string[];
  selectedToolkitBindings: ToolkitBinding[];
  disabled?: boolean;
  onUpload: () => void;
  onIntegrationSelectionChange: (integrationUuids: string[]) => void;
  onToolkitSelectionChange: (toolkitBindings: ToolkitBinding[]) => void;
}

export const ConversationAttachMenu: FC<ConversationAttachMenuProps> = ({
  integrations,
  toolkits,
  selectedIntegrationUuids,
  selectedToolkitBindings,
  disabled = false,
  onUpload,
  onIntegrationSelectionChange,
  onToolkitSelectionChange,
}) => {
  const totalToolCount = useMemo(
    () => buildConversationToolItems(integrations, toolkits).length,
    [integrations, toolkits],
  );
  const selectedToolCount = selectedIntegrationUuids.length + selectedToolkitBindings.length;
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
              <Dropdown.Item
                id="tools"
                textValue="Tools"
                className={cn(
                  'grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-2 rounded-lg px-2 py-2',
                  hasPartialToolSelection && 'pr-1',
                )}
              >
                <Settings2 className="h-4 w-4 shrink-0 text-muted" />
                <Label className="min-w-0 text-sm">Tools</Label>
                {hasPartialToolSelection ? (
                  <span className="shrink-0 tabular-nums text-[11px] leading-none text-muted">
                    <span>{selectedToolCount}</span>
                    <span aria-hidden="true">/</span>
                    <span>{totalToolCount}</span>
                  </span>
                ) : (
                  <span aria-hidden="true" className="w-0" />
                )}
                <Dropdown.SubmenuIndicator className="shrink-0" />
              </Dropdown.Item>
              <Dropdown.Popover className="z-50 overflow-hidden rounded-xl border border-border bg-surface p-0 shadow-lg">
                <ConversationToolsMenu
                  integrations={integrations}
                  toolkits={toolkits}
                  selectedIntegrationUuids={selectedIntegrationUuids}
                  selectedToolkitBindings={selectedToolkitBindings}
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
