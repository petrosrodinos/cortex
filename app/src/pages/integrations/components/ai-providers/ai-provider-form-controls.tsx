import type { AiProviderType } from '@/features/integrations/constants/ai-provider-types';
import { aiProviderModelOptions } from '@/features/integrations/constants/provider-metadata';
import { cn } from '@/lib/utils';

const selectClassName =
  'h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent';

interface AiProviderModelSelectProps {
  provider: AiProviderType;
  value: string;
  onChange: (value: string) => void;
}

export function AiProviderModelSelect({ provider, value, onChange }: AiProviderModelSelectProps) {
  const options = aiProviderModelOptions[provider];
  const hasCurrentValue = options.some((option) => option.value === value);

  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-foreground">Default model</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={selectClassName}
      >
        {!hasCurrentValue && value ? <option value={value}>{value}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface DefaultAiProviderToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function DefaultAiProviderToggle({ checked, onChange, disabled = false }: DefaultAiProviderToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-foreground">Set as default AI provider</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label="Set as default AI provider"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors',
          checked ? 'bg-accent' : 'bg-border',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <span
          className={cn(
            'pointer-events-none block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform',
            checked && 'translate-x-4',
          )}
        />
      </button>
    </div>
  );
}
