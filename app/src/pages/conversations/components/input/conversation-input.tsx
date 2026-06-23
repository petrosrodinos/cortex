import { useRef, type FC, type Ref } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConversationAttachMenu } from './conversation-attach-menu';
import { ConversationReplyPreview } from './conversation-reply-preview';
import type { ConversationReplyTarget } from '../../utils/conversation-reply.utils';
import type { IntegrationAppsToolkit } from '@/features/integration-apps/interfaces/integrationApps.interface';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import type { AiProvider } from '@/features/ai-providers/interfaces/ai-providers.interfaces';
import type { AiProviderType } from '@/features/integrations/constants/ai-provider-types';
import {
  ConversationDraftEditor,
  draftPartsToPlainText,
  type ConversationDraftEditorHandle,
  type DraftPart,
} from './conversation-draft-editor';

export interface AttachedFile {
  id: string;
  file?: File;
  uuid?: string;
  url?: string;
  filename: string;
  mimetype?: string;
}

import type { IntegrationAppsConnectionTier } from '@/features/integration-apps/interfaces/integrationApps.interface';
import type { ToolkitBinding } from '../../utils/conversation-toolkit-bindings.utils';

interface ConversationInputProps {
  draftParts: DraftPart[];
  attachedFiles: AttachedFile[];
  replyTarget: ConversationReplyTarget | null;
  integrations: Integration[];
  toolkits: IntegrationAppsToolkit[];
  selectedIntegrationUuids: string[];
  selectedToolkitBindings: ToolkitBinding[];
  aiProviders: AiProvider[];
  selectedProvider?: string | null;
  selectedModel?: string | null;
  disabled: boolean;
  isUploading: boolean;
  draftEditorRef?: Ref<ConversationDraftEditorHandle>;
  onDraftPartsChange: (parts: DraftPart[]) => void;
  onDismissReply: () => void;
  onSend: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (id: string) => void;
  onIntegrationSelectionChange: (integrationUuids: string[]) => void;
  onToolkitSelectionChange: (toolkitBindings: ToolkitBinding[]) => void;
  onModelSelect: (provider: AiProviderType, model: string) => void;
}

export const ConversationInput: FC<ConversationInputProps> = ({
  draftParts,
  attachedFiles,
  replyTarget,
  integrations,
  toolkits,
  selectedIntegrationUuids,
  selectedToolkitBindings,
  aiProviders,
  selectedProvider,
  selectedModel,
  disabled,
  isUploading,
  draftEditorRef,
  onDraftPartsChange,
  onDismissReply,
  onSend,
  onFileSelect,
  onRemoveFile,
  onIntegrationSelectionChange,
  onToolkitSelectionChange,
  onModelSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftText = draftPartsToPlainText(draftParts);
  const hasReplyQuote = Boolean(replyTarget?.quotedText.trim());
  const canSend = (draftText.length > 0 || hasReplyQuote) && !disabled;

  return (
    <div className="shrink-0 min-w-0 border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-4">
      {attachedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachedFiles.map((attachment) => (
            <span
              key={attachment.id}
              className="flex items-center gap-1 rounded-full border border-border bg-surface-secondary px-2.5 py-1 text-xs text-foreground"
            >
              {attachment.uuid ? attachment.filename : `${attachment.filename} (uploading...)`}
              <button
                type="button"
                onClick={() => onRemoveFile(attachment.id)}
                className="ml-0.5 text-muted hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <form
        className="rounded-2xl border border-border bg-surface-secondary"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSend) onSend();
        }}
      >
        {replyTarget ? (
          <ConversationReplyPreview reply={replyTarget} onDismiss={onDismissReply} embedded />
        ) : null}

        <div className="flex items-end gap-2 px-3 py-2">
          <input ref={fileInputRef} type="file" className="hidden" onChange={onFileSelect} />
          <ConversationAttachMenu
            integrations={integrations}
            toolkits={toolkits}
            selectedIntegrationUuids={selectedIntegrationUuids}
            selectedToolkitBindings={selectedToolkitBindings}
            aiProviders={aiProviders}
            selectedProvider={selectedProvider}
            selectedModel={selectedModel}
            disabled={disabled || isUploading}
            onUpload={() => fileInputRef.current?.click()}
            onIntegrationSelectionChange={onIntegrationSelectionChange}
            onToolkitSelectionChange={onToolkitSelectionChange}
            onModelSelect={onModelSelect}
          />

          <ConversationDraftEditor
            ref={draftEditorRef}
            parts={draftParts}
            integrations={integrations}
            toolkits={toolkits}
            disabled={disabled}
            placeholder={replyTarget ? 'Write a reply...' : 'Message Cortex...'}
            onPartsChange={onDraftPartsChange}
            onSend={() => {
              if (canSend) onSend();
            }}
          />

          <button
            type="submit"
            disabled={!canSend}
            className={cn(
              'mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
              canSend
                ? 'bg-foreground text-background hover:opacity-90'
                : 'bg-surface text-muted cursor-not-allowed',
            )}
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </form>

      <p className="mt-2 px-1 text-[11px] leading-relaxed text-muted">
        Type <span className="font-medium text-foreground/70">/</span> to add tools to this message. Repeat to add more.
        Open <span className="font-medium text-foreground/70">+</span> → Tools to set defaults when no badges are added.
      </p>
    </div>
  );
};
