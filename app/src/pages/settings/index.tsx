import { NavLink, Outlet } from 'react-router-dom';
import { Routes } from '@/routes/routes';
import { cn } from '@/lib/utils';

const settingsNav = [
  { label: 'Organization', href: Routes.dashboard.settingsOrganization },
  { label: 'Usage', href: Routes.dashboard.settingsUsage },
  { label: 'Audit Logs', href: Routes.dashboard.settingsAuditLogs },
];

export default function SettingsLayout() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-0.5 text-sm text-muted">Manage your organization settings and preferences.</p>
      </header>

      <div className="flex gap-6">
        <nav className="w-48 shrink-0">
          <ul className="space-y-0.5">
            {settingsNav.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-surface-secondary text-foreground'
                        : 'text-muted hover:bg-surface-secondary hover:text-foreground',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
