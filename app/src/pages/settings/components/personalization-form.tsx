import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Selection } from '@heroui/react';
import { Button, Dropdown, Label } from '@heroui/react';
import { ChevronsUpDown } from 'lucide-react';
import { ActionButtonWithPending } from '@/components/ui/action-button-with-pending';
import { cn } from '@/lib/utils';
import {
  characteristicLevelOptions,
  characteristicOptions,
  responseStyleOptions,
  CharacteristicLevels,
  ResponseStyles,
  type CharacteristicLevel,
} from '@/features/conversation-personalization/interfaces/conversation-personalization.interfaces';
import {
  useGetConversationPersonalization,
  useUpdateConversationPersonalization,
} from '@/features/conversation-personalization/hooks/use-conversation-personalization';
import {
  conversationPersonalizationSchema,
  type ConversationPersonalizationFormValues,
} from '@/features/conversation-personalization/validation-schemas/conversation-personalization.schema';

const textareaClassName =
  'min-h-32 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-accent';

interface PersonalizationFormProps {
  orgUuid?: string;
}

function CharacteristicLevelControl({
  value,
  label,
  description,
  onChange,
}: {
  value: CharacteristicLevel;
  label: string;
  description: string;
  onChange: (value: CharacteristicLevel) => void;
}) {
  return (
    <div className="rounded-lg border border-border px-4 py-3">
      <div className="mb-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
      <div className="inline-flex w-full rounded-lg border border-border bg-background p-1 sm:w-auto">
        {characteristicLevelOptions.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none sm:min-w-16',
                isSelected
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted hover:bg-surface-secondary hover:text-foreground',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PersonalizationForm({ orgUuid }: PersonalizationFormProps) {
  const { data, isLoading } = useGetConversationPersonalization(orgUuid);
  const updatePersonalization = useUpdateConversationPersonalization(orgUuid);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ConversationPersonalizationFormValues>({
    resolver: zodResolver(conversationPersonalizationSchema),
    defaultValues: {
      response_style: ResponseStyles.DEFAULT,
      warm: CharacteristicLevels.DEFAULT,
      enthusiastic: CharacteristicLevels.DEFAULT,
      headers_lists: CharacteristicLevels.DEFAULT,
      emoji: CharacteristicLevels.DEFAULT,
      custom_instructions: '',
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        response_style: data.response_style,
        warm: data.warm,
        enthusiastic: data.enthusiastic,
        headers_lists: data.headers_lists,
        emoji: data.emoji,
        custom_instructions: data.custom_instructions ?? '',
      });
    }
  }, [data, reset]);

  const selectedStyle = watch('response_style');
  const selectedStyleOption = responseStyleOptions.find((option) => option.value === selectedStyle);
  const selectedStyleKeys = useMemo<Selection>(() => new Set([selectedStyle]), [selectedStyle]);

  function onSubmit(formData: ConversationPersonalizationFormValues) {
    updatePersonalization.mutate({
      response_style: formData.response_style,
      warm: formData.warm,
      enthusiastic: formData.enthusiastic,
      headers_lists: formData.headers_lists,
      emoji: formData.emoji,
      custom_instructions: formData.custom_instructions?.trim() ? formData.custom_instructions.trim() : null,
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-xl border border-border bg-surface" />
        <div className="h-48 animate-pulse rounded-xl border border-border bg-surface" />
        <div className="h-40 animate-pulse rounded-xl border border-border bg-surface" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-5">
      <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Base style and tone</h3>
          <p className="mt-0.5 text-xs text-muted">
            Set how Cortex responds in conversations. This does not change Cortex capabilities.
          </p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Style</span>
          <Dropdown>
            <Button
              aria-label="Select response style"
              variant="secondary"
              className="h-10 w-full justify-between rounded-field border border-border bg-surface px-3 text-sm font-normal text-foreground shadow-none"
            >
              <span className="truncate">{selectedStyleOption?.label ?? 'Default'}</span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted" />
            </Button>
            <Dropdown.Popover className="min-w-[var(--trigger-width)]">
              <Dropdown.Menu
                selectedKeys={selectedStyleKeys}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string | undefined;
                  if (!selectedKey) return;
                  setValue('response_style', selectedKey as ConversationPersonalizationFormValues['response_style'], {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              >
                {responseStyleOptions.map((option) => (
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
        </label>

        {selectedStyleOption ? (
          <p className="mt-2 text-xs text-muted">{selectedStyleOption.description}</p>
        ) : null}
      </section>

      <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Characteristics</h3>
          <p className="mt-0.5 text-xs text-muted">Fine-tune traits on top of your base style.</p>
        </div>

        <div className="flex flex-col gap-2">
          {characteristicOptions.map((option) => (
            <CharacteristicLevelControl
              key={option.key}
              value={watch(option.key)}
              label={option.label}
              description={option.description}
              onChange={(level) =>
                setValue(option.key, level, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Custom instructions</h3>
          <p className="mt-0.5 text-xs text-muted">
            Optional instructions appended to Cortex&apos;s system prompt for your conversations in this workspace.
          </p>
        </div>

        <textarea
          {...register('custom_instructions')}
          className={textareaClassName}
          placeholder="Example: Always summarize action items at the end. Refer to me as Alex. Prefer metric units."
        />
        {errors.custom_instructions ? (
          <p className="mt-1 text-xs text-danger">{errors.custom_instructions.message}</p>
        ) : null}
      </section>

      <ActionButtonWithPending
        type="submit"
        isDisabled={!isDirty || updatePersonalization.isPending}
        isPending={updatePersonalization.isPending}
        className="w-full sm:w-fit"
      >
        Save
      </ActionButtonWithPending>
    </form>
  );
}
