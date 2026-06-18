import { useRef, type FC } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConversationAttachMenu } from './conversation-attach-menu';
import type { Integration } from '@/features/integrations/common/interfaces/integration.interface';

interface AttachedFile {
  file: File;
  uuid?: string;
}

interface ConversationInputProps {
  draft: string;
  attachedFiles: AttachedFile[];
  integrations: Integration[];
  selectedIntegrationUuids: string[];
  disabled: boolean;
  isUploading: boolean;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (file: File) => void;
  onIntegrationSelectionChange: (integrationUuids: string[]) => void;
}

export const ConversationInput: FC<ConversationInputProps> = ({
  draft,
  attachedFiles,
  integrations,
  selectedIntegrationUuids,
  disabled,
  isUploading,
  onDraftChange,
  onSend,
  onFileSelect,
  onRemoveFile,
  onIntegrationSelectionChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canSend = draft.trim().length > 0 && !disabled;

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
          selectedIntegrationUuids={selectedIntegrationUuids}
          disabled={disabled || isUploading}
          onUpload={() => fileInputRef.current?.click()}
          onIntegrationSelectionChange={onIntegrationSelectionChange}
        />

        <textarea
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              if (canSend) onSend();
            }
          }}
          placeholder="Message Cortex..."
          disabled={disabled}
          rows={1}
          className="max-h-40 min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted disabled:opacity-50"
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
    </div>
  );
};
