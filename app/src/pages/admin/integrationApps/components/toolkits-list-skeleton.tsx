import { Skeleton } from '@heroui/react';

const ROW_COUNT = 8;

export function AdminToolkitsListSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: ROW_COUNT }).map((_, index) => (
        <div key={index} className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-36 max-w-full rounded" />
              <Skeleton className="h-3 w-24 max-w-full rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-14 rounded" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
          <div className="flex items-center gap-3 md:justify-end">
            <Skeleton className="h-5 w-9 rounded-full" />
            <Skeleton className="h-9 w-16 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
