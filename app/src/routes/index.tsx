import { Routes as ReactRoutes, Route, Navigate } from "react-router-dom";
import { Routes } from "@/routes/routes";
import ProtectedRoute from "@/routes/protected-route";
import SignIn from "@/pages/auth/pages/sign-in";
import SignUp from "@/pages/auth/pages/sign-up";
import AuthLayout from "@/pages/auth/layout";
import DashboardLayout from "@/pages/dashboard/layout";
import DashboardHome from "@/pages/dashboard";
import OrganizationsPage from "@/pages/organizations";
import IntegrationsPage from "@/pages/integrations";
import IntegrationAppsCallbackPage from "@/pages/integrations/integrationApps-callback";
import ConversationsPage from "@/pages/conversations";
import SettingsLayout from "@/pages/settings";
import ProfilePage from "@/pages/settings/profile";
import PersonalizationPage from "@/pages/settings/personalization";
import UsagePage from "@/pages/settings/usage";
import AuditLogsPage from "@/pages/settings/audit-logs";
import ExecutionDetailPage from "@/pages/executions";
import AdminIntegrationAppsLayout from "@/pages/admin/integrationApps/layout";
import AdminIntegrationAppsDashboardPage from "@/pages/admin/integrationApps";
import AdminIntegrationAppsToolkitsPage from "@/pages/admin/integrationApps/toolkits";
import AdminIntegrationAppsToolkitDetailPage from "@/pages/admin/integrationApps/toolkit-detail";
import AdminIntegrationAppsSyncPage from "@/pages/admin/integrationApps/sync";
import { RoleTypes } from "@/features/user/interfaces/user.interface";

export default function AppRoutes() {
  return (
    <ReactRoutes>
      {/* Auth routes */}
      <Route
        path="/auth"
        element={
          <ProtectedRoute loggedIn={false}>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route index element={<Navigate to={Routes.auth.sign_in} replace />} />
      </Route>

      {/* Dashboard routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute loggedIn={true}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="organizations" element={<OrganizationsPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="integrations/callback" element={<IntegrationAppsCallbackPage />} />
        <Route path="integrations/ai/:aiProviderUuid" element={<IntegrationsPage />} />
        <Route path="integrations/:integrationUuid" element={<IntegrationsPage />} />
        <Route path="conversations" element={<ConversationsPage />} />
        <Route path="conversations/:conversationUuid" element={<ConversationsPage />} />
        <Route path="organizations/members" element={<Navigate to={Routes.dashboard.organizations} replace />} />
        <Route path="organizations/roles" element={<Navigate to={Routes.dashboard.organizations} replace />} />
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to={Routes.dashboard.settingsProfile} replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="personalization" element={<PersonalizationPage />} />
          <Route path="password" element={<Navigate to={Routes.dashboard.settingsProfile} replace />} />
          <Route path="ai-providers" element={<Navigate to={Routes.dashboard.integrations} replace />} />
          <Route path="usage" element={<UsagePage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
        </Route>
        <Route path="executions/:executionUuid" element={<ExecutionDetailPage />} />
      </Route>

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute loggedIn={true} requiredRoles={[RoleTypes.SUPER_ADMIN]} fallbackPath={Routes.dashboard.root}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route element={<AdminIntegrationAppsLayout />}>
          <Route index element={<Navigate to={Routes.admin.integrationApps} replace />} />
          <Route path="integrations/apps" element={<AdminIntegrationAppsDashboardPage />} />
          <Route path="integrations/apps/toolkits" element={<AdminIntegrationAppsToolkitsPage />} />
          <Route path="integrations/apps/toolkits/:toolkitSlug" element={<AdminIntegrationAppsToolkitDetailPage />} />
          <Route path="integrations/apps/sync" element={<AdminIntegrationAppsSyncPage />} />
        </Route>
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={Routes.auth.sign_in} replace />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </ReactRoutes>
  );
}
