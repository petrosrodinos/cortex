import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Organization } from '@/features/organizations/interfaces/organization.interfaces';

interface OrganizationStore {
  current_organization: Organization | null;
  organizations: Organization[];
  setOrganizations(organizations: Organization[]): void;
  setCurrentOrganization(organization: Organization | null): void;
  clearOrganizations(): void;
}

export const useOrganizationStore = create<OrganizationStore>()(
  devtools(
    persist(
      (set) => ({
        current_organization: null,
        organizations: [],
        setOrganizations: (organizations) =>
          set((state) => ({
            organizations,
            current_organization:
              organizations.find((organization) => organization.uuid === state.current_organization?.uuid) ??
              organizations[0] ??
              null,
          })),
        setCurrentOrganization: (organization) => set({ current_organization: organization }),
        clearOrganizations: () => set({ current_organization: null, organizations: [] }),
      }),
      { name: 'organization' },
    ),
  ),
);
