import { Skeleton } from '@heroui/react';

export function UsageSummarySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-border bg-surface p-5">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="mt-3 h-8 w-32 rounded" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <Skeleton className="h-7 w-32 rounded-lg" />
        <div className="mt-4 space-y-2 border-b border-border pb-4">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-full max-w-md rounded" />
        </div>
        <Skeleton className="mt-4 h-[300px] w-full rounded-xl" />
      </div>
    </div>
  );
}
