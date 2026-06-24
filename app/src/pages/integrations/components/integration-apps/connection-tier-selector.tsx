import { ComposioConnectionTier } from '@/features/integration-apps/constants/composio-connection-tier';
import type { IntegrationAppsConnectionTier } from '@/features/integration-apps/interfaces/integrationApps.interface';
import { cn } from '@/lib/utils';

export const CONNECTION_TIER_OPTIONS: Array<{
  value: IntegrationAppsConnectionTier;
  label: string;
  description: string;
}> = [
  {
    value: ComposioConnectionTier.ORG_SHARED,
    label: 'Organization',
    description: 'Shared across your organization. Anyone with access can use this connection.',
  },
  {
    value: ComposioConnectionTier.USER_PERSONAL,
    label: 'Personal',
    description: 'Only you can use this connection. Your account stays private to you.',
  },
];

export function getConnectionTierLabel(tier: IntegrationAppsConnectionTier): string {
  return CONNECTION_TIER_OPTIONS.find((option) => option.value === tier)?.label ?? tier;
}

export function getConnectionTierFromAccount(
  userUuid?: string | null,
): IntegrationAppsConnectionTier {
  return userUuid ? ComposioConnectionTier.USER_PERSONAL : ComposioConnectionTier.ORG_SHARED;
}

export function getConnectionTierOption(tier: IntegrationAppsConnectionTier) {
  return CONNECTION_TIER_OPTIONS.find((option) => option.value === tier);
}

export function getDefaultConnectionTier(
  tiers: IntegrationAppsConnectionTier[],
): IntegrationAppsConnectionTier {
  return tiers[0] ?? ComposioConnectionTier.ORG_SHARED;
}

interface ConnectionTierSelectorProps {
  tiers: IntegrationAppsConnectionTier[];
  value: IntegrationAppsConnectionTier;
  onChange: (tier: IntegrationAppsConnectionTier) => void;
  disabled?: boolean;
  name?: string;
}

export function ConnectionTierSelector({
  tiers,
  value,
  onChange,
  disabled = false,
  name = 'connection-tier',
}: ConnectionTierSelectorProps) {
  const options = CONNECTION_TIER_OPTIONS.filter((option) => tiers.includes(option.value));

  if (options.length <= 1) {
    return null;
  }

  return (
    <div className="grid gap-2" role="radiogroup" aria-label="Connection type">
      {options.map((option) => {
        const checked = value === option.value;

        return (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer gap-3 rounded-md border px-3 py-2.5 transition-colors',
              checked ? 'border-accent bg-accent/5' : 'border-border hover:bg-surface-secondary',
              disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              disabled={disabled}
              onChange={() => onChange(option.value)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">{option.label}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">{option.description}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
