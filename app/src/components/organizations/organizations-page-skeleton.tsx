import { cn } from '@/lib/utils';

export function OrganizationsPageSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-hidden="true">
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
        <SkeletonLine className="h-3 w-24" />
        <div className="flex flex-col gap-1">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
              <SkeletonLine className="h-8 w-8 rounded-md" />
              <div className="min-w-0 flex-1">
                <SkeletonLine className="h-4 w-36" />
                <SkeletonLine className="mt-1.5 h-3 w-28" />
              </div>
              <SkeletonLine className="h-5 w-14 rounded-full" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-border/60 pt-4 sm:flex-row">
          <SkeletonLine className="h-9 flex-1 rounded-lg" />
          <SkeletonLine className="h-9 w-full rounded-lg sm:w-28" />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
        <div>
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="mt-2 h-3 w-40" />
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <SkeletonLine className="h-10 flex-1 rounded-md" />
          <SkeletonLine className="h-10 w-full rounded-md md:w-48" />
          <SkeletonLine className="h-10 w-full rounded-md md:w-28" />
        </div>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid min-w-[720px] grid-cols-[1.4fr_1fr_1fr_0.6fr] border-b border-border px-4 py-3">
            {[0, 1, 2, 3].map((item) => (
              <SkeletonLine key={item} className="h-3 w-20" />
            ))}
          </div>
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className="grid min-w-[720px] grid-cols-[1.4fr_1fr_1fr_0.6fr] items-center border-b border-border/70 px-4 py-3 last:border-0"
            >
              <SkeletonLine className="h-4 w-44" />
              <SkeletonLine className="h-8 w-32 rounded-md" />
              <SkeletonLine className="h-8 w-28 rounded-md" />
              <SkeletonLine className="ml-auto h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
        <div>
          <SkeletonLine className="h-4 w-40" />
          <SkeletonLine className="mt-2 h-3 w-64" />
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <SkeletonLine className="h-10 flex-1 rounded-md" />
          <SkeletonLine className="h-10 w-full rounded-md md:w-32" />
        </div>
        <div className="grid gap-3">
          {[0, 1].map((role) => (
            <div key={role} className="rounded-lg border border-border/80 bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <SkeletonLine className="h-4 w-32" />
                  <SkeletonLine className="mt-2 h-3 w-24" />
                </div>
                <div className="flex gap-2">
                  <SkeletonLine className="h-8 w-16 rounded-md" />
                  <SkeletonLine className="h-8 w-20 rounded-md" />
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((permission) => (
                  <SkeletonLine key={permission} className="h-9 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SkeletonLine({ className }: { className: string }) {
  return <div className={cn('animate-pulse rounded bg-surface-secondary', className)} />;
}
