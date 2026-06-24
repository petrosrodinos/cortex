import { useMemo } from 'react';
import type { Selection } from '@heroui/react';
import { Button, Dropdown, Label } from '@heroui/react';
import { ChevronsUpDown, RotateCcw } from 'lucide-react';
import type { OrganizationMember } from '@/features/members/interfaces/member.interfaces';
import type { UsageQuery } from '@/features/executions/interfaces/usage.interfaces';
import { useGetMembers } from '@/features/members/hooks/use-members';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { OrganizationPermissionGate } from '@/components/permissions/organization-permission-gate';
import { PermissionKeys } from '@/features/permissions/interfaces/permission.interfaces';
import { cn } from '@/lib/utils';

export interface UsageFiltersValue {
  date_from?: string;
  date_to?: string;
  member_uuid?: string;
}

interface UsageFiltersProps {
  organizationUuid?: string;
  value: UsageFiltersValue;
  onChange: (value: UsageFiltersValue) => void;
  onReset?: () => void;
  className?: string;
}

const ALL_MEMBERS_KEY = 'all';

export function UsageFilters({
  organizationUuid,
  value,
  onChange,
  onReset,
  className,
}: UsageFiltersProps) {
  const updateField = (field: keyof UsageQuery, nextValue: string) => {
    onChange({
      ...value,
      [field]: nextValue || undefined,
    });
  };

  return (
    <div className={cn('rounded-xl border border-border bg-surface p-4', className)}>
      <OrganizationPermissionGate permission={PermissionKeys.AI_USAGE_READ}>
        {(canFilterByMember) => (
          <div
            className={cn(
              'grid gap-4',
              canFilterByMember ? 'md:grid-cols-[1fr_1fr_1.2fr_auto]' : 'md:grid-cols-[1fr_1fr_auto]',
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

            {canFilterByMember && organizationUuid ? (
              <UsageMemberFilter
                organizationUuid={organizationUuid}
                value={value.member_uuid}
                onChange={(memberUuid) => updateField('member_uuid', memberUuid)}
              />
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
        )}
      </OrganizationPermissionGate>
    </div>
  );
}

function UsageMemberFilter({
  organizationUuid,
  value,
  onChange,
}: {
  organizationUuid: string;
  value?: string;
  onChange: (memberUuid: string) => void;
}) {
  const membersQuery = useGetMembers(organizationUuid);
  const members = membersQuery.data ?? [];

  const selectedMemberLabel = useMemo(() => {
    if (!value) {
      return 'All members';
    }

    return members.find((member) => member.uuid === value)?.user?.email ?? 'Selected member';
  }, [members, value]);

  const selectedMemberKeys = useMemo<Selection>(() => new Set([value || ALL_MEMBERS_KEY]), [value]);

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">Member</span>
      <Dropdown>
        <Button
          aria-label="Select member"
          variant="secondary"
          className="h-10 w-full justify-between rounded-field border border-border bg-surface px-3 text-sm font-normal text-foreground shadow-none"
          isDisabled={membersQuery.isLoading}
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
              onChange(selectedKey === ALL_MEMBERS_KEY ? '' : selectedKey ?? '');
            }}
          >
            <Dropdown.Item id={ALL_MEMBERS_KEY} textValue="All members" className="rounded-lg">
              <Dropdown.ItemIndicator />
              <Label>All members</Label>
            </Dropdown.Item>
            {members.map((member: OrganizationMember) => (
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
  );
}
