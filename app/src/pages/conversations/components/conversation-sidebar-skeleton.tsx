import { cn } from '@/lib/utils';

function SkeletonLine({ className }: { className: string }) {
  return <div className={cn('animate-pulse rounded bg-surface-secondary', className)} />;
}

export function ConversationSidebarSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-1" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl px-3 py-2">
          <SkeletonLine className="h-4 w-3/4" />
          <SkeletonLine className="mt-1.5 h-3 w-full" />
        </div>
      ))}
    </div>
  );
}
