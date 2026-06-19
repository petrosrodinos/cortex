import { Skeleton } from '@heroui/react';

export function ExecutionDetailSkeleton() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32 rounded" />
            <Skeleton className="h-3 w-64 rounded" />
          </div>
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-border bg-surface p-4">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="mt-3 h-7 w-24 rounded" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="mt-4 h-24 w-full rounded-lg" />
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="mt-4 h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}
