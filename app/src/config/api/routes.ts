export const ApiRoutes = {
    auth: {
        switchOrganization: "/auth/switch-organization",
        email: {
            login: "/auth/email/login",
            register: "/auth/email/register",
            refresh_token: "/auth/email/refresh-token",
            admin_login_to_account: (account_uuid: string) => `/auth/email/${account_uuid}/admin-login`,
            forgot_password: "/auth/forgot-password",
            reset_password: "/auth/reset-password",
            verify_email: "/auth/verify-email",
            resend_verification_email: "/auth/resend-verification-email",
        },
    },
    users: {
        prefix: "/users",
        me: "/users/me",
    },
    google_maps: {
        timezone: "/google-maps/timezone",
    },
    organizations: {
        root: "/organizations",
        by_uuid: (organizationUuid: string) => `/organizations/${organizationUuid}`,
        members: (organizationUuid: string) => `/organizations/${organizationUuid}/members`,
        member: (organizationUuid: string, organizationMemberUuid: string) => `/organizations/${organizationUuid}/members/${organizationMemberUuid}`,
        roles: (organizationUuid: string) => `/organizations/${organizationUuid}/roles`,
        role: (organizationUuid: string, organizationRoleUuid: string) => `/organizations/${organizationUuid}/roles/${organizationRoleUuid}`,
        rolePermissions: (organizationUuid: string, organizationRoleUuid: string) => `/organizations/${organizationUuid}/roles/${organizationRoleUuid}/permissions`,
        integrations: (organizationUuid: string) => `/organizations/${organizationUuid}/integrations`,
        integration: (organizationUuid: string, integrationUuid: string) => `/organizations/${organizationUuid}/integrations/${integrationUuid}`,
        integrationTest: (organizationUuid: string, integrationUuid: string) => `/organizations/${organizationUuid}/integrations/${integrationUuid}/test`,
        databaseIntegrations: (organizationUuid: string) => `/organizations/${organizationUuid}/database-integrations`,
        databaseIntegrationTestDraft: (organizationUuid: string) => `/organizations/${organizationUuid}/database-integrations/test`,
        databaseIntegration: (organizationUuid: string, integrationUuid: string) => `/organizations/${organizationUuid}/database-integrations/${integrationUuid}`,
        databaseIntegrationSync: (organizationUuid: string, integrationUuid: string) => `/organizations/${organizationUuid}/database-integrations/${integrationUuid}/sync`,
        databaseIntegrationTest: (organizationUuid: string, integrationUuid: string) => `/organizations/${organizationUuid}/database-integrations/${integrationUuid}/test`,
        integrationActions: (organizationUuid: string, integrationUuid: string) => `/organizations/${organizationUuid}/integrations/${integrationUuid}/actions`,
        integrationAction: (organizationUuid: string, integrationUuid: string, actionUuid: string) => `/organizations/${organizationUuid}/integrations/${integrationUuid}/actions/${actionUuid}`,
    },
    permissions: {
        root: "/permissions",
    },
}
