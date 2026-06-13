import { cn } from '@/lib/utils';
import { environments } from '@/config/environments';

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export default function Logo({
  className,
  size = 28,
  showWordmark = false,
  wordmarkClassName,
}: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <img
        src="/logo.svg"
        alt=""
        width={size}
        height={size}
        className="shrink-0"
        aria-hidden="true"
      />
      {showWordmark ? (
        <span className={cn('text-[13px] font-semibold text-foreground truncate tracking-tight', wordmarkClassName)}>
          {environments.APP_NAME}
        </span>
      ) : null}
    </span>
  );
}
