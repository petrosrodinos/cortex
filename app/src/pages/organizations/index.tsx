import { useState } from 'react';
import { cn } from '@/lib/utils';
import { EmptyState } from './components/empty-state';
import { MembersSection } from './components/members-section';
import { OrganizationContextSection } from './components/organization-context-section';
import { RolesPermissionsSection } from './components/roles-permissions-section';
import { useOrganizationStore } from '@/stores/organization';

type Tab = 'members' | 'roles';

const TABS: { key: Tab; label: string }[] = [
  { key: 'members', label: 'Members' },
  { key: 'roles', label: 'Roles & permissions' },
];

export default function OrganizationsPage() {
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const [activeTab, setActiveTab] = useState<Tab>('members');

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Organisations</h1>
        <p className="mt-0.5 text-sm text-muted">
          Manage workspaces, invite members, and control access through roles.
        </p>
      </header>

      <OrganizationContextSection />

      {!currentOrganization ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col">
          <div className="flex gap-1 border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  '-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'border-accent text-foreground'
                    : 'border-transparent text-muted hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="pt-5">
            {activeTab === 'members' ? <MembersSection /> : <RolesPermissionsSection />}
          </div>
        </div>
      )}
    </div>
  );
}
