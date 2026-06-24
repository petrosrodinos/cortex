import { useState } from 'react';
import type { FC } from 'react';
import { Plus } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  useCreateAgent,
  useDeleteAgent,
  useGetAgents,
  useUpdateAgent,
} from '@/features/agents/hooks/use-agents';
import type { Agent } from '@/features/agents/interfaces/agents.interfaces';
import type { AgentFormValues } from '@/features/agents/validation-schemas/agent.schema';
import { useOrganizationStore } from '@/stores/organization';
import { AgentModal } from './components/agent-modal';
import { AgentsList } from './components/agents-list';
import { AgentsTableSkeleton } from './components/agents-skeleton';

type ModalState =
  | { mode: 'create' }
  | { mode: 'edit'; agent: Agent }
  | null;

type DeleteTarget = { uuid: string; title: string } | null;

const AgentsPage: FC = () => {
  const organizationUuid = useOrganizationStore((state) => state.current_organization?.uuid);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [togglingUuid, setTogglingUuid] = useState<string | null>(null);

  const { data: agents = [], isLoading } = useGetAgents(organizationUuid);
  const createAgent = useCreateAgent(organizationUuid);
  const updateAgent = useUpdateAgent(organizationUuid);
  const deleteAgent = useDeleteAgent(organizationUuid);

  const handleSubmit = (values: AgentFormValues) => {
    if (!modalState) {
      return;
    }

    if (modalState.mode === 'create') {
      createAgent.mutate(values, {
        onSuccess: () => setModalState(null),
      });
      return;
    }

    updateAgent.mutate(
      {
        agentUuid: modalState.agent.uuid,
        payload: values,
      },
      {
        onSuccess: () => setModalState(null),
      },
    );
  };

  const handleToggle = (agent: Agent) => {
    setTogglingUuid(agent.uuid);
    updateAgent.mutate(
      {
        agentUuid: agent.uuid,
        payload: { is_enabled: !agent.is_enabled },
      },
      {
        onSettled: () => setTogglingUuid(null),
      },
    );
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Agents</h1>
          <p className="text-sm text-muted">
            Run prompts on a cron schedule. Each agent keeps a dedicated conversation with run history.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalState({ mode: 'create' })}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New agent
        </button>
      </div>

      {isLoading ? (
        <AgentsTableSkeleton />
      ) : (
        <AgentsList
          agents={agents}
          onEdit={(agent) => setModalState({ mode: 'edit', agent })}
          onToggle={handleToggle}
          onDelete={(agent) => setDeleteTarget({ uuid: agent.uuid, title: agent.title })}
          togglingUuid={togglingUuid}
        />
      )}

      {modalState ? (
        <AgentModal
          mode={modalState.mode}
          agent={modalState.mode === 'edit' ? modalState.agent : undefined}
          isSubmitting={createAgent.isPending || updateAgent.isPending}
          onClose={() => setModalState(null)}
          onSubmit={handleSubmit}
        />
      ) : null}

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete agent?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" and its conversation will be permanently deleted.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleteAgent.isPending}
        onConfirm={() => {
          if (!deleteTarget) {
            return;
          }
          deleteAgent.mutate(deleteTarget.uuid, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
};

export default AgentsPage;
