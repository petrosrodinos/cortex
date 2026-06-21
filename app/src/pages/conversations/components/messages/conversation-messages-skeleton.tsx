import { cn } from '@/lib/utils';

function SkeletonLine({ className }: { className: string }) {
  return <div className={cn('animate-pulse rounded bg-surface-secondary', className)} />;
}

export function ConversationMessagesSkeleton() {
  return (
    <div className="min-h-0 min-w-0 flex-1 overflow-hidden" aria-hidden="true">
      <div className="flex flex-col gap-4 p-3 md:p-4">
      <SkeletonLine className="ml-auto h-16 w-[55%] rounded-2xl" />
      <SkeletonLine className="mr-auto h-24 w-[70%] rounded-2xl" />
      <SkeletonLine className="ml-auto h-12 w-[45%] rounded-2xl" />
      <SkeletonLine className="mr-auto h-32 w-[75%] rounded-2xl" />
      </div>
    </div>
  );
}
