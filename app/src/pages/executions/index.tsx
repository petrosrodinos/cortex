import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useOrganizationStore } from '@/stores/organization';
import { useGetExecution } from '@/features/executions/hooks/use-executions';
import { formatUsd } from '@/lib/currency';
import { Routes } from '@/routes/routes';
import { ExecutionDetailSkeleton } from './components/execution-detail-skeleton';

const statusColors: Record<string, string> = {
  COMPLETED: 'bg-green-500/10 text-green-400',
  FAILED: 'bg-red-500/10 text-red-400',
  RUNNING: 'bg-blue-500/10 text-blue-400',
  PENDING: 'bg-surface-secondary text-muted',
};

function JsonCollapsible({ label, data }: { label: string; data: unknown }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="rounded-lg border border-border"
    >
      <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-muted hover:text-foreground select-none">
        {label}
      </summary>
      <pre className="overflow-x-auto rounded-b-lg bg-surface-secondary px-3 py-3 text-xs text-foreground">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}

export default function ExecutionDetailPage() {
  const { executionUuid } = useParams<{ executionUuid: string }>();
  const navigate = useNavigate();
  const orgUuid = useOrganizationStore((s) => s.current_organization?.uuid);
  const { data: execution, isLoading } = useGetExecution(orgUuid, executionUuid);

  if (isLoading) {
    return <ExecutionDetailSkeleton />;
  }

  if (!execution) return <p className="text-sm text-muted">Execution not found.</p>;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <button
            type="button"
            onClick={() => navigate(Routes.dashboard.settingsUsage)}
            className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Execution</h1>
            <p className="mt-0.5 font-mono text-xs text-muted">{execution.uuid}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusColors[execution.status] ?? 'bg-surface-secondary text-muted'}`}
        >
          {execution.status}
        </span>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">Tokens used</p>
          <p className="mt-1 text-xl font-semibold text-foreground">{(execution.tokens_used ?? 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">Cost</p>
          <p className="mt-1 text-xl font-semibold text-foreground">{formatUsd(execution.cost_usd, 6)}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">Created</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {new Date(execution.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {execution.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
          {execution.error}
        </div>
      )}

      {execution.output && (
        <div className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">Output</h2>
          {execution.output.content && (
            <p className="text-sm text-foreground whitespace-pre-wrap">{execution.output.content}</p>
          )}
          {execution.output.files.length > 0 && (
            <div className="flex flex-col gap-1">
              {execution.output.files.map((fileUrl, i) => {
                const filename = fileUrl.split('/').pop() ?? `file-${i + 1}`;
                return (
                  <a key={fileUrl} href={fileUrl} download={filename} className="text-xs text-accent hover:underline">
                    {filename}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}

      {execution.tool_calls.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">Tool calls</h2>
          {execution.tool_calls.map((tc) => (
            <div key={tc.uuid} className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm font-medium text-foreground">{tc.tool_name}</span>
                <div className="flex items-center gap-3">
                  {tc.duration_ms != null && (
                    <span className="text-xs text-muted">{tc.duration_ms}ms</span>
                  )}
                  {tc.tokens_used != null && (
                    <span className="text-xs text-muted">{tc.tokens_used} tokens</span>
                  )}
                  {tc.cost_usd != null && (
                    <span className="text-xs text-muted">{formatUsd(tc.cost_usd, 6)}</span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[tc.status] ?? 'bg-surface-secondary text-muted'}`}
                  >
                    {tc.status}
                  </span>
                </div>
              </div>
              {tc.error && <p className="text-xs text-red-400">{tc.error}</p>}
              <div className="flex flex-col gap-2">
                {tc.input != null && <JsonCollapsible label="Input" data={tc.input} />}
                {tc.output != null && <JsonCollapsible label="Output" data={tc.output} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
