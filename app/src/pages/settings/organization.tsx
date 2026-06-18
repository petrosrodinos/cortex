import { useEffect, useState } from 'react';
import { useOrganizationStore } from '@/stores/organization';
import { useUpdateOrganization } from '@/features/organizations/hooks/use-organizations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function OrganizationSettingsPage() {
  const currentOrganization = useOrganizationStore((state) => state.current_organization);
  const [name, setName] = useState(currentOrganization?.name ?? '');
  const updateOrganization = useUpdateOrganization();

  useEffect(() => {
    if (currentOrganization?.name) setName(currentOrganization.name);
  }, [currentOrganization?.name]);

  const handleSave = async () => {
    if (!currentOrganization?.uuid || !name.trim()) return;
    await updateOrganization.mutateAsync({
      organization_uuid: currentOrganization.uuid,
      payload: { name: name.trim() },
    });
  };

  if (!currentOrganization) {
    return <p className="text-sm text-muted">No organization selected.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground">Organization name</h2>
        <p className="mt-0.5 text-xs text-muted">The display name for your organization.</p>
        <div className="mt-4 flex max-w-sm gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Organization name"
          />
          <Button
            onClick={handleSave}
            disabled={updateOrganization.isPending || !name.trim() || name === currentOrganization.name}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
