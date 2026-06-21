import { useEffect, useState } from 'react';
import { Plug, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { IntegrationAppsConnectionTier } from '@/features/integration-apps/interfaces/integrationApps.interface';
import {
  ConnectionTierSelector,
  getDefaultConnectionTier,
} from './connection-tier-selector';

interface ConnectToolkitDialogProps {
  open: boolean;
  toolkitName: string;
  connectionTiers: IntegrationAppsConnectionTier[];
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (connectionTier: IntegrationAppsConnectionTier) => void;
}

export function ConnectToolkitDialog({
  open,
  toolkitName,
  connectionTiers,
  loading = false,
  onOpenChange,
  onConnect,
}: ConnectToolkitDialogProps) {
  const [selectedTier, setSelectedTier] = useState<IntegrationAppsConnectionTier>(() =>
    getDefaultConnectionTier(connectionTiers),
  );

  useEffect(() => {
    if (open) {
      setSelectedTier(getDefaultConnectionTier(connectionTiers));
    }
  }, [connectionTiers, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close connect dialog"
        className="absolute inset-0 bg-[color-mix(in_oklch,black_42%,transparent)]"
        onClick={() => onOpenChange(false)}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="connect-toolkit-dialog-title"
        className="relative w-full max-w-[440px] rounded-lg border border-border bg-surface p-5 shadow-xl"
        style={{ boxShadow: '0 24px 60px -20px color-mix(in oklch, black 55%, transparent)' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="connect-toolkit-dialog-title" className="text-sm font-semibold text-foreground">
              Connect {toolkitName}
            </h2>
            <p className="mt-1 text-sm leading-5 text-muted">
              Choose how this integration should be connected before continuing to authorization.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <ConnectionTierSelector
            tiers={connectionTiers}
            value={selectedTier}
            disabled={loading}
            onChange={setSelectedTier}
          />
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" disabled={loading} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" loading={loading} onClick={() => onConnect(selectedTier)}>
            <Plug className="h-4 w-4" />
            Continue
          </Button>
        </div>
      </section>
    </div>
  );
}
