import { Skeleton } from '@heroui/react';

export function AdminIntegrationAppsOverviewSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-border bg-surface px-4 py-3">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="mt-2 h-7 w-16 rounded" />
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <section key={index} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-full max-w-xs rounded" />
              </div>
              <Skeleton className="h-4 w-4 shrink-0 rounded" />
            </div>
            <Skeleton className="mt-4 h-10 w-32 rounded-md" />
          </section>
        ))}
      </div>
    </div>
  );
}
