import { EmptyState } from './components/empty-state';
import { MembersSection } from './components/members-section';
import { OrganizationContextSection } from './components/organization-context-section';
import { RolesPermissionsSection } from './components/roles-permissions-section';
import { useOrganizationStore } from '@/stores/organization';

export default function OrganizationsPage() {
  const currentOrganization = useOrganizationStore((state) => state.current_organization);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <header>
        <h1 className="text-xl font-semibold text-foreground">Organisations</h1>
        <p className="text-sm text-muted">Create organisations, switch context, and manage members, roles, and permissions.</p>
      </header>

      <OrganizationContextSection />

      {!currentOrganization ? (
        <EmptyState title="No organisation selected" body="Create or select an organisation to manage members, roles, and permissions." />
      ) : (
        <>
          <MembersSection />
          <RolesPermissionsSection />
        </>
      )}
    </div>
  );
}
