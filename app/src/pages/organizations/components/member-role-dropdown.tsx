import { useMemo } from 'react';
import type { Selection } from '@heroui/react';
import { Button, Dropdown, Label } from '@heroui/react';
import { ChevronsUpDown } from 'lucide-react';
import type { OrganizationRole } from '@/features/roles/interfaces/role.interfaces';
import { cn } from '@/lib/utils';

interface MemberRoleDropdownProps {
  roles: OrganizationRole[];
  value: string;
  onChange: (roleUuid: string) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  'aria-label'?: string;
}

export function MemberRoleDropdown({
  roles,
  value,
  onChange,
  disabled = false,
  className,
  triggerClassName,
  'aria-label': ariaLabel = 'Select member role',
}: MemberRoleDropdownProps) {
  const selectedRole = roles.find((role) => role.uuid === value);
  const selectedKeys = useMemo<Selection>(() => new Set(value ? [value] : []), [value]);

  return (
    <div className={cn('min-w-[8rem]', className)}>
      <Dropdown isDisabled={disabled}>
        <Button
          aria-label={ariaLabel}
          variant="secondary"
          className={cn(
            'h-9 w-full justify-between rounded-field border border-border bg-surface px-3 text-sm font-normal text-foreground shadow-none',
            triggerClassName,
          )}
        >
          <span className="truncate">{selectedRole?.name ?? 'Select role'}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted" />
        </Button>
        <Dropdown.Popover className="min-w-[var(--trigger-width)]">
          <Dropdown.Menu
            selectedKeys={selectedKeys}
            selectionMode="single"
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string | undefined;
              if (!selectedKey) return;
              onChange(selectedKey);
            }}
          >
            {roles.map((role) => (
              <Dropdown.Item key={role.uuid} id={role.uuid} textValue={role.name} className="rounded-lg">
                <Dropdown.ItemIndicator />
                <Label>{role.name}</Label>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
