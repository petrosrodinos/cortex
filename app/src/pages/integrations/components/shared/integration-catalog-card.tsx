import type { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const integrationCatalogGridClassName =
  'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

interface IntegrationCatalogCardProps {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
  footer: ReactNode;
  onHeaderClick?: () => void;
  className?: string;
}

export const IntegrationCatalogCard: FC<IntegrationCatalogCardProps> = ({
  icon,
  title,
  description,
  meta,
  badge,
  footer,
  onHeaderClick,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border border-border bg-surface transition-colors hover:bg-surface-secondary',
        className,
      )}
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          {icon}
          {badge}
        </div>
        {onHeaderClick ? (
          <button
            type="button"
            onClick={onHeaderClick}
            className="mt-3 text-left text-sm font-semibold text-foreground hover:opacity-80"
          >
            {title}
          </button>
        ) : (
          <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
        )}
        {description ? <div className="mt-1">{description}</div> : null}
        {meta ? <div className="mt-3">{meta}</div> : null}
      </div>
      <div className="border-t border-border px-5 py-3">{footer}</div>
    </div>
  );
};

interface IntegrationCatalogConnectedBadgeProps {
  label?: string;
}

export const IntegrationCatalogConnectedBadge: FC<IntegrationCatalogConnectedBadgeProps> = ({
  label = 'Connected',
}) => (
  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-300">
    {label}
  </span>
);

interface IntegrationCatalogCardActionProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

export const IntegrationCatalogCardAction: FC<IntegrationCatalogCardActionProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'w-full rounded-md px-3 py-1.5 text-xs font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50',
      variant === 'primary'
        ? 'bg-accent text-accent-foreground hover:opacity-90'
        : 'bg-surface-secondary text-foreground hover:bg-surface-tertiary',
      className,
    )}
  >
    {children}
  </button>
);

export function IntegrationCatalogCardSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={integrationCatalogGridClassName} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col rounded-lg border border-border bg-surface">
          <div className="flex flex-1 flex-col p-5">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-surface-secondary" />
            <div className="mt-3 h-4 w-24 animate-pulse rounded bg-surface-secondary" />
            <div className="mt-1.5 h-3 w-full animate-pulse rounded bg-surface-secondary" />
            <div className="mt-1 h-3 w-3/4 animate-pulse rounded bg-surface-secondary" />
          </div>
          <div className="border-t border-border px-5 py-3">
            <div className="h-7 w-full animate-pulse rounded-md bg-surface-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
}
