import type { IntegrationAppsConnectionTier } from '@/features/integration-apps/interfaces/integrationApps.interface';
import { ToggleSwitch } from './toggle-switch';

const CONNECTION_TIER_OPTIONS: Array<{
  value: IntegrationAppsConnectionTier;
  label: string;
}> = [
  { value: 'USER_PERSONAL', label: 'User personal' },
  { value: 'ORG_SHARED', label: 'Organization shared' },
];

interface ConnectionTierTogglesProps {
  tiers: IntegrationAppsConnectionTier[];
  disabled?: boolean;
  onChange: (tiers: IntegrationAppsConnectionTier[]) => void;
}

export function ConnectionTierToggles({ tiers, disabled = false, onChange }: ConnectionTierTogglesProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {CONNECTION_TIER_OPTIONS.map((option) => {
        const checked = tiers.includes(option.value);

        return (
          <div
            key={option.value}
            className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5"
          >
            <span className="text-sm text-foreground">{option.label}</span>
            <ToggleSwitch
              checked={checked}
              disabled={disabled}
              ariaLabel={`${checked ? 'Disable' : 'Enable'} ${option.label} connection tier`}
              onChange={(nextChecked) => {
                if (nextChecked) {
                  onChange([...new Set([...tiers, option.value])]);
                  return;
                }

                const nextTiers = tiers.filter((tier) => tier !== option.value);
                if (nextTiers.length === 0) {
                  return;
                }

                onChange(nextTiers);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export function formatConnectionTiers(tiers: IntegrationAppsConnectionTier[]): string {
  if (tiers.length === 0) {
    return 'None';
  }

  return tiers
    .map((tier) => CONNECTION_TIER_OPTIONS.find((option) => option.value === tier)?.label ?? tier)
    .join(', ');
}
