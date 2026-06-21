import { useMemo, useState, type FC } from 'react';
import { Loader2 } from 'lucide-react';
import type { IntegrationAppsConnectionTier } from '@/features/integration-apps/interfaces/integrationApps.interface';
import type { ExecutionConnectionTierRequest } from '@/features/conversations/interfaces/conversation.interfaces';
import { ConnectionTierSelector } from '@/pages/integrations/components/integration-apps/connection-tier-selector';
import { cn } from '@/lib/utils';

interface ExecutionConnectionTierCardProps {
  request: ExecutionConnectionTierRequest;
  className?: string;
  isSubmitting: boolean;
  onSubmit: (choices: Record<string, IntegrationAppsConnectionTier>) => void;
}

export const ExecutionConnectionTierCard: FC<ExecutionConnectionTierCardProps> = ({
  request,
  className,
  isSubmitting,
  onSubmit,
}) => {
  const initialChoices = useMemo(() => {
    const choices: Record<string, IntegrationAppsConnectionTier> = {};

    for (const choice of request.connectionTierChoices) {
      choices[choice.slug] = choice.availableTiers[0] ?? 'ORG_SHARED';
    }

    return choices;
  }, [request.connectionTierChoices]);

  const [choices, setChoices] =
    useState<Record<string, IntegrationAppsConnectionTier>>(initialChoices);

  const toolkitCount = request.connectionTierChoices.length;

  return (
    <div
      className={cn(
        'mr-auto w-full max-w-xl overflow-hidden rounded-2xl border border-accent/30 bg-accent/5 shadow-sm',
        className,
      )}
    >
      <div className="border-b border-accent/20 px-4 py-3 sm:px-5">
        <p className="text-sm font-medium text-foreground">Choose connection type</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {toolkitCount === 1
            ? `Pick which ${request.connectionTierChoices[0]?.name ?? 'toolkit'} connection this message should use.`
            : 'Pick which connection each toolkit should use for this message.'}
        </p>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-5">
        {request.connectionTierChoices.map((choice) => (
          <div key={choice.slug}>
            <p className="mb-2 text-sm font-medium text-foreground">{choice.name}</p>
            <ConnectionTierSelector
              name={`connection-tier-${choice.slug}`}
              tiers={choice.availableTiers}
              value={choices[choice.slug] ?? choice.availableTiers[0] ?? 'ORG_SHARED'}
              disabled={isSubmitting}
              onChange={(tier) => {
                setChoices((current) => ({
                  ...current,
                  [choice.slug]: tier,
                }));
              }}
            />
          </div>
        ))}
      </div>

      <div className="border-t border-accent/20 bg-accent/8 px-4 py-3 sm:px-5">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onSubmit(choices)}
          className={cn(
            'inline-flex h-9 min-w-[5.5rem] items-center justify-center gap-1.5 rounded-full px-4',
            'bg-accent text-sm font-medium text-accent-foreground',
            'transition-all duration-150 hover:opacity-90 active:scale-[0.98]',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Continue
        </button>
      </div>
    </div>
  );
};
