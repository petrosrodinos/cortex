import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useVerifyIntegrationAppsCallback } from '@/features/integration-apps/hooks/use-integrationApps';
import { Routes } from '@/routes/routes';
import { useOrganizationStore } from '@/stores/organization';

export default function IntegrationAppsCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const organizationUuid = useOrganizationStore((state) => state.current_organization?.uuid);
  const verifyCallback = useVerifyIntegrationAppsCallback(organizationUuid);

  const callbackParams = useMemo(() => {
    const toolkitSlug =
      searchParams.get('toolkit_slug') ||
      searchParams.get('toolkitSlug') ||
      searchParams.get('toolkit') ||
      '';
    const connectionRequestId =
      searchParams.get('connection_request_id') ||
      searchParams.get('connectionRequestId') ||
      searchParams.get('request_id') ||
      undefined;
    const connectedAccountId =
      searchParams.get('connected_account_id') ||
      searchParams.get('connectedAccountId') ||
      undefined;

    return { toolkitSlug, connectionRequestId, connectedAccountId };
  }, [searchParams]);

  useEffect(() => {
    if (!organizationUuid || !callbackParams.toolkitSlug || verifyCallback.isPending || verifyCallback.isSuccess) {
      return;
    }

    verifyCallback.mutate(callbackParams);
  }, [callbackParams, organizationUuid, verifyCallback]);

  useEffect(() => {
    if (!verifyCallback.isSuccess) {
      return;
    }

    const toolkitSlug =
      verifyCallback.data?.toolkit_slug || callbackParams.toolkitSlug;

    navigate(
      toolkitSlug
        ? Routes.dashboard.integrationApp(toolkitSlug)
        : Routes.dashboard.integrations,
      { replace: true },
    );
  }, [callbackParams.toolkitSlug, navigate, verifyCallback.data, verifyCallback.isSuccess]);

  const missingToolkit = !callbackParams.toolkitSlug;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 rounded-lg border border-border bg-surface p-5">
      <div className="flex items-start gap-3">
        <StatusIcon
          pending={verifyCallback.isPending}
          success={verifyCallback.isSuccess}
          error={verifyCallback.isError || missingToolkit}
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-foreground">
            {verifyCallback.isSuccess ? 'Integration connected' : missingToolkit ? 'Connection needs attention' : 'Verifying connection'}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {verifyCallback.isSuccess
              ? 'The connected account is ready for agent tools.'
              : missingToolkit
                ? 'The callback URL did not include a toolkit slug.'
                : verifyCallback.isError
                  ? verifyCallback.error.message
                  : 'This usually takes a moment.'}
          </p>
        </div>
      </div>

      {!verifyCallback.isSuccess ? (
        <Link
          to={Routes.dashboard.integrations}
          className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
        >
          Back to integrations
        </Link>
      ) : null}
    </div>
  );
}

function StatusIcon({
  pending,
  success,
  error,
}: {
  pending: boolean;
  success: boolean;
  error: boolean;
}) {
  if (pending) {
    return <Loader2 className="mt-1 h-5 w-5 animate-spin text-muted" />;
  }

  if (success) {
    return <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600 dark:text-emerald-300" />;
  }

  if (error) {
    return <XCircle className="mt-1 h-5 w-5 text-red-600 dark:text-red-300" />;
  }

  return <Loader2 className="mt-1 h-5 w-5 animate-spin text-muted" />;
}
