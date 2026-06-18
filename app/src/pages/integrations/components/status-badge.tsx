import { cn } from '@/lib/utils';
import { IntegrationStatuses } from '@/features/integrations/interfaces/integration.interface';

export function StatusBadge({ status }: { status: string }) {
  const active = status === IntegrationStatuses.ACTIVE;
  const errored = status === IntegrationStatuses.ERROR;
  return (
    <span
      className={cn(
        'shrink-0 rounded-md px-2 py-1 text-xs font-medium',
        active
          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
          : errored
            ? 'bg-red-500/10 text-red-700 dark:text-red-300'
            : 'bg-surface-tertiary text-muted',
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}
