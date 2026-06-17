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
    },
};
