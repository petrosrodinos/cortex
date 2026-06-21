import { Maximize2, X } from 'lucide-react';
import { useCallback, useEffect, useState, type FC } from 'react';
import { cn } from '@/lib/utils';

interface ExpandableImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const ExpandableImage: FC<ExpandableImageProps> = ({
  src,
  alt,
  className,
  containerClassName,
}) => {
  const [expanded, setExpanded] = useState(false);

  const closeExpanded = useCallback(() => {
    setExpanded(false);
  }, []);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeExpanded();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeExpanded, expanded]);

  return (
    <>
      <div className={cn('relative inline-block w-fit max-w-full overflow-hidden rounded-lg border border-border', containerClassName)}>
        <button
          type="button"
          aria-label="Expand image"
          onClick={() => setExpanded(true)}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-muted hover:text-foreground"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
        <img src={src} alt={alt} className={cn('block max-h-48 max-w-full object-contain', className)} />
      </div>

      {expanded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close expanded image"
            className="absolute inset-0 bg-[color-mix(in_oklch,black_42%,transparent)]"
            onClick={closeExpanded}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="relative z-[101] flex max-h-[90vh] w-full max-w-6xl flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-lg"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-medium text-foreground">{alt}</p>
              <button
                type="button"
                aria-label="Close"
                onClick={closeExpanded}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto">
              <img src={src} alt={alt} className="max-h-[75vh] max-w-full object-contain" />
            </div>
          </section>
        </div>
      )}
    </>
  );
};
