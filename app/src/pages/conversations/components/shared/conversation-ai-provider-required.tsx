import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Routes } from '@/routes/routes';

export const ConversationAiProviderRequired: FC = () => (
  <div className="shrink-0 min-w-0 border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-5">
    <div className="rounded-2xl border border-border bg-surface-secondary px-4 py-5 text-center sm:px-6">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-muted">
        <Sparkles className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-medium text-foreground">Connect an AI provider to chat</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">
        Cortex needs OpenAI, Claude, or Grok connected before it can reply to your messages.
      </p>
      <Link
        to={Routes.dashboard.integrationsSection('ai')}
        className="mt-4 inline-flex h-9 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Connect AI provider
      </Link>
    </div>
  </div>
);
