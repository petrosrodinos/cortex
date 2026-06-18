import { useMemo, useState } from 'react';
import type { UsageQuery } from '@/features/executions/interfaces/usage.interfaces';

const DEFAULT_LIMIT = 20;

export function useUsageFilters() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [memberUuid, setMemberUuid] = useState('');
  const [page, setPage] = useState(1);

  const query = useMemo<UsageQuery>(() => {
    const nextQuery: UsageQuery = {
      page,
      limit: DEFAULT_LIMIT,
    };

    if (dateFrom) {
      nextQuery.date_from = dateFrom;
    }

    if (dateTo) {
      nextQuery.date_to = dateTo;
    }

    if (memberUuid) {
      nextQuery.member_uuid = memberUuid;
    }

    return nextQuery;
  }, [dateFrom, dateTo, memberUuid, page]);

  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setMemberUuid('');
    setPage(1);
  };

  const updateDateFrom = (value: string) => {
    setDateFrom(value);
    setPage(1);
  };

  const updateDateTo = (value: string) => {
    setDateTo(value);
    setPage(1);
  };

  const updateMemberUuid = (value: string) => {
    setMemberUuid(value);
    setPage(1);
  };

  const updateFilters = (nextFilters: { date_from?: string; date_to?: string; member_uuid?: string }) => {
    setDateFrom(nextFilters.date_from ?? '');
    setDateTo(nextFilters.date_to ?? '');
    setMemberUuid(nextFilters.member_uuid ?? '');
    setPage(1);
  };

  return {
    dateFrom,
    dateTo,
    memberUuid,
    page,
    query,
    setPage,
    updateDateFrom,
    updateDateTo,
    updateMemberUuid,
    updateFilters,
    resetFilters,
  };
}
