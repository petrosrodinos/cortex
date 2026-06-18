import { useState } from 'react';
import { useOrganizationStore } from '@/stores/organization';
import { useGetAuditLogs } from '@/features/settings/hooks/use-settings';
import { Button } from '@/components/ui/button';

export default function AuditLogsPage() {
  const orgUuid = useOrganizationStore((s) => s.current_organization?.uuid);
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading } = useGetAuditLogs(orgUuid, page, limit);

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Audit logs</h2>
        <p className="mt-0.5 text-xs text-muted">Activity history for your organization.</p>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-secondary">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted">Resource type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted">Resource ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-muted">
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && (!data || data.data.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-muted">
                  No audit logs found.
                </td>
              </tr>
            )}
            {data?.data.map((log) => (
              <tr key={log.uuid} className="border-b border-border last:border-0 hover:bg-surface-secondary">
                <td className="px-4 py-3 font-medium text-foreground">{log.action}</td>
                <td className="px-4 py-3 text-muted">{log.resource_type}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{log.resource_id}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">
            Page {page} of {totalPages} — {data.total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-8 px-3 text-xs"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="h-8 px-3 text-xs"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
