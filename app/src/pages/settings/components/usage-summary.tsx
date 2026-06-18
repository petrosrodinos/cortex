import { useState } from 'react';
import { Tabs } from '@heroui/react';
import type { UsageSummary } from '@/features/settings/interfaces/usage.interfaces';
import { formatUsdCompact } from '@/lib/currency';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { UsageSummarySkeleton } from './usage-summary-skeleton';

interface UsageSummaryProps {
  usage?: UsageSummary;
  isLoading?: boolean;
}

const tooltipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 12,
  color: 'var(--foreground)',
};

const chartTabs = {
  cost: {
    label: 'Daily cost',
    description: 'Estimated AI spend per day from completed conversation calls in the selected range.',
  },
  tokens: {
    label: 'Daily tokens',
    description: 'Total tokens consumed per day across filtered executions and tool calls.',
  },
} as const;

type ChartTabKey = keyof typeof chartTabs;

export function UsageSummarySection({ usage, isLoading }: UsageSummaryProps) {
  const [selectedTab, setSelectedTab] = useState<ChartTabKey>('cost');
  const activeTab = chartTabs[selectedTab];

  if (isLoading) {
    return <UsageSummarySkeleton />;
  }

  if (!usage) {
    return <p className="text-sm text-muted">No usage data available.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          <p className="mt-1 text-2xl font-semibold text-foreground">{formatUsdCompact(usage.total_cost_usd)}</p>
        </div>
      </div>

      {usage.daily.length > 0 ? (
        <div className="rounded-xl border border-border bg-surface p-5">
          <Tabs
            className="w-full"
            variant="secondary"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as ChartTabKey)}
          >
            <Tabs.ListContainer className="flex justify-start">
              <Tabs.List
                aria-label="Usage charts"
                className="h-auto w-fit border-border *:h-7 *:min-h-7 *:px-3 *:text-xs *:font-medium"
              >
                <Tabs.Tab id="cost">
                  Cost
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="tokens">
                  Tokens
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>

            <div className="mt-4 border-b border-border pb-4">
              <p className="text-sm font-medium text-foreground">{activeTab.label}</p>
              <p className="mt-1 text-xs text-muted">{activeTab.description}</p>
            </div>

            <Tabs.Panel className="mt-4 p-0" id="cost">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usage.daily} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
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
                    tickFormatter={(chartValue) => `$${chartValue}`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(chartValue: number) => [formatUsdCompact(chartValue), 'Cost']}
                  />
                  <Bar dataKey="cost_usd" name="Cost (USD)" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Tabs.Panel>

            <Tabs.Panel className="mt-4 p-0" id="tokens">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usage.daily} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
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
                    contentStyle={tooltipStyle}
                    formatter={(chartValue: number) => [chartValue.toLocaleString(), 'Tokens']}
                  />
                  <Bar dataKey="tokens" name="Tokens" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Tabs.Panel>
          </Tabs>
        </div>
      ) : null}
    </div>
  );
}
