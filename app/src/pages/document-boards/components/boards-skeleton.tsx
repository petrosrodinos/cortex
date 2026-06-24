import { Skeleton } from '@heroui/react';

const ROW_COUNT = 4;

export function BoardsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-surface-secondary/60">
            <tr>
              {Array.from({ length: 4 }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <Skeleton className="h-3 w-16 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROW_COUNT }).map((_, i) => (
              <tr key={i} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3"><Skeleton className="h-4 w-36 rounded" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-48 rounded" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-24 rounded" /></td>
                <td className="px-4 py-3 text-right">
                  <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
