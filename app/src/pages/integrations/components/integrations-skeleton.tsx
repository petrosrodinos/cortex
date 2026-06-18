import { cn } from '@/lib/utils';

function SkeletonLine({ className }: { className: string }) {
  return <div className={cn('animate-pulse rounded bg-surface-secondary', className)} />;
}

export function IntegrationsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col rounded-lg border border-border bg-surface">
          <div className="flex flex-1 flex-col p-5">
            <SkeletonLine className="h-11 w-11 rounded-xl" />
            <SkeletonLine className="mt-3 h-4 w-24" />
            <SkeletonLine className="mt-1.5 h-3 w-full" />
            <SkeletonLine className="mt-1 h-3 w-3/4" />
          </div>
          <div className="border-t border-border px-5 py-3">
            <SkeletonLine className="h-7 w-full rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
