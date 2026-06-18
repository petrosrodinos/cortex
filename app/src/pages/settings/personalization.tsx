import { useOrganizationStore } from '@/stores/organization';
import { PersonalizationForm } from './components/personalization-form';

export default function PersonalizationPage() {
  const orgUuid = useOrganizationStore((state) => state.current_organization?.uuid);

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Personalization</h2>
        <p className="mt-0.5 text-xs text-muted">
          Customize how Cortex responds in your conversations for this workspace.
        </p>
      </div>

      <PersonalizationForm orgUuid={orgUuid} />
    </div>
  );
}
