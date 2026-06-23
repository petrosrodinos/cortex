import { useMemo } from 'react';
import type { Selection } from '@heroui/react';
import { Button, Dropdown, Input, Label, Switch } from '@heroui/react';
import { ChevronsUpDown } from 'lucide-react';
import type { AiProviderType } from '@/features/integrations/constants/ai-provider-types';
import { aiProviderModelOptions } from '@/features/integrations/constants/provider-metadata';

interface AiProviderModelSelectProps {
  provider: AiProviderType;
  value: string;
  onChange: (value: string) => void;
}

export function AiProviderModelSelect({ provider, value, onChange }: AiProviderModelSelectProps) {
  const options = aiProviderModelOptions[provider];
  const hasCurrentValue = options.some((option) => option.value === value);
  const displayOptions = useMemo(
    () =>
      !hasCurrentValue && value
        ? [{ value, label: value }, ...options]
        : options,
    [hasCurrentValue, options, value],
  );
  const selectedOption = displayOptions.find((option) => option.value === value);
  const selectedKeys = useMemo<Selection>(() => new Set(value ? [value] : []), [value]);

  return (
    <div className="flex flex-col gap-1">
      <Label>Default model</Label>
      <Dropdown>
        <Button
          aria-label="Select default model"
          variant="secondary"
          className="h-10 w-full justify-between rounded-field border border-border bg-surface px-3 text-sm font-normal text-foreground shadow-none"
        >
          <span className="truncate">{selectedOption?.label ?? 'Select model'}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted" />
        </Button>
        <Dropdown.Popover className="z-[110] min-w-[var(--trigger-width)]">
          <Dropdown.Menu
            selectedKeys={selectedKeys}
            selectionMode="single"
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string | undefined;
              if (!selectedKey) return;
              onChange(selectedKey);
            }}
          >
            {displayOptions.map((option) => (
              <Dropdown.Item
                key={option.value}
                id={option.value}
                textValue={option.label}
                className="rounded-lg"
              >
                <Dropdown.ItemIndicator />
                <Label>{option.label}</Label>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}

interface AiProviderApiKeyFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
}

export function AiProviderApiKeyField({
  value,
  onChange,
  label = 'API key',
  description,
}: AiProviderApiKeyFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      {description ? <p className="text-xs text-muted">{description}</p> : null}
      <Input
        type="password"
        fullWidth
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="sk-..."
        autoComplete="off"
      />
    </div>
  );
}

interface AiProviderUsageLimitsFieldsProps {
  usageLimitTokens: string;
  usageLimitCostUsd: string;
  onUsageLimitTokensChange: (value: string) => void;
  onUsageLimitCostUsdChange: (value: string) => void;
  optional?: boolean;
}

export function AiProviderUsageLimitsFields({
  usageLimitTokens,
  usageLimitCostUsd,
  onUsageLimitTokensChange,
  onUsageLimitCostUsdChange,
  optional = false,
}: AiProviderUsageLimitsFieldsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <Label>{optional ? 'Token limit (optional)' : 'Token limit'}</Label>
        <Input
          type="number"
          fullWidth
          value={usageLimitTokens}
          onChange={(event) => onUsageLimitTokensChange(event.target.value)}
          placeholder="1000000"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>{optional ? 'Cost limit USD (optional)' : 'Cost limit (USD)'}</Label>
        <Input
          type="number"
          fullWidth
          value={usageLimitCostUsd}
          onChange={(event) => onUsageLimitCostUsdChange(event.target.value)}
          placeholder="50"
        />
      </div>
    </div>
  );
}

interface DefaultAiProviderToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function DefaultAiProviderToggle({ checked, onChange, disabled = false }: DefaultAiProviderToggleProps) {
  return (
    <Switch isSelected={checked} onChange={onChange} isDisabled={disabled} className="w-full justify-between">
      <Switch.Content>
        <Label className="text-sm font-medium">Set as default AI provider</Label>
      </Switch.Content>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch>
  );
}
