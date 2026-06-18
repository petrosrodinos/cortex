export const Routes = {
    auth: {
        sign_in: "/auth/sign-in",
        sign_up: "/auth/sign-up",
    },
    dashboard: {
        root: "/dashboard",
        organizations: "/dashboard/organizations",
        integrations: "/dashboard/integrations",
        conversations: "/dashboard/conversations",
        conversation: (conversationUuid: string) => `/dashboard/conversations/${conversationUuid}`,
        integration: (integrationUuid: string) => `/dashboard/integrations/${integrationUuid}`,
        aiProvider: (aiProviderUuid: string) => `/dashboard/integrations/ai/${aiProviderUuid}`,
        settings: '/dashboard/settings',
        settingsProfile: '/dashboard/settings/profile',
        settingsPersonalization: '/dashboard/settings/personalization',
        settingsAiProviders: '/dashboard/integrations',
        settingsUsage: '/dashboard/settings/usage',
        settingsAuditLogs: '/dashboard/settings/audit-logs',
        execution: (executionUuid: string) => `/dashboard/executions/${executionUuid}`,
    },
};
