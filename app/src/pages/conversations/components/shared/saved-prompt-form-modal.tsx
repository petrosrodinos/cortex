import { useState } from 'react';
import { X } from 'lucide-react';
import { Input, Label, TextArea, TextField } from '@heroui/react';
import type { SavedPromptFormValues } from '@/features/saved-prompts/validation-schemas/saved-prompt.schema';

type SavedPromptFormModalProps = {
  mode: 'create' | 'edit';
  formKey?: string;
  initialValues?: Partial<SavedPromptFormValues>;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: SavedPromptFormValues) => void;
};

export function SavedPromptFormModal({
  mode,
  formKey,
  initialValues,
  isSubmitting,
  onClose,
  onSubmit,
}: SavedPromptFormModalProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError('Title is required');
      return;
    }

    if (!trimmedContent) {
      setError('Prompt content is required');
      return;
    }

    onSubmit({ title: trimmedTitle, content: trimmedContent });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {mode === 'create' ? 'Save prompt' : 'Edit prompt'}
            </h2>
            <p className="text-sm text-muted">
              Store a reusable prompt for this organization.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-surface-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form key={formKey ?? mode} className="grid gap-4" onSubmit={handleSubmit}>
          <TextField value={title} onChange={setTitle} fullWidth>
            <Label>Title</Label>
            <Input placeholder="Weekly report summary" />
          </TextField>

          <TextField value={content} onChange={setContent} fullWidth>
            <Label>Prompt</Label>
            <TextArea placeholder="Describe what you want the assistant to do…" rows={6} />
          </TextField>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:bg-surface-secondary hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving…' : mode === 'create' ? 'Save prompt' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
