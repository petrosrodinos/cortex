import { useNavigate, useParams } from 'react-router-dom';
import { ToolkitDetail } from './components/toolkit-detail';
import { Routes } from '@/routes/routes';
import { useOrganizationStore } from '@/stores/organization';
import { NoOrgPanel } from './components/no-org-panel';

export default function IntegrationAppDetailPage() {
  const { toolkitSlug } = useParams();
  const navigate = useNavigate();
  const currentOrganization = useOrganizationStore((state) => state.current_organization);

  if (!currentOrganization) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <NoOrgPanel />
      </div>
    );
  }

  if (!toolkitSlug) {
    navigate(Routes.dashboard.integrations, { replace: true });
    return null;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <ToolkitDetail
        organizationUuid={currentOrganization.uuid}
        toolkitSlug={toolkitSlug}
        onBack={() => navigate(Routes.dashboard.integrations)}
      />
    </div>
  );
}
