import { Skeleton } from '@heroui/react';

function ProfileFieldSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-4 w-20 rounded" />
      <Skeleton className="h-10 w-full rounded-field" />
    </div>
  );
}

export function ProfileAccountFormSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex w-full max-w-md flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ProfileFieldSkeleton />
          <ProfileFieldSkeleton />
        </div>
        <ProfileFieldSkeleton />
        <ProfileFieldSkeleton />
        <Skeleton className="h-10 w-full rounded-field sm:w-32" />
      </div>
    </div>
  );
}
