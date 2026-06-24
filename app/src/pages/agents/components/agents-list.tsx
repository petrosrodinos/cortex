import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Label, Switch } from '@heroui/react';
import { MessageSquare, MoreHorizontal, Pencil, Power, Trash2 } from 'lucide-react';
import { OrganizationPermissionGate } from '@/components/permissions/organization-permission-gate';
import { PermissionKeys } from '@/features/permissions/interfaces/permission.interfaces';
import {
  AgentCronPresetLabels,
  AgentCronPresets,
  type Agent,
} from '@/features/agents/interfaces/agents.interfaces';
import { Routes } from '@/routes/routes';
import { formatDateTime } from '@/lib/date';

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
  const navigate = useNavigate();

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
                  <OrganizationPermissionGate permission={PermissionKeys.AGENTS_WRITE}>
                    {(allowed) => (
                      <Switch
                        isSelected={agent.is_enabled}
                        isDisabled={!allowed || togglingUuid === agent.uuid}
                        onChange={() => onToggle(agent)}
                        size="sm"
                      >
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch>
                    )}
                  </OrganizationPermissionGate>
                </td>
                <td className="px-4 py-3 text-muted">
                  {agent.last_run_at ? formatDateTime(agent.last_run_at) : '—'}
                </td>
                <td className="px-4 py-3 text-muted">
                  {agent.is_enabled && agent.next_run_at ? formatDateTime(agent.next_run_at) : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Dropdown>
                      <Button
                        aria-label="Row actions"
                        variant="secondary"
                        isDisabled={togglingUuid === agent.uuid}
                        className="inline-flex h-8 w-8 min-w-8 shrink-0 rounded-lg border-0 bg-transparent p-0 text-muted shadow-none hover:bg-surface-secondary hover:text-foreground data-[hover=true]:bg-surface-secondary data-[hover=true]:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      <Dropdown.Popover
                        placement="bottom end"
                        offset={4}
                        className="z-50 min-w-[180px] overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-lg"
                      >
                        <Dropdown.Menu
                          onAction={(key) => {
                            const k = String(key);
                            if (k === 'view') navigate(Routes.dashboard.conversation(agent.conversation_uuid));
                            if (k === 'edit') onEdit(agent);
                            if (k === 'toggle') onToggle(agent);
                            if (k === 'delete') onDelete(agent);
                          }}
                        >
                          <Dropdown.Item id="view" textValue="View conversation" className="gap-2.5 rounded-lg px-2 py-2">
                            <MessageSquare className="h-4 w-4 shrink-0 text-muted" />
                            <Label className="text-sm">View conversation</Label>
                          </Dropdown.Item>
                          <OrganizationPermissionGate permission={PermissionKeys.AGENTS_WRITE}>
                            <Dropdown.Item id="edit" textValue="Edit" className="gap-2.5 rounded-lg px-2 py-2">
                              <Pencil className="h-4 w-4 shrink-0 text-muted" />
                              <Label className="text-sm">Edit</Label>
                            </Dropdown.Item>
                            <Dropdown.Item id="toggle" textValue={agent.is_enabled ? 'Disable' : 'Enable'} className="gap-2.5 rounded-lg px-2 py-2">
                              <Power className="h-4 w-4 shrink-0 text-muted" />
                              <Label className="text-sm">{agent.is_enabled ? 'Disable' : 'Enable'}</Label>
                            </Dropdown.Item>
                          </OrganizationPermissionGate>
                          <OrganizationPermissionGate permission={PermissionKeys.AGENTS_DELETE}>
                            <Dropdown.Item id="delete" textValue="Delete" className="gap-2.5 rounded-lg px-2 py-2 text-red-500">
                              <Trash2 className="h-4 w-4 shrink-0" />
                              <Label className="text-sm">Delete</Label>
                            </Dropdown.Item>
                          </OrganizationPermissionGate>
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
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
