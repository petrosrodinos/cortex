export const AppUrls = {
    billing: `${process.env.APP_URL}/dashboard/billing/account`,
    invitationSignUp: (invitation_token: string) =>
        `${process.env.APP_URL}/auth/sign-up?invitation_token=${encodeURIComponent(invitation_token)}`,
} as const;

export const ApiUrls = {
    api_url: process.env.API_URL,
} as const;
