import { Link } from 'react-router-dom';
import { PlugZap } from 'lucide-react';
import { Routes } from '@/routes/routes';

export function NoOrgPanel() {
  return (
    <section className="rounded-lg border border-border bg-surface p-6">
      <PlugZap className="h-5 w-5 text-accent" />
      <h2 className="mt-3 text-sm font-semibold text-foreground">No organisation selected</h2>
      <p className="mt-1 text-sm text-muted">Select an organisation before managing integrations.</p>
      <Link
        to={Routes.dashboard.organizations}
        className="mt-4 inline-flex h-9 items-center rounded-md border border-border px-3 text-sm text-muted hover:bg-surface-secondary hover:text-foreground"
      >
        Organisations
      </Link>
    </section>
  );
}
