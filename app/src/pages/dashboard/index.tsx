import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, DollarSign, MessageSquare, Zap } from 'lucide-react';
import { useGetUsage } from '@/features/executions/hooks/use-executions';
import { useGetAgents } from '@/features/agents/hooks/use-agents';
import { useGetConversations } from '@/features/conversations/hooks/use-conversations';
import { ConversationKinds } from '@/features/conversations/interfaces/conversation.interfaces';
import { formatDateTime } from '@/lib/date';
import { formatUsdCompact } from '@/lib/currency';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationStore } from '@/stores/organization';
import { Routes } from '@/routes/routes';

export default function DashboardHome() {
  const { full_name, email } = useAuthStore();
  const organizationUuid = useOrganizationStore((state) => state.current_organization?.uuid);
  const displayName = full_name || email || 'there';

  const usageQuery = useMemo(() => {
    const now = new Date();
    const from = new Date(now);
    from.setDate(from.getDate() - 30);
    return {
      date_from: from.toISOString().split('T')[0],
      date_to: now.toISOString().split('T')[0],
    };
  }, []);

  const { data: conversations = [], isLoading: loadingConversations } = useGetConversations(organizationUuid);
  const { data: agents = [], isLoading: loadingAgents } = useGetAgents(organizationUuid);
  const { data: usage, isLoading: loadingUsage } = useGetUsage(organizationUuid, usageQuery);

  const standardConversations = useMemo(
    () =>
      conversations
        .filter((c) => !c.kind || c.kind === ConversationKinds.STANDARD)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
    [conversations],
  );

  const enabledAgentCount = agents.filter((a) => a.is_enabled).length;
  const recentConversations = standardConversations.slice(0, 5);

  const stats = [
    {
      label: 'Conversations',
      value: loadingConversations ? null : String(standardConversations.length),
      icon: MessageSquare,
      href: Routes.dashboard.conversations,
    },
    {
      label: 'Active Agents',
      value: loadingAgents ? null : String(enabledAgentCount),
      icon: Bot,
      href: Routes.dashboard.agents,
    },
    {
      label: 'Executions (30d)',
      value: loadingUsage ? null : String(usage?.total_executions ?? 0),
      icon: Zap,
      href: Routes.dashboard.settingsUsage,
    },
    {
      label: 'Cost (30d)',
      value: loadingUsage ? null : formatUsdCompact(usage?.total_cost_usd ?? 0),
      icon: DollarSign,
      href: Routes.dashboard.settingsUsage,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="text-2xl font-semibold text-foreground">Welcome back, {displayName}</p>
        <p className="mt-1 text-sm text-muted">Here's an overview of your workspace.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.href}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/50"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">{stat.label}</p>
                <Icon className="h-4 w-4 text-muted transition-colors group-hover:text-accent" />
              </div>
              {stat.value === null ? (
                <div className="h-8 w-16 animate-pulse rounded bg-surface-secondary" />
              ) : (
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              )}
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-sm font-semibold text-foreground">Recent Conversations</p>
          <Link
            to={Routes.dashboard.conversations}
            className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loadingConversations ? (
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="h-4 flex-1 animate-pulse rounded bg-surface-secondary" />
                <div className="h-4 w-16 animate-pulse rounded bg-surface-secondary" />
              </div>
            ))}
          </div>
        ) : recentConversations.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-muted">No conversations yet.</p>
            <Link
              to={Routes.dashboard.conversations}
              className="mt-2 inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              Start a conversation
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentConversations.map((conv) => (
              <Link
                key={conv.uuid}
                to={Routes.dashboard.conversation(conv.uuid)}
                className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-surface-secondary/50"
              >
                <p className="truncate text-sm text-foreground">
                  {conv.title ? conv.title : <span className="italic text-muted">Untitled</span>}
                </p>
                <span className="ml-4 shrink-0 text-xs text-muted">{formatDateTime(conv.updated_at)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
