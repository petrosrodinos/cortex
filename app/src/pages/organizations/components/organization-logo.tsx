import { useRef } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function organizationInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

type OrganizationLogoProps = {
  name: string;
  logoUrl?: string | null;
  size?: 'sm' | 'md';
  editable?: boolean;
  loading?: boolean;
  active?: boolean;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
};

const sizeClasses = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-12 w-12 text-sm',
} as const;

export function OrganizationLogo({
  name,
  logoUrl,
  size = 'sm',
  editable = false,
  loading = false,
  active = false,
  onUpload,
  onRemove,
}: OrganizationLogoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = organizationInitials(name);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !onUpload) return;
    if (!file.type.startsWith('image/')) return;
    onUpload(file);
  }

  const avatar = (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-md font-semibold',
        sizeClasses[size],
        active ? 'bg-accent text-accent-foreground' : 'bg-surface-tertiary text-muted',
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : logoUrl ? (
        <img src={logoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        initials
      )}
      {editable && !loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
          <ImagePlus className="h-4 w-4 text-white" />
        </span>
      )}
    </span>
  );

  return (
    <div className="group relative flex shrink-0 items-center gap-1">
      {editable ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-50"
          title={`Change ${name} logo`}
        >
          {avatar}
        </button>
      ) : (
        avatar
      )}
      {editable && logoUrl && onRemove && !loading && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-surface-tertiary text-muted ring-1 ring-border transition-colors hover:bg-red-500/15 hover:text-red-400"
          title="Remove logo"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
