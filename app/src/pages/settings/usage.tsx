import { useOrganizationStore } from '@/stores/organization';
import { useGetUsage } from '@/features/settings/hooks/use-settings';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function UsagePage() {
  const orgUuid = useOrganizationStore((s) => s.current_organization?.uuid);
  const { data: usage, isLoading } = useGetUsage(orgUuid);

  if (isLoading) return <p className="text-sm text-muted">Loading...</p>;

  if (!usage) return <p className="text-sm text-muted">No usage data available.</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Usage</h2>
        <p className="mt-0.5 text-xs text-muted">Token and cost usage for your organization.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs text-muted">Total executions</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{usage.total_executions.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs text-muted">Total tokens</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{usage.total_tokens.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs text-muted">Total cost</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">${usage.total_cost_usd.toFixed(4)}</p>
        </div>
      </div>

      {usage.daily.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="mb-4 text-sm font-medium text-foreground">Daily token usage</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usage.daily} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'var(--muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="tokens" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
