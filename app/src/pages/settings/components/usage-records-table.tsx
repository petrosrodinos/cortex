import { Link } from 'react-router-dom';
import type { UsageExecutionRecord } from '@/features/executions/interfaces/usage.interfaces';
import { Routes } from '@/routes/routes';
import { Button } from '@/components/ui/button';
import { formatUsdCompact } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { UsageRecordsTableSkeleton } from './usage-records-table-skeleton';
interface UsageRecordsTableProps {
  records: UsageExecutionRecord[];
  isLoading?: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

const statusColors: Record<string, string> = {
  COMPLETED: 'bg-green-500/10 text-green-400',
  FAILED: 'bg-red-500/10 text-red-400',
  RUNNING: 'bg-blue-500/10 text-blue-400',
  PENDING: 'bg-surface-secondary text-muted',
  AWAITING_APPROVAL: 'bg-amber-500/10 text-amber-400',
};

export function UsageRecordsTable({
  records,
  isLoading,
  page,
  totalPages,
  total,
  onPageChange,
}: UsageRecordsTableProps) {
  if (isLoading) {
    return <UsageRecordsTableSkeleton />;
  }

  return (    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Conversation calls</h3>
        <p className="mt-0.5 text-xs text-muted">Execution history with token and cost details.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-secondary">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted">Member</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted">Conversation</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted">Tokens</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted">Cost</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted">Tool calls</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted">Execution</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sm text-muted">
                  No conversation calls found for the selected filters.
                </td>
              </tr>
            ) : (
              records.map((record) => (                  <tr key={record.uuid} className="border-b border-border last:border-0 hover:bg-surface-secondary">
                    <td className="px-4 py-3 text-muted">{new Date(record.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-foreground">{record.user_email}</td>
                    <td className="px-4 py-3 text-foreground">
                      <Link
                        to={Routes.dashboard.conversation(record.conversation_uuid)}
                        className="hover:text-accent hover:underline"
                      >
                        {record.conversation_title || record.conversation_uuid}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-xs font-medium',
                          statusColors[record.status] ?? 'bg-surface-secondary text-muted',
                        )}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">{record.tokens_used.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatUsdCompact(record.cost_usd)}</td>
                    <td className="px-4 py-3 text-right text-muted">{record.tool_calls_count}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={Routes.dashboard.execution(record.uuid)}
                        className="text-xs font-medium text-accent hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
            )}
          </tbody>        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">
            Page {page} of {totalPages} — {total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-8 px-3 text-xs"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="h-8 px-3 text-xs"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
