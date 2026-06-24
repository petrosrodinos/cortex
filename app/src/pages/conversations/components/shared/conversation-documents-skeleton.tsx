function SkeletonItem() {
  return (
    <li className="rounded-lg border border-border bg-surface-secondary/40 p-3">
      <div className="flex items-start gap-3">
        <div className="h-4 w-4 shrink-0 rounded bg-surface-secondary" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="h-3 w-2/3 rounded bg-surface-secondary" />
          <div className="h-2.5 w-1/3 rounded bg-surface-secondary" />
        </div>
        <div className="h-7 w-7 shrink-0 rounded bg-surface-secondary" />
      </div>
    </li>
  );
}

export function ConversationDocumentsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="animate-pulse space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonItem key={i} />
      ))}
    </ul>
  );
}
