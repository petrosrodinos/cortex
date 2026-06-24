import { useEffect, useMemo, useState } from 'react';
import {
  AgentCronPresetLabels,
  AgentCronPresets,
  type AgentCronPreset,
} from '@/features/agents/interfaces/agents.interfaces';
import type { AgentFormValues } from '@/features/agents/validation-schemas/agent.schema';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const presetOptions = Object.entries(AgentCronPresetLabels) as Array<
  [AgentCronPreset, string]
>;

function resolvePresetFromExpression(expression: string): AgentCronPreset {
  const match = presetOptions.find(([value]) => value === expression.trim());
  return match ? match[0] : AgentCronPresets.CUSTOM;
}

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
  const [preset, setPreset] = useState<AgentCronPreset>(() =>
    resolvePresetFromExpression(initialValues?.cron_expression ?? AgentCronPresets.DAILY_9AM),
  );
  const [customCron, setCustomCron] = useState(
    initialValues?.cron_expression ?? AgentCronPresets.DAILY_9AM,
  );
  const [error, setError] = useState<string | null>(null);

  const cronExpression = useMemo(
    () => (preset === AgentCronPresets.CUSTOM ? customCron.trim() : preset),
    [preset, customCron],
  );

  useEffect(() => {
    if (!initialValues) {
      return;
    }
    setTitle(initialValues.title ?? '');
    setPrompt(initialValues.prompt ?? '');
    setIsEnabled(initialValues.is_enabled ?? true);
    const nextPreset = resolvePresetFromExpression(
      initialValues.cron_expression ?? AgentCronPresets.DAILY_9AM,
    );
    setPreset(nextPreset);
    setCustomCron(initialValues.cron_expression ?? AgentCronPresets.DAILY_9AM);
  }, [initialValues]);

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
      setError('Cron expression must have exactly 5 fields');
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
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Title</span>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Daily sales summary"
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Prompt</span>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Summarize yesterday's sales and highlight anomalies."
          rows={5}
          className={cn(
            'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground',
            'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-violet-500',
          )}
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-foreground">Schedule</span>
        <select
          value={preset}
          onChange={(event) => {
            const next = event.target.value as AgentCronPreset;
            setPreset(next);
            if (next !== AgentCronPresets.CUSTOM) {
              setCustomCron(next);
            }
          }}
          className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground"
        >
          {presetOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
          <option value={AgentCronPresets.CUSTOM}>Custom cron</option>
        </select>
      </label>

      {preset === AgentCronPresets.CUSTOM ? (
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Cron expression</span>
          <Input
            value={customCron}
            onChange={(event) => setCustomCron(event.target.value)}
            placeholder="0 9 * * *"
          />
          <span className="text-xs text-muted">5-field cron: minute hour day month weekday</span>
        </label>
      ) : null}

      <label className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm">
        <div>
          <div className="font-medium text-foreground">Enabled</div>
          <div className="text-xs text-muted">Run this agent on the configured schedule</div>
        </div>
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(event) => setIsEnabled(event.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
      </label>

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
