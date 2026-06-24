import { X } from 'lucide-react';
import type { Agent } from '@/features/agents/interfaces/agents.interfaces';
import type { AgentFormValues } from '@/features/agents/validation-schemas/agent.schema';
import { AgentForm } from './agent-form';

type AgentModalProps = {
  mode: 'create' | 'edit';
  agent?: Agent;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: AgentFormValues) => void;
};

export function AgentModal({
  mode,
  agent,
  isSubmitting,
  onClose,
  onSubmit,
}: AgentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {mode === 'create' ? 'New agent' : 'Edit agent'}
            </h2>
            <p className="text-sm text-muted">
              Configure a prompt and cron schedule. Results appear in a dedicated conversation.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-surface-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <AgentForm
          key={agent?.uuid ?? 'create'}
          initialValues={
            agent
              ? {
                  title: agent.title,
                  prompt: agent.prompt,
                  cron_expression: agent.cron_expression,
                  is_enabled: agent.is_enabled,
                }
              : undefined
          }
          submitLabel={mode === 'create' ? 'Create agent' : 'Save changes'}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
