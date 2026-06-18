import { cn } from '@/lib/utils';

function SkeletonLine({ className }: { className: string }) {
  return <div className={cn('animate-pulse rounded bg-surface-secondary', className)} />;
}

export function ConversationMessagesSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4" aria-hidden="true">
      <SkeletonLine className="ml-auto h-16 w-[55%] rounded-2xl" />
      <SkeletonLine className="mr-auto h-24 w-[70%] rounded-2xl" />
      <SkeletonLine className="ml-auto h-12 w-[45%] rounded-2xl" />
      <SkeletonLine className="mr-auto h-32 w-[75%] rounded-2xl" />
    </div>
  );
}
