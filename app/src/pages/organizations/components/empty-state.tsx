import { Building2 } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-secondary text-muted">
        <Building2 className="h-6 w-6" />
      </div>
      <div className="max-w-xs">
        <p className="text-sm font-medium text-foreground">Select a workspace</p>
        <p className="mt-1 text-sm text-muted">
          Create or select a workspace above to manage its members, roles, and permissions.
        </p>
      </div>
    </div>
  );
}
