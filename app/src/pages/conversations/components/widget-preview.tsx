import { Maximize2, X } from 'lucide-react';
import { useCallback, useEffect, useState, type FC } from 'react';
import { getWidgetContent } from '@/features/files/services/files.service';
import { cn } from '@/lib/utils';
import { getFilePreviewUrl } from '@/lib/message-markdown.utils';

const IFRAME_SANDBOX = 'allow-scripts';

interface WidgetPreviewProps {
  fileUrl: string;
  organizationUuid?: string;
  documentUuid?: string;
  title?: string;
  className?: string;
}

function WidgetIframe({
  src,
  srcDoc,
  title,
  className,
  onLoad,
}: {
  src?: string;
  srcDoc?: string;
  title: string;
  className?: string;
  onLoad?: () => void;
}) {
  return (
    <iframe
      src={src}
      srcDoc={srcDoc}
      sandbox={IFRAME_SANDBOX}
      title={title}
      onLoad={onLoad}
      className={cn('w-full rounded-lg border border-border bg-surface', className)}
    />
  );
}

export const WidgetPreview: FC<WidgetPreviewProps> = ({
  fileUrl,
  organizationUuid,
  documentUuid,
  title = 'Interactive widget',
  className,
}) => {
  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  const [directSrc, setDirectSrc] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadWidget = async () => {
      setLoadError(null);
      setSrcDoc(null);
      setDirectSrc(null);
      setIframeLoaded(false);

      if (organizationUuid && documentUuid) {
        try {
          const html = await getWidgetContent(organizationUuid, documentUuid);
          if (!cancelled) {
            setSrcDoc(html);
          }
          return;
        } catch {
          if (!cancelled) {
            setDirectSrc(getFilePreviewUrl(fileUrl));
          }
          return;
        }
      }

      if (!cancelled) {
        setDirectSrc(getFilePreviewUrl(fileUrl));
      }
    };

    void loadWidget();

    return () => {
      cancelled = true;
    };
  }, [documentUuid, fileUrl, organizationUuid]);

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

  const isReady = srcDoc != null || directSrc != null;

  if (loadError) {
    return (
      <div className={cn('mt-3 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted', className)}>
        {loadError}
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className={cn('mt-3 min-h-64 animate-pulse rounded-lg border border-border bg-surface-secondary', className)} />
    );
  }

  const iframeProps = srcDoc
    ? { srcDoc }
    : { src: directSrc ?? undefined };

  return (
    <>
      <div className={cn('relative mt-3', className)}>
        <button
          type="button"
          aria-label="Expand widget"
          onClick={() => setExpanded(true)}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-muted hover:text-foreground"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
        {!iframeLoaded && (
          <div className="absolute inset-0 min-h-64 animate-pulse rounded-lg border border-border bg-surface-secondary" />
        )}
        <WidgetIframe
          {...iframeProps}
          title={title}
          className={cn('min-h-64 h-64', !iframeLoaded && 'opacity-0')}
          onLoad={() => setIframeLoaded(true)}
        />
      </div>

      {expanded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close expanded widget"
            className="absolute inset-0 bg-[color-mix(in_oklch,black_42%,transparent)]"
            onClick={closeExpanded}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative z-[101] flex w-full max-w-6xl flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-lg"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-medium text-foreground">{title}</p>
              <button
                type="button"
                aria-label="Close"
                onClick={closeExpanded}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <WidgetIframe {...iframeProps} title={title} className="h-[85vh]" />
          </section>
        </div>
      )}
    </>
  );
};
