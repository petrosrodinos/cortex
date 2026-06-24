import { useMemo } from 'react';
import { useOrganizationStore } from '@/stores/organization';
import { useGetUsage, useGetUsageRecords } from '@/features/executions/hooks/use-executions';
import { UsageFilters } from './components/usage-filters';
import { UsageRecordsTable } from './components/usage-records-table';
import { UsageSummarySection } from './components/usage-summary';
import { useUsageFilters } from './hooks/use-usage-filters';

export default function UsagePage() {
  const orgUuid = useOrganizationStore((state) => state.current_organization?.uuid);
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
        organizationUuid={orgUuid}
        value={filterValue}
        onChange={updateFilters}
        onReset={resetFilters}
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
