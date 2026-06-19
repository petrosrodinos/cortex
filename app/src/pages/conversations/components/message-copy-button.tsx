import { useState, type FC } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageCopyButtonProps {
  content: string;
  className?: string;
}

export const MessageCopyButton: FC<MessageCopyButtonProps> = ({ content, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) {
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      return;
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      aria-label={copied ? 'Copied' : 'Copy message'}
      className={cn(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted/80 transition-colors hover:bg-foreground/10 hover:text-foreground',
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
};
