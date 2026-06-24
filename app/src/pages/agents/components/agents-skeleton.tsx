import { Skeleton } from '@heroui/react';

const ROW_COUNT = 4;

export function AgentsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-surface-secondary/60">
            <tr>
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <Skeleton className="h-3 w-16 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROW_COUNT }).map((_, i) => (
              <tr key={i} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3"><Skeleton className="h-4 w-32 rounded" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-24 rounded" /></td>
                <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-28 rounded" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-28 rounded" /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-6 w-10 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
