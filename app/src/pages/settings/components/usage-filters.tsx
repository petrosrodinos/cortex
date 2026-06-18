import { useMemo } from 'react';
import type { Selection } from '@heroui/react';
import { Button, Dropdown, Label } from '@heroui/react';
import { ChevronsUpDown, RotateCcw } from 'lucide-react';
import type { OrganizationMember } from '@/features/members/interfaces/member.interfaces';
import type { UsageQuery } from '@/features/executions/interfaces/usage.interfaces';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { cn } from '@/lib/utils';

export interface UsageFiltersValue {
  date_from?: string;
  date_to?: string;
  member_uuid?: string;
}

interface UsageFiltersProps {
  value: UsageFiltersValue;
  onChange: (value: UsageFiltersValue) => void;
  onReset?: () => void;
  members?: OrganizationMember[];
  showMemberFilter?: boolean;
  isLoadingMembers?: boolean;
  className?: string;
}

const ALL_MEMBERS_KEY = 'all';

export function UsageFilters({
  value,
  onChange,
  onReset,
  members = [],
  showMemberFilter = false,
  isLoadingMembers = false,
  className,
}: UsageFiltersProps) {
  const updateField = (field: keyof UsageQuery, nextValue: string) => {
    onChange({
      ...value,
      [field]: nextValue || undefined,
    });
  };

  const selectedMemberLabel = useMemo(() => {
    if (!value.member_uuid) {
      return 'All members';
    }

    return members.find((member) => member.uuid === value.member_uuid)?.user?.email ?? 'Selected member';
  }, [members, value.member_uuid]);

  const selectedMemberKeys = useMemo<Selection>(
    () => new Set([value.member_uuid || ALL_MEMBERS_KEY]),
    [value.member_uuid],
  );

  return (
    <div className={cn('rounded-xl border border-border bg-surface p-4', className)}>
      <div
        className={cn(
          'grid gap-4',
          showMemberFilter ? 'md:grid-cols-[1fr_1fr_1.2fr_auto]' : 'md:grid-cols-[1fr_1fr_auto]',
        )}
      >
        <DatePickerField
          label="From"
          value={value.date_from}
          maxValue={value.date_to}
          onChange={(nextValue) => updateField('date_from', nextValue)}
        />

        <DatePickerField
          label="To"
          value={value.date_to}
          minValue={value.date_from}
          onChange={(nextValue) => updateField('date_to', nextValue)}
        />

        {showMemberFilter ? (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Member</span>
            <Dropdown>
              <Button
                aria-label="Select member"
                variant="secondary"
                className="h-10 w-full justify-between rounded-field border border-border bg-surface px-3 text-sm font-normal text-foreground shadow-none"
                isDisabled={isLoadingMembers}
              >
                <span className="truncate">{selectedMemberLabel}</span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted" />
              </Button>
              <Dropdown.Popover className="min-w-[var(--trigger-width)]">
                <Dropdown.Menu
                  selectedKeys={selectedMemberKeys}
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string | undefined;
                    updateField('member_uuid', selectedKey === ALL_MEMBERS_KEY ? '' : selectedKey ?? '');
                  }}
                >
                  <Dropdown.Item id={ALL_MEMBERS_KEY} textValue="All members" className="rounded-lg">
                    <Dropdown.ItemIndicator />
                    <Label>All members</Label>
                  </Dropdown.Item>
                  {members.map((member) => (
                    <Dropdown.Item
                      key={member.uuid}
                      id={member.uuid}
                      textValue={member.user?.email ?? member.uuid}
                      className="rounded-lg"
                    >
                      <Dropdown.ItemIndicator />
                      <Label>{member.user?.email ?? member.uuid}</Label>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </label>
        ) : null}

        <div className="flex items-end justify-end">
          <Button
            aria-label="Reset filters"
            variant="secondary"
            className="h-10 w-10 min-w-10 rounded-field border border-border bg-surface text-foreground shadow-none"
            onPress={onReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
