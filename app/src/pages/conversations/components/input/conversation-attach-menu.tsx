import { useMemo, type FC } from 'react';
import { Button, Dropdown, Label } from '@heroui/react';
import { Paperclip, Plus, Settings2, Sparkles } from 'lucide-react';
import type { IntegrationAppsToolkit } from '@/features/integration-apps/interfaces/integrationApps.interface';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import type { AiProvider } from '@/features/ai-providers/interfaces/ai-providers.interfaces';
import type { AiProviderType } from '@/features/integrations/constants/ai-provider-types';
import { aiProviderModelOptions } from '@/features/integrations/constants/provider-metadata';
import { cn } from '@/lib/utils';
import { buildConversationToolItems } from './conversation-tool-items.utils';
import { ConversationToolsMenu } from './conversation-tools-menu';
import { ConversationModelMenu } from './conversation-model-menu';

import type { ToolkitBinding } from '../../utils/conversation-toolkit-bindings.utils';

interface ConversationAttachMenuProps {
  integrations: Integration[];
  toolkits: IntegrationAppsToolkit[];
  selectedIntegrationUuids: string[];
  selectedToolkitBindings: ToolkitBinding[];
  aiProviders: AiProvider[];
  selectedProvider?: string | null;
  selectedModel?: string | null;
  disabled?: boolean;
  onUpload: () => void;
  onIntegrationSelectionChange: (integrationUuids: string[]) => void;
  onToolkitSelectionChange: (toolkitBindings: ToolkitBinding[]) => void;
  onModelSelect: (provider: AiProviderType, model: string) => void;
}

function getModelLabel(provider?: string | null, model?: string | null): string | null {
  if (!provider || !model) {
    return null;
  }
  const options = aiProviderModelOptions[provider as AiProviderType];
  const matched = options?.find((option) => option.value === model);
  return matched?.label ?? model;
}

export const ConversationAttachMenu: FC<ConversationAttachMenuProps> = ({
  integrations,
  toolkits,
  selectedIntegrationUuids,
  selectedToolkitBindings,
  aiProviders,
  selectedProvider,
  selectedModel,
  disabled = false,
  onUpload,
  onIntegrationSelectionChange,
  onToolkitSelectionChange,
  onModelSelect,
}) => {
  const totalToolCount = useMemo(
    () => buildConversationToolItems(integrations, toolkits).length,
    [integrations, toolkits],
  );
  const selectedToolCount = selectedIntegrationUuids.length + selectedToolkitBindings.length;
  const hasPartialToolSelection =
    totalToolCount > 0 && selectedToolCount < totalToolCount;
  const selectedModelLabel = getModelLabel(selectedProvider, selectedModel);

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
        className="z-50 min-w-[248px] overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-lg"
      >
        <Dropdown.Menu
          onAction={(key) => {
            if (key === 'upload') {
              onUpload();
            }
          }}
        >
          <Dropdown.Item id="upload" textValue="Upload photos and files" className="gap-2.5 rounded-lg px-2 py-2">
            <Paperclip className="h-4 w-4 shrink-0 text-muted" />
            <Label className="min-w-0 flex-1 truncate text-sm">Upload photos & files</Label>
          </Dropdown.Item>

          {totalToolCount > 0 ? (
            <Dropdown.SubmenuTrigger>
              <Dropdown.Item
                id="tools"
                textValue="Tools"
                className="gap-2.5 rounded-lg px-2 py-2 pe-9"
              >
                <Settings2 className="h-4 w-4 shrink-0 text-muted" />
                <Label className="min-w-0 flex-1 truncate text-sm">Tools</Label>
                {hasPartialToolSelection ? (
                  <span className="shrink-0 tabular-nums text-[11px] leading-none text-muted">
                    <span>{selectedToolCount}</span>
                    <span aria-hidden="true">/</span>
                    <span>{totalToolCount}</span>
                  </span>
                ) : null}
                <Dropdown.SubmenuIndicator className="h-4 w-4 shrink-0 text-muted" />
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

          <Dropdown.SubmenuTrigger>
            <Dropdown.Item
              id="model"
              textValue="Model"
              className="gap-2.5 rounded-lg px-2 py-2 pe-9"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-muted" />
              <Label className="min-w-0 flex-1 truncate text-sm">Model</Label>
              {selectedModelLabel ? (
                <span className="max-w-[96px] shrink-0 truncate text-[11px] text-muted">
                  {selectedModelLabel}
                </span>
              ) : null}
              <Dropdown.SubmenuIndicator className="h-4 w-4 shrink-0 text-muted" />
            </Dropdown.Item>
            <Dropdown.Popover className="z-50 overflow-hidden rounded-xl border border-border bg-surface p-0 shadow-lg">
              <ConversationModelMenu
                aiProviders={aiProviders}
                selectedProvider={selectedProvider}
                selectedModel={selectedModel}
                onSelect={onModelSelect}
              />
            </Dropdown.Popover>
          </Dropdown.SubmenuTrigger>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
