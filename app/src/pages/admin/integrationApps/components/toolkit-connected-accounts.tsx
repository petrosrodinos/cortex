import { useState } from 'react';
import { Unplug } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { useDisconnectIntegrationAppsAccount } from '@/features/integrationApps/hooks/use-integrationApps';
import type { IntegrationAppsToolkitDetail } from '@/features/integrationApps/interfaces/integrationApps.interface';

interface ToolkitConnectedAccountsProps {
  organizationUuid: string;
  toolkitSlug: string;
  toolkitName: string;
  detail: IntegrationAppsToolkitDetail;
}

export function ToolkitConnectedAccounts({
  organizationUuid,
  toolkitSlug,
  toolkitName,
  detail,
}: ToolkitConnectedAccountsProps) {
  const [disconnectAccountId, setDisconnectAccountId] = useState<string | null>(null);
  const disconnectAccount = useDisconnectIntegrationAppsAccount(organizationUuid, toolkitSlug);
  const connections = detail.connections;
  const pendingDisconnect = connections.find((connection) => connection.account_id === disconnectAccountId);

  return (
    <>
      <section className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Connected accounts</h3>
        </div>
        {connections.length === 0 ? (
          <p className="px-4 py-4 text-sm text-muted">No connected accounts yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {connections.map((connection) => (
              <div key={connection.account_id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {connection.account_label || connection.account_id}
                  </p>
                  <p className="text-xs text-muted">{connection.account_id}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    {connection.status}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9"
                    onClick={() => setDisconnectAccountId(connection.account_id)}
                  >
                    <Unplug className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmationDialog
        open={!!disconnectAccountId}
        title="Remove connection?"
        description={
          pendingDisconnect
            ? `This will disconnect ${pendingDisconnect.account_label || pendingDisconnect.account_id} from ${toolkitName}. The agent will no longer be able to use this integration until you connect again.`
            : 'This will remove the connected account. The agent will no longer be able to use this integration until you connect again.'
        }
        confirmLabel="Remove connection"
        loading={disconnectAccount.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setDisconnectAccountId(null);
          }
        }}
        onConfirm={() => {
          if (!disconnectAccountId) {
            return;
          }

          disconnectAccount.mutate(disconnectAccountId, {
            onSuccess: () => {
              setDisconnectAccountId(null);
            },
          });
        }}
      />
    </>
  );
}
