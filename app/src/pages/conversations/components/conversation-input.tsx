import { useRef, type FC } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConversationAttachMenu } from './conversation-attach-menu';
import type { ComposioToolkit } from '@/features/composio/interfaces/composio.interface';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';
import {
  ConversationDraftEditor,
  draftPartsToPlainText,
  getDraftIntegrationUuids,
  type DraftPart,
} from './conversation-draft-editor';

interface AttachedFile {
  file: File;
  uuid?: string;
}

interface ConversationInputProps {
  draftParts: DraftPart[];
  attachedFiles: AttachedFile[];
  integrations: Integration[];
  toolkits: ComposioToolkit[];
  selectedIntegrationUuids: string[];
  selectedToolkitSlugs: string[];
  disabled: boolean;
  isUploading: boolean;
  onDraftPartsChange: (parts: DraftPart[]) => void;
  onSend: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (file: File) => void;
  onIntegrationSelectionChange: (integrationUuids: string[]) => void;
  onToolkitSelectionChange: (toolkitSlugs: string[]) => void;
}

export const ConversationInput: FC<ConversationInputProps> = ({
  draftParts,
  attachedFiles,
  integrations,
  toolkits,
  selectedIntegrationUuids,
  selectedToolkitSlugs,
  disabled,
  isUploading,
  onDraftPartsChange,
  onSend,
  onFileSelect,
  onRemoveFile,
  onIntegrationSelectionChange,
  onToolkitSelectionChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canSend =
    (draftPartsToPlainText(draftParts).length > 0 || getDraftIntegrationUuids(draftParts).length > 0) && !disabled;

  return (
    <div className="shrink-0 min-w-0 border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-4">
      {attachedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachedFiles.map((f) => (
            <span
              key={f.file.name + f.file.lastModified}
              className="flex items-center gap-1 rounded-full border border-border bg-surface-secondary px-2.5 py-1 text-xs text-foreground"
            >
              {f.uuid ? f.file.name : `${f.file.name} (uploading...)`}
              <button
                type="button"
                onClick={() => onRemoveFile(f.file)}
                className="ml-0.5 text-muted hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <form
        className="flex items-end gap-2 rounded-2xl border border-border bg-surface-secondary px-3 py-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSend) onSend();
        }}
      >
        <input ref={fileInputRef} type="file" className="hidden" onChange={onFileSelect} />
        <ConversationAttachMenu
          integrations={integrations}
          toolkits={toolkits}
          selectedIntegrationUuids={selectedIntegrationUuids}
          selectedToolkitSlugs={selectedToolkitSlugs}
          disabled={disabled || isUploading}
          onUpload={() => fileInputRef.current?.click()}
          onIntegrationSelectionChange={onIntegrationSelectionChange}
          onToolkitSelectionChange={onToolkitSelectionChange}
        />

        <ConversationDraftEditor
          parts={draftParts}
          integrations={integrations}
          disabled={disabled}
          placeholder="Message Cortex..."
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
      </form>

      <p className="mt-2 px-1 text-[11px] leading-relaxed text-muted">
        Type <span className="font-medium text-foreground/70">/</span> to add integrations to this message. Repeat to add more.
        Open <span className="font-medium text-foreground/70">+</span> → Tools to set defaults when no badges are added.
      </p>
    </div>
  );
};
