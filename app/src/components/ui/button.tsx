import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, loading, disabled, children, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors',
          'h-10 px-4 py-2',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'default' && 'bg-accent text-accent-foreground hover:opacity-90',
          variant === 'outline' && 'border border-border bg-surface text-foreground hover:bg-surface-secondary',
          variant === 'ghost' && 'bg-transparent text-foreground hover:bg-surface-secondary',
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button };
