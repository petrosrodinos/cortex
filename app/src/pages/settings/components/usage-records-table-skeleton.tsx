import { Skeleton } from '@heroui/react';

export function UsageRecordsTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Skeleton className="h-4 w-40 rounded" />
        <Skeleton className="mt-2 h-3 w-72 rounded" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="border-b border-border bg-surface-secondary px-4 py-3">
          <Skeleton className="h-3 w-full rounded" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="grid grid-cols-8 gap-3 px-4 py-3">
              <Skeleton className="col-span-1 h-3 rounded" />
              <Skeleton className="col-span-1 h-3 rounded" />
              <Skeleton className="col-span-2 h-3 rounded" />
              <Skeleton className="col-span-1 h-6 rounded-full" />
              <Skeleton className="col-span-1 h-3 rounded" />
              <Skeleton className="col-span-1 h-3 rounded" />
              <Skeleton className="col-span-1 h-3 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
