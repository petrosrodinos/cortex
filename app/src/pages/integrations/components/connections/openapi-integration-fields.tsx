import { useMemo } from 'react';
import type { Control } from 'react-hook-form';
import type { Selection } from '@heroui/react';
import { Button, Dropdown, Input, Label, TextArea, TextField } from '@heroui/react';
import { CheckCircle2, ChevronsUpDown, FlaskConical } from 'lucide-react';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import type { CreateIntegrationFormData } from '@/features/integrations/validation-schemas/integration.schema';
import { openApiAuthLabels } from '@/features/integrations/constants/provider-metadata';
import {
  OpenApiAuthTypes,
  type OpenApiAuthType,
  type ParseOpenApiSpecResponse,
} from '@/features/integrations/openapi/interfaces/openapi.interface';
import { CustomHeadersEditor, type CustomHeaderPair } from './custom-headers-editor';
import {
  INTEGRATION_DROPDOWN_TRIGGER_CLASSNAME,
  INTEGRATION_INPUT_CLASSNAME,
  INTEGRATION_TEXTAREA_CLASSNAME,
} from './integration-field-styles';

const API_KEY_LOCATIONS = [
  { value: 'header', label: 'Header' },
  { value: 'query', label: 'Query parameter' },
];

interface OpenApiIntegrationFieldsProps {
  control: Control<CreateIntegrationFormData>;
  mode: 'url' | 'json';
  onModeChange: (mode: 'url' | 'json') => void;
  rawJson: string;
  onRawJsonChange: (value: string) => void;
  authType: OpenApiAuthType;
  onAuthTypeChange: (authType: OpenApiAuthType) => void;
  customHeaderPairs: CustomHeaderPair[];
  onCustomHeaderPairsChange: (pairs: CustomHeaderPair[]) => void;
  onParseSpec: () => void;
  parsePending: boolean;
  parseResult?: ParseOpenApiSpecResponse;
}

export function OpenApiIntegrationFields({
  control,
  mode,
  onModeChange,
  rawJson,
  onRawJsonChange,
  authType,
  onAuthTypeChange,
  customHeaderPairs,
  onCustomHeaderPairsChange,
  onParseSpec,
  parsePending,
  parseResult,
}: OpenApiIntegrationFieldsProps) {
  const authTypeKeys = useMemo<Selection>(() => new Set([authType]), [authType]);

  return (
    <div className="grid gap-3 rounded-lg border border-border p-3">
      <div className="flex flex-col gap-1">
        <Label>Spec source</Label>
        <div className="inline-flex w-full rounded-lg border border-border bg-background p-1 sm:w-auto">
          {(['url', 'json'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onModeChange(option)}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none sm:min-w-24',
                mode === option
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted hover:bg-surface-secondary hover:text-foreground',
              )}
            >
              {option === 'url' ? 'Paste URL' : 'Paste JSON'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'url' ? (
        <FormField
          control={control}
          name="config.specUrl"
          render={({ field }) => (
            <FormItem>
              <TextField
                name={field.name}
                value={(field.value as string | undefined) ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                fullWidth
              >
                <Label>Spec URL</Label>
                <Input
                  className={INTEGRATION_INPUT_CLASSNAME}
                  placeholder="https://api.example.com/openapi.json"
                  autoComplete="off"
                />
              </TextField>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <TextField value={rawJson} onChange={onRawJsonChange} fullWidth>
          <Label>OpenAPI JSON</Label>
          <TextArea
            className={INTEGRATION_TEXTAREA_CLASSNAME}
            rows={8}
            placeholder='{"openapi":"3.0.3","paths":{}}'
          />
        </TextField>
      )}

      <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="flex flex-col gap-1">
          <Label>Auth type</Label>
          <Dropdown>
            <Button
              aria-label="Select auth type"
              variant="secondary"
              className={INTEGRATION_DROPDOWN_TRIGGER_CLASSNAME}
            >
              <span className="truncate">{openApiAuthLabels[authType]}</span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted" />
            </Button>
            <Dropdown.Popover className="z-[110] min-w-[var(--trigger-width)]">
              <Dropdown.Menu
                selectedKeys={authTypeKeys}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as OpenApiAuthType | undefined;
                  if (!selectedKey) return;
                  onAuthTypeChange(selectedKey);
                }}
              >
                {Object.values(OpenApiAuthTypes).map((option) => (
                  <Dropdown.Item key={option} id={option} textValue={openApiAuthLabels[option]} className="rounded-lg">
                    <Dropdown.ItemIndicator />
                    <Label>{openApiAuthLabels[option]}</Label>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
        <Button
          type="button"
          variant="secondary"
          onPress={onParseSpec}
          isDisabled={parsePending}
          className="h-10 w-full rounded-field sm:w-auto"
        >
          <FlaskConical className="h-4 w-4" />
          {parsePending ? 'Parsing…' : 'Parse spec'}
        </Button>
      </div>

      {authType === OpenApiAuthTypes.API_KEY ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={control}
            name="config.apiKeyName"
            render={({ field }) => (
              <FormItem>
                <TextField
                  name={field.name}
                  value={(field.value as string | undefined) ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  fullWidth
                >
                  <Label>API key name</Label>
                  <Input className={INTEGRATION_INPUT_CLASSNAME} placeholder="X-Api-Key" autoComplete="off" />
                </TextField>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="config.apiKeyLocation"
            render={({ field }) => (
              <FormItem>
                <ApiKeyLocationSelect value={String(field.value ?? 'header')} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="config.apiKey"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <TextField
                  name={field.name}
                  value={(field.value as string | undefined) ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  fullWidth
                >
                  <Label>API key</Label>
                  <Input
                    className={INTEGRATION_INPUT_CLASSNAME}
                    type="password"
                    placeholder="xxxxxxxxxxxxxxxxxxxx"
                    autoComplete="off"
                  />
                </TextField>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : null}

      {authType === OpenApiAuthTypes.BEARER || authType === OpenApiAuthTypes.OAUTH2 ? (
        <FormField
          control={control}
          name="config.token"
          render={({ field }) => (
            <FormItem>
              <TextField
                name={field.name}
                value={(field.value as string | undefined) ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                fullWidth
              >
                <Label>Token</Label>
                <Input
                  className={INTEGRATION_INPUT_CLASSNAME}
                  type="password"
                  placeholder="xxxxxxxxxxxxxxxxxxxx"
                  autoComplete="off"
                />
              </TextField>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : null}

      {authType === OpenApiAuthTypes.CUSTOM_HEADERS ? (
        <CustomHeadersEditor pairs={customHeaderPairs} onChange={onCustomHeaderPairsChange} />
      ) : null}

      {parseResult ? (
        <div className="flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{parseResult.operationsCount} endpoints found at {parseResult.baseUrl}</span>
        </div>
      ) : null}
    </div>
  );
}

function ApiKeyLocationSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const selectedKeys = useMemo<Selection>(() => new Set([value]), [value]);
  const selectedLabel = API_KEY_LOCATIONS.find((option) => option.value === value)?.label ?? 'Header';

  return (
    <div className="flex flex-col gap-1">
      <Label>API key location</Label>
      <Dropdown>
        <Button
          aria-label="Select API key location"
          variant="secondary"
          className={INTEGRATION_DROPDOWN_TRIGGER_CLASSNAME}
        >
          <span className="truncate">{selectedLabel}</span>
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
            {API_KEY_LOCATIONS.map((option) => (
              <Dropdown.Item key={option.value} id={option.value} textValue={option.label} className="rounded-lg">
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
