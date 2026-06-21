import { NavLink, Outlet } from 'react-router-dom';
import { Routes } from '@/routes/routes';
import { cn } from '@/lib/utils';

const adminNav = [
  { label: 'Overview', href: Routes.admin.integrationApps },
  { label: 'Toolkits', href: Routes.admin.integrationAppsToolkits },
  { label: 'Sync', href: Routes.admin.integrationAppsSync },
];

export default function AdminIntegrationAppsLayout() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Integrations admin</h1>
          <p className="mt-1 text-sm text-muted">Sync, enable, and inspect integrations.</p>
        </div>
      </header>

      <nav className="-mx-1 overflow-x-auto px-1">
        <div className="flex w-max gap-1 rounded-lg border border-border bg-surface p-1">
          {adminNav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === Routes.admin.integrationApps}
              className={({ isActive }) =>
                cn(
                  'shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-surface-secondary text-foreground' : 'text-muted hover:text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <Outlet />
    </div>
  );
}
