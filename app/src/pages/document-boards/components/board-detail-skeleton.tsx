import { Skeleton } from '@heroui/react';

const CARD_COUNT = 4;

export function BoardDetailSkeleton() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="mt-3 h-6 w-56 rounded" />
        <Skeleton className="mt-2 h-3.5 w-80 rounded" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-9 w-44 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <ul className="space-y-2">
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <li key={i} className="rounded-lg border border-border bg-surface-secondary/40 p-3">
            <div className="flex items-start gap-3">
              <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
              <Skeleton className="h-7 w-7 shrink-0 rounded-md" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
