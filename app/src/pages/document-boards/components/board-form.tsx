import { useState } from 'react';
import { Input, Label, TextField } from '@heroui/react';
import type { CreateDocumentBoardPayload } from '@/features/document-boards/interfaces/document-board.interfaces';

type BoardFormProps = {
  initialValues?: Partial<CreateDocumentBoardPayload>;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: CreateDocumentBoardPayload) => void;
  onCancel?: () => void;
};

export function BoardForm({
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: BoardFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Name is required');
      return;
    }

    onSubmit({ name: trimmedName, description: description.trim() || undefined });
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <TextField value={name} onChange={setName} fullWidth>
        <Label>Name</Label>
        <Input placeholder="Q1 Reports" />
      </TextField>

      <TextField value={description} onChange={setDescription} fullWidth>
        <Label>Description (optional)</Label>
        <Input placeholder="Shared documents for Q1 reporting" />
      </TextField>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-secondary"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
