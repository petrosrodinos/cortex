import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Organization } from '@/features/organizations/interfaces/organization.interfaces';

interface OrganizationStore {
  current_organization: Organization | null;
  organizations: Organization[];
  set_organizations(organizations: Organization[]): void;
  set_current_organization(organization: Organization | null): void;
  clear_organizations(): void;
}

export const useOrganizationStore = create<OrganizationStore>()(
  devtools(
    persist(
      (set) => ({
        current_organization: null,
        organizations: [],
        set_organizations: (organizations) =>
          set((state) => ({
            organizations,
            current_organization:
              organizations.find((organization) => organization.uuid === state.current_organization?.uuid) ??
              organizations[0] ??
              null,
          })),
        set_current_organization: (organization) => set({ current_organization: organization }),
        clear_organizations: () => set({ current_organization: null, organizations: [] }),
      }),
      { name: 'organization' },
    ),
  ),
);
