import { useEffect, useMemo, useRef, useState } from 'react';
import { Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetPermissions } from '@/features/permissions/hooks/use-permissions';
import type { Permission } from '@/features/permissions/interfaces/permission.interfaces';
import { useCreateRole } from '@/features/roles/hooks/use-roles';
import { cn } from '@/lib/utils';
import { useOrganizationStore } from '@/stores/organization';

type CreateRoleModalProps = {
  onClose: () => void;
};

function groupPermissions(permissions: Permission[]) {
  const map: Record<string, Permission[]> = {};
  for (const permission of permissions) {
    const group = permission.group ?? 'General';
    (map[group] ??= []).push(permission);
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
}

export function CreateRoleModal({ onClose }: CreateRoleModalProps) {
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const permissionsQuery = useGetPermissions();
  const createRoleMutation = useCreateRole(currentOrganization?.uuid);
  const permissions = permissionsQuery.data ?? [];
  const permissionGroups = useMemo(() => groupPermissions(permissions), [permissions]);
  const allPermissionKeys = useMemo(() => permissions.map((permission) => permission.key), [permissions]);
  const allSelected =
    allPermissionKeys.length > 0 && allPermissionKeys.every((key) => selectedKeys.includes(key));
  const trimmedName = name.trim();
  const loading = createRoleMutation.isPending || permissionsQuery.isLoading;

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  function togglePermission(permissionKey: string) {
    setSelectedKeys((current) =>
      current.includes(permissionKey)
        ? current.filter((key) => key !== permissionKey)
        : [...current, permissionKey],
    );
  }

  function toggleSelectAll() {
    setSelectedKeys(allSelected ? [] : allPermissionKeys);
  }

  function toggleGroupSelectAll(groupPermissions: Permission[]) {
    const groupKeys = groupPermissions.map((permission) => permission.key);
    const groupAllSelected = groupKeys.every((key) => selectedKeys.includes(key));
    setSelectedKeys((current) => {
      if (groupAllSelected) {
        return current.filter((key) => !groupKeys.includes(key));
      }
      return [...new Set([...current, ...groupKeys])];
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!currentOrganization || !trimmedName) return;

    setError(null);

    try {
      await createRoleMutation.mutateAsync({
        name: trimmedName,
        permission_keys: selectedKeys,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to create role');
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
      <section className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent/15 text-accent">
            <Shield className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground">Create role</h2>
            <p className="text-xs text-muted">Name the role and choose its permissions.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            title="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {error ? (
              <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            ) : null}

            <label className="grid gap-1 text-sm">
              <span className="font-medium text-foreground">Role name</span>
              <Input
                ref={nameInputRef}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Custom role name"
                autoComplete="off"
              />
            </label>

            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-foreground">Permissions</span>
                <button
                  type="button"
                  disabled={loading || permissions.length === 0}
                  onClick={toggleSelectAll}
                  className="text-xs font-medium text-accent hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {allSelected ? 'Deselect all' : 'Select all'}
                </button>
              </div>

              {permissionsQuery.isLoading ? (
                <div className="grid gap-2">
                  {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="h-9 animate-pulse rounded-md bg-surface-secondary" />
                  ))}
                </div>
              ) : permissions.length === 0 ? (
                <p className="text-sm text-muted">No permissions available.</p>
              ) : (
                <div className="grid gap-4">
                  {permissionGroups.map(([group, groupPermissions]) => {
                    const groupKeys = groupPermissions.map((permission) => permission.key);
                    const groupAllSelected =
                      groupKeys.length > 0 && groupKeys.every((key) => selectedKeys.includes(key));

                    return (
                    <div key={group} className="grid gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{group}</p>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => toggleGroupSelectAll(groupPermissions)}
                          className="text-[11px] font-medium text-accent hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {groupAllSelected ? 'Deselect all' : 'Select all'}
                        </button>
                      </div>
                      <div className="grid gap-1.5">
                        {groupPermissions.map((permission) => {
                          const checked = selectedKeys.includes(permission.key);
                          return (
                            <div
                              key={permission.key}
                              className={cn(
                                'flex items-center justify-between gap-3 rounded-md border border-border/80 px-3 py-2 text-sm transition-colors hover:bg-surface-secondary',
                                checked && 'border-accent/30 bg-accent/5',
                              )}
                            >
                              <span className="min-w-0 flex-1 text-foreground">{permission.label}</span>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={checked}
                                aria-label={permission.label}
                                disabled={loading}
                                onClick={() => togglePermission(permission.key)}
                                className={cn(
                                  'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors',
                                  checked ? 'bg-accent' : 'bg-border',
                                  loading && 'cursor-not-allowed opacity-60',
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
                        })}
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" loading={loading} disabled={!trimmedName} className="sm:w-auto">
              Create role
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
