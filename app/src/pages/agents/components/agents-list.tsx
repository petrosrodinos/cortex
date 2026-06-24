import { Link } from 'react-router-dom';
import { MessageSquare, Pencil, Trash2 } from 'lucide-react';
import {
  AgentCronPresetLabels,
  AgentCronPresets,
  type Agent,
} from '@/features/agents/interfaces/agents.interfaces';
import { Routes } from '@/routes/routes';
import { formatDateTime } from '@/lib/date';
import { cn } from '@/lib/utils';

function formatScheduleLabel(cronExpression: string): string {
  const presetEntry = Object.entries(AgentCronPresetLabels).find(
    ([value]) => value === cronExpression.trim(),
  );
  if (presetEntry) {
    return presetEntry[1];
  }
  if (cronExpression === AgentCronPresets.CUSTOM) {
    return 'Custom';
  }
  return cronExpression;
}

type AgentsListProps = {
  agents: Agent[];
  onEdit: (agent: Agent) => void;
  onToggle: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
  togglingUuid?: string | null;
};

export function AgentsList({
  agents,
  onEdit,
  onToggle,
  onDelete,
  togglingUuid,
}: AgentsListProps) {
  if (agents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">No agents yet</p>
        <p className="mt-1 text-sm text-muted">
          Create an agent to run a prompt automatically on a cron schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-surface-secondary/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Schedule</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last run</th>
              <th className="px-4 py-3 font-medium">Next run</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.uuid} className="border-b border-border last:border-b-0 hover:bg-surface-secondary/40">
                <td className="px-4 py-3 font-medium text-foreground">{agent.title}</td>
                <td className="px-4 py-3 text-muted">{formatScheduleLabel(agent.cron_expression)}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                      agent.is_enabled
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-surface-secondary text-muted',
                    )}
                  >
                    {agent.is_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {agent.last_run_at ? formatDateTime(agent.last_run_at) : '—'}
                </td>
                <td className="px-4 py-3 text-muted">
                  {agent.is_enabled && agent.next_run_at ? formatDateTime(agent.next_run_at) : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={Routes.dashboard.conversation(agent.conversation_uuid)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-secondary hover:text-foreground"
                      title="View conversation"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onEdit(agent)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-secondary hover:text-foreground"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggle(agent)}
                      disabled={togglingUuid === agent.uuid}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-muted hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
                    >
                      {agent.is_enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(agent)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-500/10 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
