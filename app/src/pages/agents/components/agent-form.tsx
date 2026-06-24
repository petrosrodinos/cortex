import { useState } from 'react';
import { Input, Label, Switch, TextArea, TextField } from '@heroui/react';
import { AgentCronPresets } from '@/features/agents/interfaces/agents.interfaces';
import type { AgentFormValues } from '@/features/agents/validation-schemas/agent.schema';
import { CronScheduleBuilder } from './cron-schedule-builder';

type AgentFormProps = {
  initialValues?: Partial<AgentFormValues>;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: AgentFormValues) => void;
  onCancel?: () => void;
};

export function AgentForm({
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: AgentFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [prompt, setPrompt] = useState(initialValues?.prompt ?? '');
  const [isEnabled, setIsEnabled] = useState(initialValues?.is_enabled ?? true);
  const [cronExpression, setCronExpression] = useState(
    initialValues?.cron_expression ?? AgentCronPresets.DAILY_9AM,
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedPrompt = prompt.trim();
    const trimmedCron = cronExpression.trim();

    if (!trimmedTitle) {
      setError('Title is required');
      return;
    }
    if (!trimmedPrompt) {
      setError('Prompt is required');
      return;
    }
    if (!trimmedCron) {
      setError('Schedule is required');
      return;
    }

    const parts = trimmedCron.split(/\s+/);
    if (parts.length !== 5) {
      setError('Invalid cron expression — must have exactly 5 fields');
      return;
    }

    onSubmit({
      title: trimmedTitle,
      prompt: trimmedPrompt,
      cron_expression: trimmedCron,
      is_enabled: isEnabled,
    });
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <TextField value={title} onChange={setTitle} fullWidth>
        <Label>Title</Label>
        <Input placeholder="Daily sales summary" />
      </TextField>

      <TextField value={prompt} onChange={setPrompt} fullWidth>
        <Label>Prompt</Label>
        <TextArea placeholder="Summarize yesterday's sales and highlight anomalies." rows={4} />
      </TextField>

      <div className="grid gap-1.5">
        <span className="text-sm font-medium text-foreground">Schedule</span>
        <CronScheduleBuilder
          defaultValue={cronExpression}
          onChange={setCronExpression}
        />
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
        <div>
          <div className="text-sm font-medium text-foreground">Enabled</div>
          <div className="text-xs text-muted">Run this agent on the configured schedule</div>
        </div>
        <Switch isSelected={isEnabled} onChange={setIsEnabled}>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch>
      </div>

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
