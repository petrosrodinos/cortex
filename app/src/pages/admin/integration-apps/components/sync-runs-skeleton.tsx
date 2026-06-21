import { Skeleton } from '@heroui/react';

const ROW_COUNT = 6;

export function AdminIntegrationAppsSyncRunsSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: ROW_COUNT }).map((_, index) => (
        <div key={index} className="grid gap-2 px-4 py-3 md:grid-cols-[120px_120px_1fr_auto] md:items-center">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-full max-w-md rounded" />
          <Skeleton className="h-3 w-32 rounded md:justify-self-end" />
        </div>
      ))}
    </div>
  );
}
