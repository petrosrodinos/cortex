import { NavLink, Outlet } from 'react-router-dom';
import { Routes } from '@/routes/routes';
import { cn } from '@/lib/utils';
import { canAccessNavItem } from '@/lib/organization-permissions';
import { useOrganizationPermissions } from '@/hooks/use-organization-permissions';
import { useAuthStore } from '@/stores/auth';
import { PermissionKeys } from '@/lib/organization-permissions';

const settingsNav = [
  { label: 'Profile', href: Routes.dashboard.settingsProfile },
  { label: 'Personalization', href: Routes.dashboard.settingsPersonalization },
  { label: 'Usage', href: Routes.dashboard.settingsUsage, permission: PermissionKeys.AI_USAGE_READ },
  { label: 'Audit logs', href: Routes.dashboard.settingsAuditLogs, permission: PermissionKeys.AUDIT_READ },
];

export default function SettingsLayout() {
  const userRole = useAuthStore((state) => state.role);
  const { organizationRole, organizationPermissions } = useOrganizationPermissions();

  const visibleSettingsNav = settingsNav.filter((item) =>
    canAccessNavItem(item, {
      userRole,
      organizationRole,
      organizationPermissions,
    }),
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:gap-6">
      <header>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-0.5 text-sm text-muted">Manage your account and organization settings.</p>
      </header>

      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:gap-6">
        <nav className="min-w-0 md:w-48 md:shrink-0">
          <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:mx-0 md:block md:space-y-0.5 md:overflow-visible md:px-0 md:pb-0">
            {visibleSettingsNav.map((item) => (
              <li key={item.href} className="shrink-0 md:shrink">
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
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
