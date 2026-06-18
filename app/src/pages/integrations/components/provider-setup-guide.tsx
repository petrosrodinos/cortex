import { BookOpen, ChevronDown, ExternalLink } from 'lucide-react';
import { PROVIDER_SETUP_GUIDES } from '@/features/integrations/constants/provider-metadata';
import type { IntegrationProvider } from '@/features/integrations/interfaces/integration.interface';

export function ProviderSetupGuide({ provider }: { provider: IntegrationProvider }) {
  const guide = PROVIDER_SETUP_GUIDES[provider];
  if (!guide) return null;
  const defaultOpen = guide.credentialKind === 'oauth';

  return (
    <details open={defaultOpen} className="group rounded-lg border border-border bg-surface-secondary">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground">
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-accent" />
          Setup guide
        </span>
        <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" />
      </summary>

      <div className="grid gap-3 border-t border-border px-3 pb-3 pt-2.5">
        <p className="text-xs text-muted">{guide.summary}</p>

        {guide.credentialKind === 'oauth' && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
            This provider requires a Google Cloud OAuth app. You need a Client ID, Client Secret, Access Token, and Refresh Token — see the steps below.
          </div>
        )}

        <ol className="grid gap-1.5 list-decimal pl-4 text-xs text-muted marker:text-accent">
          {guide.steps.map((step, i) => (
            <li key={i}>
              {step.text}
              {step.code && (
                <code className="ml-1 rounded bg-surface px-1 py-0.5 font-mono text-[11px] text-foreground">
                  {step.code}
                </code>
              )}
            </li>
          ))}
        </ol>

        {guide.scopes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <span className="shrink-0 self-center text-xs text-muted">Required scopes:</span>
            {guide.scopes.map((scope) => (
              <span key={scope} className="rounded bg-surface px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                {scope}
              </span>
            ))}
          </div>
        )}

        {guide.docsUrl && (
          <a
            href={guide.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            {guide.docsLabel}
          </a>
        )}
      </div>
    </details>
  );
}
