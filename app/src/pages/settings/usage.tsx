import { useMemo } from 'react';
import { useOrganizationStore } from '@/stores/organization';
import { useAuthStore } from '@/stores/auth';
import { useGetMembers } from '@/features/members/hooks/use-members';
import { useGetUsage, useGetUsageRecords } from '@/features/settings/hooks/use-settings';
import { UsageFilters } from './components/usage-filters';
import { UsageRecordsTable } from './components/usage-records-table';
import { UsageSummarySection } from './components/usage-summary';
import { useUsageFilters } from './hooks/use-usage-filters';

export default function UsagePage() {
  const orgUuid = useOrganizationStore((state) => state.current_organization?.uuid);
  const organizationPermissions = useAuthStore((state) => state.organization_permissions ?? []);
  const organizationRole = useAuthStore((state) => state.organization_role);
  const {
    dateFrom,
    dateTo,
    memberUuid,
    page,
    query,
    setPage,
    updateFilters,
    resetFilters,
  } = useUsageFilters();

  const canFilterByMember =
    organizationRole === 'Owner' || organizationPermissions.includes('ai:usage:read');

  const membersQuery = useGetMembers(canFilterByMember ? orgUuid : undefined);
  const usageQuery = useGetUsage(orgUuid, query);
  const recordsQuery = useGetUsageRecords(orgUuid, query);

  const filterValue = useMemo(
    () => ({
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      member_uuid: memberUuid || undefined,
    }),
    [dateFrom, dateTo, memberUuid],
  );

  const totalPages = recordsQuery.data?.pagination.total_pages ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Usage</h2>
        <p className="mt-0.5 text-xs text-muted">Token and cost usage for your organization.</p>
      </div>

      <UsageFilters
        value={filterValue}
        onChange={updateFilters}
        onReset={resetFilters}
        members={membersQuery.data ?? []}
        showMemberFilter={canFilterByMember}
        isLoadingMembers={membersQuery.isLoading}
      />

      <UsageSummarySection usage={usageQuery.data} isLoading={usageQuery.isLoading} />

      <UsageRecordsTable
        records={recordsQuery.data?.data ?? []}
        isLoading={recordsQuery.isLoading}
        page={page}
        totalPages={totalPages}
        total={recordsQuery.data?.pagination.total ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
}
